import axios, { AxiosError } from "axios";
import * as cheerio from "cheerio";

/**
 * Fetches metadata from a given URL.
 *
 * This function attempts to retrieve the title, description, and image
 * from the specified URL's HTML content. It uses axios for the HTTP request
 * and cheerio for parsing the HTML.
 *
 */
export const metadataFetcher = async (url: string) => {
  try {
    // Fetch the HTML content of the URL with a 2-second timeout
    const response = await axios.get(url, { timeout: 2000 });

    // Parse the HTML content using cheerio
    const $ = cheerio.load(response.data);

    // Extract metadata from the parsed HTML
    const title = $("title").text() || "";
    const description = $('meta[name="description"]').attr("content") || "";
    const image = $('meta[property="og:image"]').attr("content") || "";

    return { title, description, image };
  } catch (error) {
    // Handle any errors that occur during the fetch process
    const err = error as AxiosError;
    return { title: `Error fetching metadata from ${url}` };
  }
};
