import PATHS from "./path-config";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h1>{t("title")}</h1>
          <p>{t("description")}</p>
          <div className="my-4">
            {t.rich("benefits", {
              ul: (chunk) => <ul>{chunk}</ul>,
              li: (chunk) => <li>{chunk}</li>,
              bold: (chunk) => <b>{chunk}</b>,
            })}
          </div>
          <p>{t("cta")}</p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-sm border border-solid border-transparent transition-colors flex items-center justify-center bg-blue text-white gap-2 hover:opacity-80 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href={PATHS.login}
            rel="noopener noreferrer"
          >
            {t("login")}
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        {/* <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a> */}
      </footer>
    </div>
  );
}
