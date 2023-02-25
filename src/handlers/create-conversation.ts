import axios, { getCookie } from "../utils/axios-instance";
import { Request, Response } from "express";

async function createConversation(req: Request, res: Response) {
  try {
    const response = await axios.get("/turing/conversation/create", {
      headers: {
        cookie: getCookie(),
      },
    });
    const data = response.data;

    if (data.result.value !== "Success") {
      throw new Error("Error creating conversation");
    }

    res.json({
      message: "Conversation created successfully",
      conversationId: data.conversationId,
      clientId: data.clientId,
      conversationSignature: data.conversationSignature,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export default createConversation;
