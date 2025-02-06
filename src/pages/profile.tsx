import React, { useContext, useEffect, useState } from "react";
import { getUserInfo, updatetUserInfo } from "../util/auth";
import { AuthContext } from "../util/authContext";
import { UserInfo } from "../util/types";

const Profile = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { user, loading } = useContext(AuthContext) ?? {
    user: null,
    loading: false,
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.email) {
        const userDetails = (await getUserInfo(user?.email)) as UserInfo;
        setUserInfo(userDetails);
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo) {
      await updatetUserInfo(userInfo);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full  bg-white rounded-lg  md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-10 space-y-4 ">
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900  ">
            Profile
          </h1>
          <form className="space-y-6" onSubmit={handleUpdateUser}>
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                name="email"
                placeholder="Email"
                className="bg-gray-50 border disabled:text-gray-500 border-gray-300 text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                value={userInfo?.email}
                disabled
              />
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                name="name"
                placeholder="Name"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                value={userInfo?.name}
                onChange={(e) =>
                  userInfo?.id &&
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-3 text-sm font-medium text-gray-900">
                Phone
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                name="phone"
                placeholder="Phone"
                type="text"
                value={userInfo?.phone}
                onChange={(e) =>
                  userInfo?.id &&
                  setUserInfo({ ...userInfo, phone: e.target.value })
                }
              />
            </div>
            <button
              className="bg-gray-700 text-[1rem] hover:bg-gray-950 capitalize font-semibold w-full py-2 rounded text-white "
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
