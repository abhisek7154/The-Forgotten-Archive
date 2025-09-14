import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config"

export const useBlogs = () => {
  const [loading, setLoading] = useState(true)
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setBlogs(response.data.posts);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching blogs:", err);
      setLoading(false);
    });
  }, [])

  return {
    loading,
    blogs,
  }
}
