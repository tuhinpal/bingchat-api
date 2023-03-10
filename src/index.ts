import express from "express";
import cors from "cors";
import createConversation from "./handlers/create-conversation";
import generate from "./handlers/generate";
import setCookie from "./handlers/set-cookie";
import generateTest from "./handlers/generate-test";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/create-conversation", createConversation);
app.get("/generate", generate);
app.get("/generate-test", generateTest);
app.post("/set-cookie", setCookie);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
