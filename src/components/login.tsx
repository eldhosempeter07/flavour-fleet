import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../util/auth";

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      await login(values.email, values.password);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="/"
        className="flex items-center mb-6 text-2xl font-semibold text-orange-500 dark:text-white"
      >
        Flavour Fleet
      </a>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-7 space-y-4">
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900">
            LOGIN
          </h1>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              ) : null}
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              ) : null}
            </div>
            <button
              className="bg-gray-700 text-[1rem] hover:bg-gray-950 capitalize font-semibold w-full py-2 rounded text-white"
              type="submit"
            >
              Submit
            </button>
            <div className="text-center">
              <a href="/register" className="hover:underline">
                Create an account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
