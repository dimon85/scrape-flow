import { TaskType, TaskParamType } from "@/types/task";
import { LucideProps, ArrowUpIcon } from "lucide-react";
import { WorkflowTask } from "@/types/workflows";

export const ScrollToElementTask =  {
  type: TaskType.SCROLL_TO_ELEMENT,
  label: "Scroll to element",
  icon: (props: LucideProps) => (
    <ArrowUpIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: 'Selector',
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    { name: 'Web page', type: TaskParamType.BROWSER_INSTANCE },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
