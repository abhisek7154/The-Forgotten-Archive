import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Appbar } from "../components/Appbar";
import { BlogFull } from "../components/BlogFull";

type Blog = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
  };
};

export const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setBlog(response.data.post);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!blog) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center mt-10 text-gray-500">
          Blog not found.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <BlogFull
        title={blog.title}
        content={blog.content}
        authorName={blog.author?.name}
        publishedDate={new Date(blog.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      />
    </div>
  );
};
