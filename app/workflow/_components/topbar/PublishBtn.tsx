"use client";

import React from 'react';
import { UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useReactFlow } from '@xyflow/react';
import { PublishWorkflow } from '@/actions/workflows/publishWorkflow';

const PublishBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success('Workflow published', { id: workflowId });
    },
    onError: () => {
      toast.error("something went wrong", { id: workflowId });
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

        toast.loading("Publishing workflow", { id: workflowId });
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon size={16}  className="stroke-sky-400"/>
      Publish
    </Button>
  )
}

export default PublishBtn;
