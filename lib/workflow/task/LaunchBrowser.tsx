import { GlobeIcon, LucideProps } from "lucide-react";
import { TaskType, TaskParamType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";

export const LaunchBrowserTask =  {
  type: TaskType.LAUNCH_BROWSER,
  label: "Launch browser",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: 'Website URL',
      type: TaskParamType.STRING,
      helperText: "eg: https://www.google.com",
      required: true,
      hideHandle: true,
    }
  ] as const,
  outputs: [{ name: 'Web page', type: TaskParamType.BROWSER_INSTANCE }] as const,
  credits: 5,
} satisfies WorkflowTask;
