import React, { useContext, useEffect, useState } from "react";
import AddressPopup from "../components/addressPopup";
import { AddressType } from "../util/types";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../util/user";
import { AuthContext } from "../util/authContext";

const Address = () => {
  const [show, setShow] = useState(false);
  const [type, setType] = useState("Add");
  const [editAddress, setEditAddress] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<AddressType[] | undefined>(
    undefined
  );
  const { user, loading } = useContext(AuthContext) ?? {
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

  console.log(addresses);

  const handlePopup = () => {
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
  return (
    <div>
      <h3>Address</h3>
      <button onClick={handlePopup}>Add Address</button>
      {addresses?.map((address) => (
        <div className="flex">
          <div>
            <h2>{address.fullName}</h2>
            <p>{address.street}</p>
            <p>
              {address.city}, {address.zipcode}
            </p>
            <p>Phone: {address.phone}</p>
          </div>
          <div className="ml-[50px]">
            <button
              className="mr-3"
              onClick={() => {
                setType("Edit");
                address.id && setEditAddress(address.id);
                setShow(true);
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                address.id && handleDelete(address.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

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
