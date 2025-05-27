import { ExecutionEnvironment } from '@/types/executor';
import { WaitForElementTask } from '@/lib/workflow/task/WaitForElement';
export const WaitForElementExecutor = async (environment: ExecutionEnvironment<typeof WaitForElementTask>): Promise<boolean> => {
  try {
    const selector = environment.getInput("Selector");
    if(!selector) {
      environment.log.error("input->selector is not defined");
    }

    const visibility = environment.getInput("Visibility");
    if(!visibility) {
      environment.log.error("input->visibility is not defined");
    }


    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });

    environment.log.info(`Wait for element ${selector} to be: ${visibility}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};