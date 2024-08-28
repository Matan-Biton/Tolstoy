import React, { useState } from "react";
import MetaData, { MetadataItem } from "./MetaData";
import axios from "axios";

/**
 * Renders a form for entering URLs and displaying metadata for the submitted URLs.
 *
 * When the form is submitted, the URLs are sent to the server, which fetches the metadata
 * for each URL and returns the results. The metadata is then displayed in the component.
 *
 * @returns {JSX.Element} The rendered UrlForm component.
 */
function UrlForm(): JSX.Element {
  const [urls, setUrls] = useState<string[]>(["", "", ""]);
  const [metadata, setMetadata] = useState<MetadataItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => setUrls([...urls, ""]);

  const removeUrlField = (index: number) =>
    setUrls(urls.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    axios
      .post("http://localhost:3000/fetch-metadata", {
        urls,
      })
      .then((response) => {
        setMetadata(response.data);
      })
      .catch(() => {
        setError("An error occurred. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-3xl w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">URL Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {urls.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <label className="flex-shrink-0">URL {index + 1}:</label>
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                required
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {index >= 3 && (
                <button
                  type="button"
                  onClick={() => removeUrlField(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={addUrlField}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
            >
              Add Another URL
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {metadata.length > 0 && <MetaData metadata={metadata} />}
      </div>
    </div>
  );
}

export default UrlForm;
