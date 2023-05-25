import { AUTH0_CLIENT } from "../globs/node";
import { ChatCompletionRequestMessage } from "openai";
import { error, log } from "@tsmodule/log";
import { DOMAIN_URL, PLATFORM } from "../globs/shared";
import { addToTranscript, getTranscript } from "./filesystem";

export async function checkAuth() {
  const authorized = await AUTH0_CLIENT.isAuthorized();
  if (!authorized) {
    error("You are not logged in.", [], { postLines: 1 });

    log("Use UPG to log in using `upg login`:", ["dim"]);
    // log("https://gptlabs.us/upg", ["underline"]);

    process.exit(1);
  }
}

export type Transcript = ChatCompletionRequestMessage[];

export const sendChatMessage = async (message: string): Promise<string> => {
  await addToTranscript({ role: "user", content: message });

  const transcript = await getTranscript();
  const apiRequest = await AUTH0_CLIENT.fetch(
    `${DOMAIN_URL}/api/gsh/shell`,
    {
      method: "POST",
      body: JSON.stringify({
        platform: PLATFORM,
        transcript,
      }),
    }
  );

  const response = await apiRequest.text();

  await addToTranscript(
    { role: "assistant", content: response }
  );

  return response;
};