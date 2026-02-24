export const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
export const CHAT_MODEL = process.env.LLAMA_MODEL ?? "llama3.2:latest";

export type LlamaGenerateChunk = {
  response?: string;
  done?: boolean;
  done_reason?: string;
};

export async function createLlamaGenerateStream(
  prompt: string,
  system: string,
  signal?: AbortSignal
) {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      prompt,
      system,
      stream: true,
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Ollama request failed with status ${response.status}`);
  }

  return response.body;
}
