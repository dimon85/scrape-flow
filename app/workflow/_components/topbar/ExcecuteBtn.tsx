"use client";

import React from 'react';
import { PlayIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { useMutation } from '@tanstack/react-query';
import { RunWorkflow } from '@/actions/workflows/runWorkflow';
import { toast } from 'sonner';
import { useReactFlow } from '@xyflow/react';
import { useRouter } from 'next/navigation';

const ExcecuteBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: ({ workflowId, executionId }) => {
      toast.success("Execution started", { id: 'flow-execution' });

      router.push(`/workflow/runs/${workflowId}/${executionId}`);
    },
    onError: () => {
      toast.error("something went wrong", { id: 'flow-execution' });
    }
  })

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          // client side validation
          return;
        }

        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16}  className="stroke-orange-400"/>
      Execute
    </Button>
  )
}

export default ExcecuteBtn;