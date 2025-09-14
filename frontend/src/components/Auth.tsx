import { useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { SignupInput } from "abhi-medium-blog";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate()
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  async function sendRequst(){
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}` , postInputs);
      console.log("Response:", response.data);  // confirm shape
      const {jwt , email , name}= response.data;
      localStorage.setItem("token" , jwt)
      localStorage.setItem("email", email);
      localStorage.setItem("name", name || "");
      navigate("/blogs")
    } catch (e) {
      alert("Error while signing up")
      console.error(e)
    }
  }


  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="max-w-lg text-center mb-8">
        <p className="text-4xl font-bold">
          {type === "signup" ? "Create an account" : "Sign in"}
        </p>
        <p className="text-xl font-light">
          {type === "signup"
            ? "Already have an account?"
            : "Don’t have an account?"}
          <Link
            className="pl-2 underline"
            to={type === "signin" ? "/signup" : "/signin"}
          >
            {type === "signin" ? "sign up" : "sign in"}
          </Link>
        </p>
      </div>

      <div className="w-full max-w-md sm:w-full">
        {type === "signup" && (
          <LabelledInput
            label="Name"
            placeholder="Abhisek Sahoo"
            onChange={(e) =>
              setPostInputs({ ...postInputs, name: e.target.value })
            }
          />
        )}
        <LabelledInput
          label="Email"
          placeholder="Abhi@hotmail.com"
          onChange={(e) =>
            setPostInputs({ ...postInputs, email: e.target.value })
          }
        />
        <LabelledInput
          label="Password"
          placeholder="********"
          type="password"
          onChange={(e) =>
            setPostInputs({ ...postInputs, password: e.target.value })
          }
        />
        <button
          onClick={sendRequst}
          type="button"
          className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 
                     focus:outline-none focus:ring-4 focus:ring-gray-300 
                     font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
        >
          {type === "signup" ? "Sign up" : "Sign in"}
        </button>
      </div>
    </div>
  );
};

interface LabelledInputProps {
  label?: string;
  placeholder: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm text-black font-semibold pt-2">
          {label}
        </label>
      )}
      <input
        onChange={onChange}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
