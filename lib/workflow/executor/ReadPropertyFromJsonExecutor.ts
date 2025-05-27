import { ExecutionEnvironment } from '@/types/executor';
import { ReadPropertyFromJsonTask } from '@/lib/workflow/task/ReadPropertyFromJson';

function parseAPIResponse(rawResponse) {
  try {
    // Attempt direct parse (if already valid JSON)
    return JSON.parse(rawResponse); 
  } catch {
    // If parsing fails, try removing Markdown wrappers
    try {
      const cleanJson = rawResponse.replace(/^```json|```$/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return {}; // Fallback
    }
  }
}

export const ReadPropertyFromJsonExecutor = async (
  environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>
): Promise<boolean> => {
  try {
    const jsonData = environment.getInput("JSON");
    if(!jsonData) {
      environment.log.error("input->jsonData is not defined");
    }

    const propertyName = environment.getInput("Property name");
    if(!propertyName) {
      environment.log.error("input->propertyName is not defined");
    }

    const json = parseAPIResponse(jsonData);
  
    const propertyValue = json[propertyName];
    if (propertyValue === undefined) {
      environment.log.error(`Property "${propertyName}" not found in JSON data`);
      return false;
    }

    environment.setOutput("Property value", propertyValue);
    
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};