import WebSocket from "ws";
import {
  allowedMessageTypes,
  locale,
  optionSets,
  region,
  sliceIds,
} from "../constant";
import getInvocationId from "../utils/invocationId";
import packJson from "../utils/pack-json";
import { Request, Response } from "express";

async function generate(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  function sendEvent(data: string) {
    res.write(`data: ${data}\n\n`);
  }

  try {
    const { conversationId, clientId, conversationSignature, text } = req.body;
    if (!conversationId || !clientId || !conversationSignature || !text) {
      throw new Error(
        "Missing required parameters: conversationId, clientId, conversationSignature, text"
      );
    }

    const ws = new WebSocket("wss://sydney.bing.com/sydney/ChatHub", {
      perMessageDeflate: false,
    });
    const invocationId = getInvocationId(conversationId);

    let data = "";

    await new Promise((resolve, reject) => {
      ws.on("error", () => {
        reject("Connection error");
      });

      ws.on("open", async () => {
        ws.send(packJson({ protocol: "json", version: 1 }));
        ws.send(packJson({ type: 6 }));
        await new Promise((resolve) => setTimeout(resolve, 1000));
        ws.send(
          packJson({
            arguments: [
              {
                source: "cib",
                optionsSets: optionSets,
                allowedMessageTypes: allowedMessageTypes,
                sliceIds: sliceIds,
                traceId: "",
                isStartOfSession: invocationId === "1",
                message: {
                  locale: locale,
                  market: locale,
                  region: region,
                  location: "",
                  locationHints: [],
                  timestamp: new Date().toISOString(),
                  author: "user",
                  inputMethod: "Keyboard",
                  text: text,
                  messageType: "Chat",
                },
                conversationSignature: conversationSignature,
                participant: { id: clientId },
                conversationId: conversationId,
              },
            ],
            invocationId: invocationId,
            target: "chat",
            type: 4,
          })
        );
      });

      let timeout: NodeJS.Timeout | undefined;

      ws.on("message", (message) => {
        try {
          let response = message.toString();
          response = response.slice(0, -1);
          let json = JSON.parse(response);

          switch (json.type) {
            case 1:
              let jsonobj = json.arguments[0].messages[0];
              let textdata = jsonobj.text;
              if (timeout) clearTimeout(timeout);

              if (!textdata.includes("Searching the web")) {
                if (!jsonobj.messageType) {
                  data = textdata;
                  sendEvent(data);
                }

                timeout = setTimeout(() => {
                  console.log("Resolved by timeout");
                  ws.close();
                  resolve("Resolved by timeout");
                }, 3000);
              }

              break;

            case 7:
              ws.close();
              resolve("Ok");
          }

          if (json.error) {
            ws.close();
            reject(json.error);
          }
        } catch (e) {}
      });
    });

    if (!data) throw new Error("No data generated, please try agains");
    sendEvent("END");
    res.end();
  } catch (error: any) {
    res.status(500);
    sendEvent(`Error: ${error.message}`);
    sendEvent("END");
    res.end();
  }
}

export default generate;
