import express from "express";
import cors from "cors";
import xss from "xss";
import helmet from "helmet";
import { metadataFetcher } from "./metadataFetcher";
import rateLimit from "express-rate-limit";

export const port = 3000;

// Create an Express application
const app = express();

// Apply security middleware
app.use(helmet()); // Set various HTTP headers for security
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json());

// Configure rate limiting middleware
const limiter = rateLimit({
  windowMs: 1000, // 1 second window
  max: 5, // Limit each IP to 5 requests per windowMs
});

// Apply rate limiting to all routes
app.use(limiter);

// Fetches metadata for the provided URLs
app.post("/fetch-metadata", async (req, res) => {
  const urls: string[] = req.body.urls;
  // Sanitize URLs to prevent XSS attacks
  const sanitizedUrls: string[] = urls.map((url) => xss(url));
  // Fetch metadata for each sanitized URL
  const response = await Promise.all(
    sanitizedUrls.map(async (url) => await metadataFetcher(url))
  );
  // Send the metadata as JSON response
  res.json(response);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
