import React, { useContext, useEffect, useState } from "react";
import { getUserInfo, updatetUserInfo } from "../util/auth";
import { AuthContext } from "../util/context/authContext";
import { UserInfo } from "../util/types";
import { useFormik } from "formik";
import * as Yup from "yup";

const Profile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { user } = useContext(AuthContext) ?? { user: null, loading: false };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.email) {
        const userDetails = (await getUserInfo(user.email)) as UserInfo;
        setUserInfo(userDetails);
      }
    };
    fetchUserDetails();
  }, [user]);

  // Yup Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  // Formik Hook
  const formik = useFormik({
    initialValues: {
      name: userInfo?.name || "",
      phone: userInfo?.phone || "",
    },
    enableReinitialize: true, // Allows updates when userInfo changes
    validationSchema,
    onSubmit: async (values) => {
      if (userInfo?.id) {
        const updatedUser = { ...userInfo, ...values };
        await updatetUserInfo(updatedUser);
        setUserInfo(updatedUser);
      }
    },
  });

  return (
    <div className="flex justify-center">
      <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-10 space-y-4">
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900">
            Profile
          </h1>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                name="email"
                className="bg-gray-50 border disabled:text-gray-500 border-gray-300 text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                value={userInfo?.email || ""}
                disabled
              />
            </div>

            {/* Name Field */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                name="name"
                placeholder="Name"
                className={`bg-gray-50 border ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : "border-gray-300"
                } text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-900">
                Phone
              </label>
              <input
                name="phone"
                placeholder="Phone"
                type="text"
                className={`bg-gray-50 border ${
                  formik.touched.phone && formik.errors.phone
                    ? "border-red-500"
                    : "border-gray-300"
                } text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              className="bg-gray-700 text-[1rem] hover:bg-gray-950 capitalize font-semibold w-full py-2 rounded text-white"
              type="submit"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
