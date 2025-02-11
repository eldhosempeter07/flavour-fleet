import React, { useContext, useEffect, useState } from "react";
import { CardType } from "../util/types";
import { createCard, deleteCard, getCards, updateCard } from "../util/user";
import { AuthContext } from "../util/context/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import { maskCardNumber } from "../util/functions";
import CardPopup from "../components/cardPopup";
import Back from "../assets/back.png";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [type, setType] = useState("Add");
  const [editCard, setEditCard] = useState<string | null>(null);
  const [cards, setCards] = useState<CardType[] | undefined>(undefined);
  const { user } = useContext(AuthContext) ?? {
    user: null,
    loading: false,
  };

  const fetchCards = async () => {
    if (user) {
      const cards = await getCards(user.uid);
      if (cards) {
        setCards(cards);
      }
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  const handlePopup = () => {
    setType("Add");
    setShow((prev) => !prev);
  };

  const handleCreateCard = async (card: CardType) => {
    if (type === "Edit" && editCard) {
      await updateCard({ ...card, id: editCard }, editCard);
      handlePopup();

      return fetchCards();
    }
    const res = await createCard({ ...card, userId: user?.uid });
    if (res === "Success") {
      handlePopup();
      fetchCards();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCard(id);
    fetchCards();
  };

  useEffect(() => {
    if (state?.from === "checkout" && state.id) {
      setType("Edit");
      setEditCard(state?.id);
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
      <h3 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900">
        Payment Details
      </h3>

      {/* Address Section */}
      <div className="flex justify-center my-5">
        <button
          className="bg-gray-900 rounded py-2 px-3 text-white text-sm font-bold"
          onClick={() => {
            setType("Add");
            setShow(true);
          }}
        >
          Add Card
        </button>
      </div>

      <div className="flex items-center justify-center rounded ">
        {cards?.length === 0 ? null : (
          <div className="w-full mx-3 rounded sm:mx-0 sm:w-1/2 border-2 border-gray-100 py-5">
            {cards?.map((card) => (
              <div className="flex w-full bg-white rounded items-center ">
                <div className=" mb-3 flex-auto ml-3">
                  <h5 className="text-xl font-bold  text-gray-900 truncate">
                    {card.cardholderName}
                  </h5>
                  <p className="text-sm mt-[8px]  text-gray-600 truncate">
                    {maskCardNumber(card.cardNumber)}
                  </p>
                  <p className="text-sm mt-[2px]  text-gray-600 truncate">
                    {card.expiryDate}
                  </p>
                  <p className="text-sm mt-[8px]  text-gray-600 truncate">
                    {card.zipcode}
                  </p>
                </div>
                <div className="flex justify-between mr-3">
                  <button
                    className="mr-2 text-gray-600 hover:underline font-bold cursor-pointer"
                    onClick={() => {
                      setType("Edit");
                      card.id && setEditCard(card.id);
                      setShow(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 mr-2 font-bold cursor-pointer hover:underline"
                    onClick={() => {
                      card.id && handleDelete(card.id);
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
      {show && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <CardPopup
            handlePopup={() => setShow(false)}
            handleCreateCard={handleCreateCard}
            type={type}
            cardId={editCard}
          />
        </div>
      )}
    </div>
  );
};

export default Payment;
