import { TaskType, TaskParamType } from "@/types/task";
import { MousePointerClick, LucideProps } from "lucide-react";
import { WorkflowTask } from "@/types/workflows";

export const ClickElementTask =  {
  type: TaskType.CLICK_ELEMENT,
  label: "Click Element",
  icon: (props: LucideProps) => (
    <MousePointerClick className="stroke-orange-400" {...props} />
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
