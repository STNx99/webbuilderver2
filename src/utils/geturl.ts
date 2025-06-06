export default function GetUrl(path: string): string {
  const baseUrl =
    process.env.GO_SERVER_URL ||
    process.env.NEXT_PUBLIC_GO_SERVER_URL ||
    "http://localhost:8080/api/v1";
  return `${baseUrl}${path}`;
}
