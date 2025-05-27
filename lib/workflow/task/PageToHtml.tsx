import { TaskType, TaskParamType } from "@/types/task";
import { CodeIcon, LucideProps } from "lucide-react";
import { WorkflowTask } from "@/types/workflows";

export const PageToHtmlTask =  {
  type: TaskType.PAGE_TO_HTML,
  label: "Get HTML from page",
  icon: (props: LucideProps) => (
    <CodeIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true
    },
  ] as const,
  outputs: [
    { name: 'Html', type: TaskParamType.STRING },
    { name: 'Web page', type: TaskParamType.BROWSER_INSTANCE }
  ] as const,
  credits: 2,
} satisfies WorkflowTask;
