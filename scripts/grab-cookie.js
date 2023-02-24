// Runs on Developer Tools > Console

const cookie = document.cookie;
const serverUrl = "http://localhost:8080";

fetch(`${serverUrl}/set-cookie`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ cookie }),
})
  .then((res) => res.json())
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
