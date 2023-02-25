import axios from "axios";
import fs from "fs";

export function getCookie(): string {
  let cookie = "";
  try {
    cookie = fs.readFileSync("cookie.txt", "utf8");
  } catch (err) {
    console.error(`No cookie.txt file found`);
  }

  return cookie;
}

const instance = axios.create({
  baseURL: "https://www.bing.com",
  headers: {
    "content-type": "application/json",
    referer: "https://www.bing.com/",
    origin: "https://www.bing.com",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.50",
  },
});

export default instance;
