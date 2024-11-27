"use client";

import PATHS from "@/app/path-config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchChargingHistory } from "./action";
export default function NewUser() {
  const router = useRouter();
  const [lastPageLoaded, setLastPageLoaded] = useState(0);
  const [chargingSessionNumber, setChargingSessionNumber] = useState(0);
  const [chargingSessionImported, setChargingSessionImported] = useState(0);

  const handleLoadMore = async () => {
    const data = await fetchChargingHistory(lastPageLoaded + 1);
    console.log(data);
    setLastPageLoaded((old) => old + 1);
    setChargingSessionNumber(data.totalResults);
    setChargingSessionImported((old) => old + data.chargingSessions);
  };

  return (
    <div>
      <h1>NewUser</h1>
      <button onClick={() => router.push(PATHS.home)}>Go to home</button>
      <button
        onClick={handleLoadMore}
        disabled={chargingSessionImported === chargingSessionNumber && chargingSessionNumber !== 0}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Load more
      </button>
      <h1>
        Charging session number: {chargingSessionImported}/{chargingSessionNumber}
      </h1>
    </div>
  );
}
