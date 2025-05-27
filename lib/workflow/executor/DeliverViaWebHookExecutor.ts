import { ExecutionEnvironment } from '@/types/executor';
import { DeliverViaWebHookTask } from '@/lib/workflow/task/DeliverViaWebHook';
export const DeliverViaWebHookExecutor = async (environment: ExecutionEnvironment<typeof DeliverViaWebHookTask>): Promise<boolean> => {
  try {
    const targetUrl = environment.getInput("Target URL");
    if(!targetUrl) {
      environment.log.error("input->targetUrl is not defined");
    }
    const body = environment.getInput("Body");
    if(!body) {
      environment.log.error("input->body is not defined");
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const statusCode = response.status;
    if (statusCode !== 200) {
      environment.log.error(`Webhook delivery failed with status code: ${statusCode}`);
      return false;
    }

    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody, null, 4));

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};