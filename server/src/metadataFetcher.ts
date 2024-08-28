import axios, { AxiosError } from "axios";
import * as cheerio from "cheerio";

export const metadataFetcher = async (url: string) => {
  try {
    const response = await axios.get(url, { timeout: 2000 });
    const $ = cheerio.load(response.data);
    const title = $("title").text() || "";
    const description = $('meta[name="description"]').attr("content") || "";
    const image = $('meta[property="og:image"]').attr("content") || "";
    return { title, description, image };
  } catch (error) {
    const err = error as AxiosError;
    return { title: `Error fetching metadata from ${url}` };
  }
};
