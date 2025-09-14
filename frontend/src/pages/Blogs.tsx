import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";
import { Link } from "react-router-dom";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return <div>loading...</div>;
  }

  if (!blogs.length) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center">
          <div className="max-w-xl text-gray-500 mt-10">No blogs found.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="max-w-xl">
          {blogs.map((blog: any) => (
            <Link to={`/blog/${blog.id}`} key={blog.id}>
              <BlogCard
                authorName={blog.author?.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={new Date(blog.createdAt).toDateString()} // you can swap with blog.createdAt
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
