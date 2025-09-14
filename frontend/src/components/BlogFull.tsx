interface BlogFullProps {
  title: string;
  content: string;
  authorName?: string | null;
  publishedDate: string;
}

export const BlogFull = ({
  title,
  content,
  authorName,
  publishedDate,
}: BlogFullProps) => {
  return (
    <div className="flex justify-center mt-10 px-6">
      {/* Blog content */}
      <div className="max-w-3xl w-full">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-3">{title}</h1>

        {/* Date */}
        <p className="text-gray-500 mb-6">Posted on {publishedDate}</p>

        {/* Full content */}
        <div className="text-lg leading-8 whitespace-pre-line">{content}</div>
      </div>

      {/* Author sidebar */}
      <div className="ml-12 w-60">
        <h2 className="text-lg font-semibold mb-2">Author</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="font-bold">{authorName || "Anonymous"}</p>
          <p className="text-gray-600 text-sm">
            {authorName
              ? "Master of words, sharing thoughts and ideas."
              : "This author prefers to stay anonymous."}
          </p>
        </div>
      </div>
    </div>
  );
};
