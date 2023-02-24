import { Request, Response } from "express";
import fs from "fs";

async function setCookie(req: Request, res: Response) {
  try {
    const cookieString = req.body.cookie;
    if (!cookieString) {
      throw new Error("Missing required parameters: cookie");
    }

    fs.writeFileSync("cookie.txt", cookieString);
    res.status(200).json({ message: "Cookie set" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export default setCookie;
