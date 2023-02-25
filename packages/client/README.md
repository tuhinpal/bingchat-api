# Bing chatai client

## Uses [bingchat-api](https://github.com/tuhinpal/bingchat-api) for backend.

### Pre-requisites

- You need to have a [bingchat-api](https://github.com/tuhinpal/bingchat-api) server running

### Installation

```
npm install bing-chatai-client
```

### Implementation

- Create a new conversation

  ```javascript
  import { createConversation, Generate } from "bing-chatai-client";

  const conversation = await createConversation("http://localhost:8080");
  console.log(conversation);
  ```

- Send a message

  ```javascript
  import { createConversation, Generate } from "bing-chatai-client";

  const gen = new Generate(conversation.conversationUrl);

  gen.generate("Hello bing what is an ai?");

  gen.onMessage((data) => {
    console.log(data);
  });

  gen.onFinished((message) => {
    console.info(message);
  });

  gen.onError((message) => {
    console.error(message);
  });
  ```

### Created by [Tuhin Kanti Pal](https://github.com/tuhinpal)
