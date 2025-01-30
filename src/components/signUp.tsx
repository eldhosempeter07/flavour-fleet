// src/components/SignUp.tsx
import React, { useState } from "react";
import { signUp } from "../util/auth";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password, name);
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="/"
        className="flex items-center mb-6 text-3xl font-semibold text-orange-500 dark:text-white"
      >
        {/* <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"> */}
        Flavour Fleet
      </a>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-7 space-y-4">
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-700 md:text-2xl ">
            Register
          </h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block mb-3 font-medium text-gray-900">
                Email
              </label>
              <input
                name="name"
                value={name}
                placeholder="Name"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-3 font-medium text-gray-900">
                Email
              </label>
              <input
                name="email"
                value={email}
                placeholder="Email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-3 font-medium text-gray-900">
                Password
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                name="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 capitalize font-semibold text-lg hover:bg-blue-700 w-full py-3 rounded text-white"
              type="submit"
            >
              Submit
            </button>
            <div className="text-center">
              <a href="/login" className="hover:underline">
                Already have an account? Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
