/**

Creates a conversation with the specified URL and headers.
@param {string} url - The URL to create the conversation with.
@param {Object} headers - The headers to use for the request. Defaults to an empty object.
@returns {Promise<Object>} An object containing information about the created conversation.
*/
async function createConversation(url, headers = {}) {
  let axios;

  try {
    // Try importing the ESM version of axios
    axios = (await import("axios")).default;
  } catch (e) {
    // If that fails, assume we're in a CommonJS environment and require the CJS version of axios
    axios = require("axios");
  }

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

/**
  
  Generates an event source with the specified conversation URL and text.
  @param {string} conversationUrl - The conversation URL to generate the event source with.
  @param {string} text - The text to include in the event source.
  @returns {EventSource} The generated event source.
  */
function generate(conversationUrl, text) {
  const eventSource = new EventSource(`${conversationUrl}&text=${text}`);
  return eventSource;
}

export { createConversation, generate };
