import { Request, Response } from "express";
import { errorIdentifier, eventEndIdentifier } from "../constant";

async function generateTest(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  function sendEvent(data: string) {
    res.write(`data: ${data}\n\n`);
  }

  if (req.query.senderror) {
    sendEvent(`${errorIdentifier} Test error occured`);
  } else {
    sendEvent("Hello World");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    sendEvent("Hello World 2");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    sendEvent("Hello World 3");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    sendEvent("Hello World 4");
  }
  sendEvent(eventEndIdentifier);
}

export default generateTest;
