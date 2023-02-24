import fs from "fs";

function getInvocationId(conversationId: string): string {
  const invocationIdPath = `temp/invocationId/${encodeURIComponent(
    conversationId
  )}.txt`;
  let previousInvocationId = 0;

  try {
    previousInvocationId = parseInt(fs.readFileSync(invocationIdPath, "utf8"));
  } catch (error) {
    if (!fs.existsSync("temp/invocationId")) {
      console.log("Creating temp/invocationId");
      fs.mkdirSync("temp/invocationId", { recursive: true });
    }
  }

  const invocationId = (previousInvocationId + 1).toString();
  fs.writeFileSync(invocationIdPath, invocationId);
  return invocationId;
}

export default getInvocationId;
