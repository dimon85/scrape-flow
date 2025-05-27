import { ExecutionEnvironment } from '@/types/executor';
import { AddPropertyToJsonTask } from '@/lib/workflow/task/task/AddPropertyToJson';

function parseAPIResponse(rawResponse: any) {
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

export const AddPropertyToJsonExecutor = async (
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>
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

    const propertyValue = environment.getInput("Property value");
    if(!propertyValue) {
      environment.log.error("input->propertyValue is not defined");
    }

    const json = parseAPIResponse(jsonData);
    console.log('***json: ', json);
    json[propertyName] = propertyValue;
  

    environment.setOutput('Updated JSON', JSON.stringify(json));
    
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};