import axios from "axios";

async function createConversation(
  url: string,
  headers: { [key: string]: string } = {}
) {
  const response = await axios.post(
    `${url}/create-conversation`,
    {},
    {
      headers: headers || {},
    }
  );

  const data = response.data;

  return {
    conversationId: data.conversationId,
    clientId: data.clientId,
    conversationSignature: data.conversationSignature,
    // encode uri
    conversationUrl: `${url}/generate?conversationId=${encodeURIComponent(
      data.conversationId
    )}&clientId=${encodeURIComponent(
      data.clientId
    )}&conversationSignature=${encodeURIComponent(data.conversationSignature)}`,
  };
}

function generate(conversationUrl: string, text: string) {
  const eventSource = new EventSource(`${conversationUrl}&text=${text}`);
  return eventSource;
}

export { createConversation, generate };
