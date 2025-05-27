import { TaskType, TaskParamType } from "@/types/task";
import { LucideProps, SendIcon } from "lucide-react";
import { WorkflowTask } from "@/types/workflows";

export const DeliverViaWebHookTask =  {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: "Deliver via Webhook",
  icon: (props: LucideProps) => (
    <SendIcon className="stroke-blue-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: 'Target URL',
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: 'Body',
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [] as const,
  credits: 1,
} satisfies WorkflowTask;
