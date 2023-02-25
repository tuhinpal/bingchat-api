/**

Creates a conversation with the specified URL and headers.
@param {string} url - The URL to create the conversation with.
@param {Object} headers - The headers to use for the request. Defaults to an empty object.
@returns {Promise<Object>} An object containing information about the created conversation.
*/
async function createConversation(url, headers = {}) {
  let fetch;

  // Try importing the ESM version of axios
  if (typeof window === "undefined") {
    fetch = require("node-fetch");
  } else {
    fetch = window.fetch;
  }

  const response = await fetch(`${url}/create-conversation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
  const data = await response.json();

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
class Generate {
  constructor(conversationUrl, text) {
    this.conversationUrl = conversationUrl;
    this.text = text;
    this.eventSource = new EventSource(
      `${this.conversationUrl}&text=${encodeURIComponent(this.text)}`
    );
  }

  onMessage(callback) {
    this.eventSource.onmessage = (event) => {
      callback(event);

      if (event.data === "[END]") {
        console.log("Conversation ended");
        this.eventSource.close();
      }
    };
  }

  onError(callback) {
    this.eventSource.onerror = (event) => {
      callback(event);
    };
  }

  onOpen(callback) {
    this.eventSource.onopen = (event) => {
      callback(event);
    };
  }

  close() {
    this.eventSource.close();
  }
}

export { createConversation, Generate };
