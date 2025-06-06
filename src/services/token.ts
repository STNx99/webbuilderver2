export default async function getToken(): Promise<string> {
  const response = await fetch("/api/gettoken", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get authentication token");
  }

  const { tokenJWT } = await response.json();
  return tokenJWT;
}