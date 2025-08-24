export default async function getToken(): Promise<string> {
  let url = "/api/gettoken";
  if (typeof window === "undefined") {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";
    url = `${base}/api/gettoken`;
  }

  const response = await fetch(url, {
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
