import { Link } from "react-router-dom";
import { Avatar } from "./BlogCard";

export const Appbar = () => {
  // Try to fetch the username from localStorage (you can store this during signin/signup)
  const userName = localStorage.getItem("name") || "Anonymous";

  return (
    <div className="border-b flex justify-between px-10 py-4">
      {/* Left side - Logo/brand */}
      <div className="flex flex-col justify-center font-bold text-lg cursor-pointer">
        <Link to="/blogs">Medium</Link>
      </div>

      {/* Right side - Avatar */}
      <div>
        <Avatar size={"big"} name={userName} />
      </div>
    </div>
  );
};
