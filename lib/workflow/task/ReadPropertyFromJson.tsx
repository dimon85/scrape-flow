import { TaskType, TaskParamType } from "@/types/task";
import { LucideProps, FileJson2Icon } from "lucide-react";
import { WorkflowTask } from "@/types/workflows";

export const ReadPropertyFromJsonTask =  {
  type: TaskType.READ_PROPERTY_FROM_JSON,
  label: "Read property from JSON",
  icon: (props: LucideProps) => (
    <FileJson2Icon className="stroke-orange-400" {...props} />
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
  ] as const,
  outputs: [
    { name: 'Property value', type: TaskParamType.STRING },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
