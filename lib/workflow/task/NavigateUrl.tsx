import { TaskType, TaskParamType } from "@/types/task";
import { LucideProps, Link2Icon } from "lucide-react";
import { WorkflowTask } from "@/types/workflows";

export const NavigateUrlTask =  {
  type: TaskType.NAVIGATE_URL,
  label: "Navigate URL",
  icon: (props: LucideProps) => (
    <Link2Icon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: 'URL',
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    { name: 'Web page', type: TaskParamType.BROWSER_INSTANCE },
  ] as const,
  credits: 2,
} satisfies WorkflowTask;
