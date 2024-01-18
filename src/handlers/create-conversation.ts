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

    // fix to catch the new security-challence signature from response-headers
    //console.log("Response Headers:", response.headers);
    if (!data.conversationSignature) {
      data.publicConversationSignature = response.headers['x-sydney-conversationsignature'];
      data.encryptedConversationSignature = response.headers['x-sydney-encryptedconversationsignature'];
    }

    const conversationPath = `/generate?conversationId=${encodeURIComponent(
      data.conversationId
    )}&clientId=${encodeURIComponent(
      data.clientId
    )}&conversationSignature=${encodeURIComponent(data.conversationSignature)}`;

    res.json({
      message: "Conversation created successfully",
      conversationId: data.conversationId,
      clientId: data.clientId,
      publicConversationSignature: data.conversationSignature,
      encryptedConversationSignature: data.encryptedConversationSignature,
      conversationPath,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export default createConversation;
