import React, { useState } from "react";
import MetaData, { MetadataItem } from "./MetaData";
import axios from "axios";

// UrlForm component allows users to input multiple URLs and fetch metadata for them.
function UrlForm(): JSX.Element {
  // State for managing URLs, metadata, loading state, and errors
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

  // Handles form submission by sending URLs to the server and updating metadata.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
