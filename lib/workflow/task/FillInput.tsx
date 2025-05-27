import { TaskType, TaskParamType } from "@/types/task";
import { Edit3Icon, LucideProps } from "lucide-react";
import { WorkflowTask } from "@/types/workflows";

export const FillInputTask =  {
  type: TaskType.FILL_INPUT,
  label: "Fill input",
  icon: (props: LucideProps) => (
    <Edit3Icon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    },
    {
      name: 'Selector',
      type: TaskParamType.STRING,
      required: true
    },
    {
      name: 'Value',
      type: TaskParamType.STRING,
      required: true
    },
  ] as const,
  outputs: [
    { name: 'Web page', type: TaskParamType.BROWSER_INSTANCE }
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
