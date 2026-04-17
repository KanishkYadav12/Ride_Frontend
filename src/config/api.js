const rawBaseUrl = import.meta.env.VITE_BASE_URL;

if (!rawBaseUrl) {
  throw new Error(
    "Missing VITE_BASE_URL. Set it in your frontend environment (for example in Vercel project settings).",
  );
}

let parsedUrl;

try {
  parsedUrl = new URL(rawBaseUrl);
} catch {
  throw new Error(
    `Invalid VITE_BASE_URL: "${rawBaseUrl}". It must be a full URL like https://api.example.com`,
  );
}

if (!["http:", "https:"].includes(parsedUrl.protocol)) {
  throw new Error(
    `Invalid VITE_BASE_URL protocol: "${parsedUrl.protocol}". Use http or https.`,
  );
}

if (
  import.meta.env.PROD &&
  ["localhost", "127.0.0.1"].includes(parsedUrl.hostname)
) {
  throw new Error(
    `VITE_BASE_URL points to localhost in production: "${rawBaseUrl}". Set it to your deployed backend URL.`,
  );
}

const pathname = parsedUrl.pathname.replace(/\/+$/, "");
export const API_BASE_URL = `${parsedUrl.origin}${pathname}`;
