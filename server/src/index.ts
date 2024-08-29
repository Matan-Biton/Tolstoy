import express from "express";
import cors from "cors";
import xss from "xss";
import helmet from "helmet";
import { metadataFetcher } from "./metadataFetcher";
import rateLimit from "express-rate-limit";

export const port = 3000;

const app = express();

// Apply security middleware
app.use(helmet());

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json());

// Configure rate limiting middleware
const limiter = rateLimit({
  windowMs: 1000,
  max: 5,
});

app.use(limiter);

app.post("/fetch-metadata", async (req, res) => {
  const urls: string[] = req.body.urls;
  // Sanitize URLs to prevent XSS attacks
  const sanitizedUrls: string[] = urls.map((url) => xss(url));
  const response = await Promise.all(
    sanitizedUrls.map(async (url) => await metadataFetcher(url))
  );
  res.json(response);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
