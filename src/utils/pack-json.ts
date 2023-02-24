import { endOfStream } from "../constant";

export default function packJson(data: Object): string {
  return JSON.stringify(data) + endOfStream;
}
