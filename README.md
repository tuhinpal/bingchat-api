![Bing Chat API](https://user-images.githubusercontent.com/51857187/221339911-75f3e232-1c7b-4877-b3fe-8a1b77c5c744.jpg)

## Deployment

Deploy natively

```bash
  git clone https://github.com/tuhinpal/bingchat-api.git
  cd bingchat-api
  npm run build
  npm start
```

Deploy with Docker

```bash
  git clone https://github.com/tuhinpal/bingchat-api.git
  cd bingchat-api
  docker build -t bingchat-api .
  docker run it -d -p 8080:8080 bingchat-api
```

Or, You can fork this repository and connect it to any provider which supports Docker/NodeJS.

## Post Deploy

This api need your cookie to generate conversation. So, you should have beta access. After deployment login to that bing account and open developer console. Then paste the code (replace your `serverUrl`).

```javascript
const cookie = document.cookie;
const serverUrl = "http://localhost:8080";

fetch(`${serverUrl}/set-cookie`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ cookie }),
})
  .then((res) => res.json())
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
```

## API Reference

#### Create a conversation

```
  POST /create-conversation
```

#### Generate

```
  GET /generate
```

| Query Parameter         | Type     | Description                                       |
| :---------------------- | :------- | :------------------------------------------------ |
| `conversationId`        | `string` | **Required**. Get it after `/create-conversation` |
| `clientId`              | `string` | **Required**. Get it after `/create-conversation` |
| `conversationSignature` | `string` | **Required**. Get it after `/create-conversation` |
| `text`                  | `string` | **Required**. Text prompt                         |

**Note:** It uses EventSource stream to send content upon generation.

## Client library

Use the client library to implement these with ease.

```
npm install bing-chatai-client
```

```javascript
import { createConversation, Generate } from "bing-chatai-client";

const conversation = await createConversation("http://localhost:8080");

console.log(conversation);

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

## Author

- [@tuhinpal](https://www.github.com/tuhinpal)

## Feedback

If you have any feedback, please reach me out at me[at]thetuhin.com.

## Contributing

Contributions are always welcome!

## License and Leagal

This project is licensed under [MIT](https://github.com/tuhinpal/bingchat-api/blob/master/LICENSE). This project is made as a proof of concept and doesnot meant to harm microsoft.
