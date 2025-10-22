const DocumentLinks = ({ doc }) => {
    if (!doc || !doc.viewLink) return <span className="text-gray-500">Not Provided</span>;
    return (
        <div className="flex space-x-2">
            <a
                href={doc.viewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
            >
                View
            </a>
            <span className="text-gray-300">|</span>
            <a
                href={doc.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 hover:underline transition-colors duration-200"
            >
                Download
            </a>
        </div>
    );
};

export default DocumentLinks