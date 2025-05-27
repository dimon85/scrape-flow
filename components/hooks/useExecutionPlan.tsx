import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { FlowToExecutionPlan, FlowToExecutionPlanValidationError } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import useFlowValidation from "@/components/hooks/useFlowValidation";
import { toast } from "sonner";

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback((error: any) => {
    switch (error.type) {
      case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
        toast.error("No entry point found in the workflow.");
        break;
      case FlowToExecutionPlanValidationError.INVALID_INPUTS:
        toast.error("Not all inputs values are set.");
        setInvalidInputs(error.invalidElements);
        break;
      default:
        toast.error("An unknown error occurred.");
        break;
    }
  }, [setInvalidInputs]);

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(nodes as AppNode[], edges);

    if (error) {
      handleError(error);
      return null;
    }

    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);
  return generateExecutionPlan;
};

export default useExecutionPlan;