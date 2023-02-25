import WebSocket from "ws";
import {
  allowedMessageTypes,
  contentIntervalTimeout,
  errorIdentifier,
  eventEndIdentifier,
  locale,
  nextLineIdentifier,
  noContentTimeout,
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
    const { conversationId, clientId, conversationSignature, text } =
      req.query as {
        conversationId: string;
        clientId: string;
        conversationSignature: string;
        text: string;
      };

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
      let timeout: NodeJS.Timeout | undefined = setTimeout(() => {
        ws.close();
        reject(new Error("Taking too long"));
      }, noContentTimeout);

      ws.on("error", () => {
        if (timeout) clearTimeout(timeout);
        reject(new Error("Connection error"));
      });

      ws.on("close", () => {
        if (timeout) clearTimeout(timeout);
      });

      ws.on("open", async () => {
        ws.send(packJson({ protocol: "json", version: 1 }));
        ws.send(packJson({ type: 6 }));
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

      ws.on("message", (message) => {
        try {
          let response = message.toString();
          response = response.slice(0, -1);
          let json = JSON.parse(response);

          switch (json.type) {
            case 1:
              let jsonobj = json.arguments[0].messages[0];
              let textdata = jsonobj.text;

              if (!textdata.includes("Searching the web")) {
                if (!jsonobj.messageType) {
                  data = textdata;
                  let replaced = data.replace(
                    /(\r\n|\n|\r)/gm,
                    nextLineIdentifier
                  );
                  sendEvent(replaced);
                }

                if (timeout) clearTimeout(timeout);

                timeout = setTimeout(() => {
                  console.log("Resolved by timeout");
                  ws.close();
                  resolve("Resolved by timeout");
                }, contentIntervalTimeout);
              }

              break;

            case 2:
              if (json.item?.result?.error)
                reject(new Error(json.item.result.error));
              if (json.item?.result?.value === "InvalidSession")
                reject(new Error("Invalid session, please generate again"));

              if (!data) {
                let botmessage = json.item.messages?.find(
                  (m: any) => m.author === "bot"
                );

                if (botmessage && botmessage.hiddenText) {
                  data = botmessage.hiddenText;
                  let replaced = data.replace(
                    /(\r\n|\n|\r)/gm,
                    nextLineIdentifier
                  );
                  sendEvent(replaced);
                }
              }
              break;

            case 7:
              ws.close();
              resolve("Maybe resolved");
              break;
          }

          if (json.error) {
            ws.close();
            reject(new Error(json.error));
          }
        } catch (e) {}
      });
    });

    if (!data) throw new Error("No data generated, please try again");
    sendEvent(eventEndIdentifier);
    res.end();
  } catch (error: any) {
    sendEvent(`${errorIdentifier} ${error.message}`);
    sendEvent(eventEndIdentifier);
    res.end();
  }
}

export default generate;
