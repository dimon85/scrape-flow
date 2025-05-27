import { ExecutionEnvironment } from '@/types/executor';
import { ClickElementTask } from '@/lib/workflow/task/ClickElement';
export const ClickElementExecutor = async (environment: ExecutionEnvironment<typeof ClickElementTask>): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if(!selector) {
      environment.log.error("input->selector is not defined");
    }


    await environment.getPage()!.click(selector);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};