import { TaskType, TaskParamType } from "@/types/task";
import { LucideProps, TextIcon } from "lucide-react";
import { WorkflowTask } from "@/types/workflows";

export const ExtractTextFromElementTask =  {
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract Text from Element",
  icon: (props: LucideProps) => (
    <TextIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: 'Html',
      type: TaskParamType.STRING,
      required: true,
      variant: 'textarea',
    },
    {
      name: 'Selector',
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    { name: 'Extracted text', type: TaskParamType.STRING },
  ] as const,
  credits: 2,
} satisfies WorkflowTask;
