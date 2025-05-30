import { LaunchBrowserExecutor } from "@/lib/workflow/executor/LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "@/lib/workflow/executor/PageToHtmlExecutor";
import { ExtractTextFromElementExecutor } from "@/lib/workflow/executor/ExtractTextFromElementExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflows";
import { FillInputExecutor } from "@/lib/workflow/executor/FillInputExecutor";
import { ClickElementExecutor } from "@/lib/workflow/executor/ClickElementExecutor";
import { WaitForElementExecutor } from "@/lib/workflow/executor/WaitForElementExecutor";
import { DeliverViaWebHookExecutor } from "@/lib/workflow/executor/DeliverViaWebHookExecutor";
import { ExtractDataWithAIExecutor } from "@/lib/workflow/executor/ExtractDataWithAIExecutor";
import { ReadPropertyFromJsonExecutor } from "@/lib/workflow/executor/ReadPropertyFromJsonExecutor";
import { AddPropertyToJsonExecutor } from "@/lib/workflow/executor/AddPropertyToJsonExecutor";
import { NavigateUrlExecutor } from "@/lib/workflow/executor/NavigateElementExecutor";
import { ScrollToElementExecutor } from "@/lib/workflow/executor/ScrollToElementExecutor";

type ExecutorFn<T extends WorkflowTask> = (enviroment: ExecutionEnvironment<T>) => Promise<boolean>
type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
}
export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForElementExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebHookExecutor,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAIExecutor,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  NAVIGATE_URL: NavigateUrlExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor,
};