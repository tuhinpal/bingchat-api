![Bing Chat API](https://export-download.canva.com/k5ze8/DAFbjFk5ze8/8/0/0001-4294355171.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJHKNGJLC2J7OGJ6Q%2F20230225%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230225T043534Z&X-Amz-Expires=8069&X-Amz-Signature=7c1941c599f0f9699103c196f5e69f7f8ce183bcc3ea286baa4e8c181c78298a&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27bingchat-api.jpg&response-expires=Sat%2C%2025%20Feb%202023%2006%3A50%3A03%20GMT)

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

This api need your cookie to generate conversation. So, you should have beta access. After deployment login to that bing account and open developer console. Then paste the code (replace your serverurl).

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

```http
  POST /create-conversation
```

#### Generate

```http
  GET /generate
```

| Query Parameter         | Type     | Description                                       |
| :---------------------- | :------- | :------------------------------------------------ |
| `conversationId`        | `string` | **Required**. Get it after `/create-conversation` |
| `clientId`              | `string` | **Required**. Get it after `/create-conversation` |
| `conversationSignature` | `string` | **Required**. Get it after `/create-conversation` |
| `text`                  | `string` | **Required**. Text prompt                         |

**Note:** It used EventSource stream to send content upon generation.

#### Use the client library to implement these with ease

```bash
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

This project is licensed under [Apache-2.0](https://choosealicense.com/licenses/apache-2.0/). This project is made as a proof of concept and doesnot meant to harm microsoft.

## Color Reference

| Color         | Hex                                                              |
| ------------- | ---------------------------------------------------------------- |
| Example Color | ![#0a192f](https://via.placeholder.com/10/0a192f?text=+) #0a192f |
| Example Color | ![#f8f8f8](https://via.placeholder.com/10/f8f8f8?text=+) #f8f8f8 |
| Example Color | ![#00b48a](https://via.placeholder.com/10/00b48a?text=+) #00b48a |
| Example Color | ![#00d1a0](https://via.placeholder.com/10/00b48a?text=+) #00d1a0 |
