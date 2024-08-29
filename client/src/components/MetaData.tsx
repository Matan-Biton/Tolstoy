export interface MetadataItem {
  title: string;
  description: string;
  image: string;
}

interface MetaDataProps {
  metadata: MetadataItem[];
}

// MetaData component displays a list of metadata items.
function MetaData({ metadata }: MetaDataProps) {
  // Filter out metadata items with empty fields
  const filteredMetadata = metadata.filter(
    (item) => item.title || item.description || item.image
  );

  // If no valid metadata items, display a message
  if (filteredMetadata.length === 0) {
    return <p className="mt-6 font-bold">No metadata found.</p>;
  }
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Metadata Results</h2>
      {filteredMetadata.map((item, index) => (
        <div
          key={index}
          className="mb-4 p-6 border flex justify-center xs:justify-between rounded max-xs:flex-col "
        >
          <div>
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p>{item.description}</p>
          </div>
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="mt-2 max-w-64 max-h-64 h-auto object-contain"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default MetaData;
