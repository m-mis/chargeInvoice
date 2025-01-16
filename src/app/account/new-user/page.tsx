import PATHS from "@/app/path-config";
import { redirect } from "next/navigation";
import { getCookieSession } from "@/utils/cookies-manager";
import { getUserById } from "@/models/user";
import { NewUser } from "./container";

export default async function NewUserPage() {
  const cookiesSession = await getCookieSession();
  if (!cookiesSession) return redirect(PATHS.login);
  const user = await getUserById(cookiesSession.userId);
  if (!user) return redirect(PATHS.login);

  if (user.termsAndConditionsAcceptedAt && user.firstDownloadCompletedAt) return redirect(PATHS.dashboard);

  // const handleLoadMore = async () => {
  //   const data = await fetchChargingHistory(lastPageLoaded + 1);
  //   console.log(data);
  //   setLastPageLoaded((old) => old + 1);
  //   setChargingSessionNumber(data.totalResults);
  //   setChargingSessionImported((old) => old + data.chargingSessions);
  // };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="overflow-hidden bg-white shadow sm:rounded-md border border-lightGray">
        <div className="px-4 py-5 sm:p-6">
          <NewUser user={user} />
        </div>
      </div>
      {/* <button onClick={() => redirect(PATHS.home)}>Go to home</button>
      <button
        onClick={handleLoadMore}
        disabled={chargingSessionImported === chargingSessionNumber && chargingSessionNumber !== 0}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Load more
      </button>
      <h1>
        Charging session number: {chargingSessionImported}/{chargingSessionNumber}
      </h1> */}
    </div>
  );
}
