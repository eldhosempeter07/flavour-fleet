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

  console.log(userInfo);
  console.log(loading);

  return (
    <div>
      <h3>Profile</h3>
      <form onSubmit={handleUpdateUser}>
        <input
          type="text"
          placeholder="name"
          value={userInfo?.name}
          onChange={(e) =>
            userInfo?.id && setUserInfo({ ...userInfo, name: e.target.value })
          }
        />
        <input type="text" disabled />
        <input
          type="text"
          placeholder="phone"
          value={userInfo?.phone}
          onChange={(e) =>
            userInfo?.id && setUserInfo({ ...userInfo, phone: e.target.value })
          }
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Profile;
