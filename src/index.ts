import express from "express";
import cors from "cors";
import createConversation from "./handlers/create-conversation";
import generate from "./handlers/generate";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/createConversation", createConversation);
app.post("/generate", generate);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
