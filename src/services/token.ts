import { GetNextJSURL } from "@/utils/geturl";

export default async function getToken(): Promise<string> {
  let url = "/api/gettoken";
  GetNextJSURL(url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error(
      "[getToken] Failed to get authentication token. Status:",
      response.status,
    );
    throw new Error("Failed to get authentication token");
  }

  const { tokenJWT } = await response.json();
  return tokenJWT;
}
