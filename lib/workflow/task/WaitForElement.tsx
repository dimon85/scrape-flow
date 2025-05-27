import { TaskType, TaskParamType } from "@/types/task";
import { LucideProps, EyeIcon } from "lucide-react";
import { WorkflowTask } from "@/types/workflows";

export const WaitForElementTask =  {
  type: TaskType.WAIT_FOR_ELEMENT,
  label: "Wait for element",
  icon: (props: LucideProps) => (
    <EyeIcon className="stroke-amber-400" {...props} />
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
    {
      name: 'Visibility',
      type: TaskParamType.SELECT,
      hideHandle: true,
      required: true,
      options: [
        { label: 'Visible', value: 'visible' },
        { label: 'Hidden', value: 'hidden' },
      ]
    },
  ] as const,
  outputs: [
    { name: 'Web page', type: TaskParamType.BROWSER_INSTANCE },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
