"use client";

import Affiliate_Player_Register from "../../Ui/Forms/Affiliate_Player_Register";
import { IoIosAdd } from "react-icons/io";
import { useState } from "react";
import Image from "next/image";
import Trash_Can from "@/midias/trash.svg";

interface PlayerFormData {
  name: string;
  discord: string;
  battleTag: string;
  characterName: string;
  phoneNumber: string;
  cpf: string;
}

function Index() {
  const [playersQuantity, setPlayersQuantity] = useState<number[]>([1]);
  const [playersData, setPlayersData] = useState<Record<number, PlayerFormData>>({});

  function addNewPlayer() {
    const newId = playersQuantity.length + 1;
    setPlayersQuantity([...playersQuantity, newId]);
  }

  function removePlayer(id: number) {
    setPlayersQuantity(playersQuantity.filter((playerID) => playerID !== id));
    setPlayersData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  }

  function handlePlayerSubmit(id: number, data: PlayerFormData) {
    setPlayersData((prev) => ({
      ...prev,
      [id]: data,
    }));
  }

  function handleSubmitAll() {
    console.log("All Players Data:", playersData);
    // Processar ou enviar os dados aqui
  }

  return (
    <section className="w-full bg-white/0 rounded-2xl shadow-[0px_0px_16px_0px_rgba(0,0,0,0.05)] border-2 border-[#343a40]/30 p-10 mt-16 mb-60">
      {playersQuantity.map((id) => (
        <section key={id} className={`${id >= 2 ? "mt-14" : ""}`}>
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-whiteDef text-3xl font-bold leading-9">
              {`Player ${id}`}
            </h1>

            {id > 1 && (
              <button
                onClick={() => removePlayer(id)}
                className="w-9 h-9"
              >
                <Image src={Trash_Can} alt="Trash" />
              </button>
            )}
          </div>

          <Affiliate_Player_Register
            onSubmit={(data) => handlePlayerSubmit(id, data)} // Envia os dados para o pai
          />
        </section>
      ))}

      <article className="mt-6">
        <h1 className="text-[#f8f9fa] text-lg font-medium leading-7">Party</h1>
        <p className="text-[#adb5bd] text-sm font-normal leading-4">
          If you play in a group, register the other players
        </p>

        <button
          onClick={addNewPlayer}
          className="ctaBtn py-[6px] flex flex-row gap-[6px] px-4 mt-4"
        >
          <i className="text-whiteDef">
            <IoIosAdd />
          </i>
          Add Player
        </button>
      </article>

      <button
        className="h-11 ctaBtn w-full mt-16"
        type="button"
        onClick={handleSubmitAll}
      >
        Submit
      </button>
    </section>
  );
}

export default Index;
