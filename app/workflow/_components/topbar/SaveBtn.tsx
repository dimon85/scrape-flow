"use client";

import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { UpdateWorkflow } from '@/actions/workflows/updateWorkflow';

const SaveBtn = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Flow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      console.error('Error saving workflow: ', { id: "save-workflow" });
    },
  })

  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("saving workflow...", { id: "save-workflow" });
        saveMutation.mutate({
          id: workflowId,
          definition: workflowDefinition,
        });
      }}
    >
      <CheckIcon size={16}  className="stroke-green-400"/>
      Save
    </Button>
  )
}

export default SaveBtn;