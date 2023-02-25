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

  const conversationUrl = `${url}/generate?conversationId=${encodeURIComponent(
    data.conversationId
  )}&clientId=${encodeURIComponent(
    data.clientId
  )}&conversationSignature=${encodeURIComponent(data.conversationSignature)}`;

  return {
    conversationId: data.conversationId,
    clientId: data.clientId,
    conversationSignature: data.conversationSignature,
    conversationUrl: conversationUrl,
  };
}

/**
  
  Generates an event source with the specified conversation URL and text.
  @param {string} conversationUrl - The conversation URL to generate the event source with.
  @param {string} text - The text to include in the event source.
  @returns {EventSource} The generated event source.
  */
class Generate {
  constructor(conversationUrl) {
    this.conversationUrl = conversationUrl;
    this.eventSource = null;
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  throwIfEventNotConstructed() {
    if (!this.eventSource) {
      throw new Error(
        "Event source is not constructed. call generate() first."
      );
    }
  }

  generate(text) {
    this.eventSource = new EventSource(
      `${this.conversationUrl}&text=${encodeURIComponent(text)}`
    );
  }

  onMessage(callback) {
    this.throwIfEventNotConstructed();
    this.eventSource.addEventListener("message", (event) => {
      if (event.data !== "[END]" && !event.data.startsWith("[ERROR]")) {
        callback(event.data);
      }
    });
  }

  onFinished(callback) {
    this.throwIfEventNotConstructed();
    this.eventSource.addEventListener("message", (event) => {
      if (event.data === "[END]") {
        callback("Stream ended");
        close();
      }
    });
  }

  onError(callback) {
    this.throwIfEventNotConstructed();
    this.eventSource.addEventListener("error", (event) => {
      callback("An error occurred while attempting to connect");
      close();
    });

    this.eventSource.addEventListener("message", (event) => {
      if (event.data.startsWith("[ERROR]")) {
        let errordata = event.data.replace("[ERROR] ", "");
        callback(errordata);
        close();
      }
    });
  }

  onOpen(callback) {
    this.throwIfEventNotConstructed();
    this.eventSource.addEventListener("open", (event) => {
      callback(event);
    });
  }
}

export { createConversation, Generate };
