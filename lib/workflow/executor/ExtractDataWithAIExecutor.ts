import OpenAI from "openai";
import prisma from '@/lib/prisma';
import { ExecutionEnvironment } from '@/types/executor';
import { ExtractDataWithAITask } from '@/lib/workflow/task/ExtractDataWithAI';
import { symmetricDecrypt } from '@/lib/encryption';
export const ExtractDataWithAIExecutor = async (environment: ExecutionEnvironment<typeof ExtractDataWithAITask>): Promise<boolean> => {
  try {
    const credentials = environment.getInput("Credentials");
    if(!credentials) {
      environment.log.error("input->credentials is not defined");
    }

    const prompt = environment.getInput("Prompt");
    if(!prompt) {
      environment.log.error("input->prompt is not defined");
    }

    const content = environment.getInput("Content");
    if(!content) {
      environment.log.error("input->content is not defined");
    }

    // Get credentials from DB
    const credential = await prisma.credential.findUnique({
      where: {
        id: credentials,
      },
    });
  
    if (!credential) {
      environment.log.error("Credential not found");
      return false;
    }
    const plainCredentialValue = symmetricDecrypt(credential.value);
    if(!plainCredentialValue) {
      environment.log.error("Cannot decrypt credential value");
      return false;
    }

    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: plainCredentialValue,
    });

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a web scraping expert. You will be given a prompt and a content. Your task is to extract the data from the content based on the prompt. The response should always be only the extracted data as a JSON, without any additional word or explanations. If you cannot extract the data, return an empty JSON object. Woork only with provided content and ensure the output is always a valid JSON array without any surrounding text",
        },
        {
          role: "user",
          content: content,
        },
        {
          role: "user",
          content: prompt,
        }
      ],
    model: "deepseek-chat",
  });


    environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
    environment.log.info(`Completion tokens: ${response.usage?.completion_tokens}`);

    console.log('response.choices[0]: ', response.choices[0]);
    const result = response.choices[0].message?.content;
    if (!result) {
      environment.log.error("empty response from AI");
      return false;
    }

    environment.setOutput("Extracted data", result);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
};