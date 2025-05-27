import { TaskType, TaskParamType } from "@/types/task";
import { LucideProps, DatabaseIcon } from "lucide-react";
import { WorkflowTask } from "@/types/workflows";

export const AddPropertyToJsonTask =  {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  label: "Add property to JSON",
  icon: (props: LucideProps) => (
    <DatabaseIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: 'JSON',
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: 'Property name',
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: 'Property value',
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    { name: 'Updated JSON', type: TaskParamType.STRING },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
