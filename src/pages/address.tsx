import React, { useContext, useEffect, useState } from "react";
import AddressPopup from "../components/addressPopup";
import { AddressType } from "../util/types";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../util/user";
import { AuthContext } from "../util/context/authContext";
import { useLocation } from "react-router-dom";
import Back from "../assets/back.png";

const Address = () => {
  const { state } = useLocation();
  const [show, setShow] = useState(false);
  const [type, setType] = useState("Add");
  const [editAddress, setEditAddress] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<AddressType[] | undefined>(
    undefined
  );
  const { user } = useContext(AuthContext) ?? {
    user: null,
    loading: false,
  };

  const fetchAddresses = async () => {
    if (user) {
      const addresses = await getAddresses(user.uid);
      if (addresses) {
        setAddresses(addresses);
      }
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handlePopup = () => {
    setType("Add");
    setShow((prev) => !prev);
  };

  const handleCreateAddress = async (address: AddressType) => {
    if (type === "Edit" && editAddress) {
      await updateAddress({ ...address, id: editAddress }, editAddress);
      handlePopup();

      return fetchAddresses();
    }
    const res = await createAddress({ ...address, userId: user?.uid });
    if (res === "Success") {
      handlePopup();
      fetchAddresses();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAddress(id);
    fetchAddresses();
  };

  useEffect(() => {
    if (state?.from === "checkout" && state.id) {
      setType("Edit");
      setEditAddress(state?.id);
      setShow(true);
    }
  }, [state]);

  useEffect(() => {
    if (state?.from === "checkout" && state.id === undefined) {
      setType("Add");
      setShow(true);
    }
  }, [state]);

  return (
    <div className="mt-10">
      {state?.from === "checkout" ? (
        <a href={`/checkout/${user?.uid}`} className=" ml-4 font-semibold ">
          <img src={Back} alt="back" width={"20px"} className="inline mr-2 " />
          Go back to checkout
        </a>
      ) : null}
      <h3 className=" text-xl text-center font-bold leading-tight tracking-tight text-gray-900  ">
        Address
      </h3>
      <div className="text-right mr-5 my-5">
        <button
          className="bg-gray-900 rounded py-2 px-2 text-white text-sm font-bold"
          onClick={handlePopup}
        >
          Add Address
        </button>
      </div>
      <div className="flex items-center justify-center rounded ">
        {addresses?.length === 0 ? null : (
          <div className="w-full mx-3 rounded sm:mx-0 sm:w-1/2 border-2 border-gray-100 py-5">
            {addresses?.map((address) => (
              <div className="flex w-full bg-white rounded items-center ">
                <div className=" mb-3 flex-auto ml-3">
                  <h5 className="text-xl font-bold  text-gray-900 truncate">
                    {address.fullName}
                  </h5>
                  <p className="text-sm mt-[8px]  text-gray-600 truncate">
                    {address.street}
                  </p>
                  <p className="text-sm mt-[2px]  text-gray-600 truncate">
                    {address.city},{address.zipcode}
                  </p>
                  <p className="text-sm mt-[2px]  text-gray-600 truncate">
                    {address.phone}
                  </p>
                </div>
                <div className="flex justify-between mr-3">
                  <button
                    className="mr-2 text-gray-600 hover:underline font-bold cursor-pointer"
                    onClick={() => {
                      setType("Edit");
                      address.id && setEditAddress(address.id);
                      setShow(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 mr-2 font-bold cursor-pointer hover:underline"
                    onClick={() => {
                      address.id && handleDelete(address.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {show ? (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <AddressPopup
            handlePopup={handlePopup}
            handleCreateAddress={handleCreateAddress}
            type={type}
            addressId={editAddress && editAddress}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Address;
