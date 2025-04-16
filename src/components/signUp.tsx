import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signUp } from "../util/auth";

const SignUp: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      await signUp(values.email, values.password, values.name);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="/"
        className="flex items-center mb-6 text-3xl font-semibold text-orange-500 "
      >
        Flavour Fleet
      </a>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-7 space-y-4">
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-700 md:text-2xl">
            Register
          </h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-2">
              <label className="block mb-2 font-medium text-gray-900">
                Name
              </label>
              <input
                name="name"
                value={formik.values.name}
                placeholder="Name"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            <div className="mb-2">
              <label className="block mb-3 font-medium text-gray-900">
                Email
              </label>
              <input
                name="email"
                value={formik.values.email}
                placeholder="Email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-3 font-medium text-gray-900">
                Password
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                name="password"
                placeholder="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <button
              className="mt-5 mb-3 bg-gray-700 hover:bg-gray-950 capitalize font-semibold text-lg w-full py-3 rounded text-white"
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
