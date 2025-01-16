"use client";

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import PATHS from "@/app/path-config";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { changeLanguage, logout } from "./layout-actions";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "invoices", href: PATHS.invoices },
  // { name: "New-user", href: PATHS.newUser },
  { name: "emails", href: PATHS.emails },
];

const languages = [
  { name: "English", code: "en" },
  { name: "Français", code: "fr" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const DashboardLayout = ({ children, userName }: { children: React.ReactNode; userName: string }) => {
  const t = useTranslations("Layout");
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex shrink-0 items-center">
                <Link href={PATHS.dashboard} className="text-2xl font-bold">
                  Charge invoice
                </Link>
              </div>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8 sm:p-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    // aria-current={false ? "page" : undefined}
                    className={classNames("text-black text-sm font-bold", "inline-flex items-center px-1 pt-1", "hover:bg-lightGray rounded-md")}
                  >
                    {t(`Menu.${item.name}`)}
                  </Link>
                ))}
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative rounded-md p-1 text-black hover:bg-lightGray">
                    <GlobeAltIcon aria-hidden="true" className="size-6" />
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-sm bg-white py-1 shadow-lg ring-1 ring-lightGray transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.code}>
                        <button
                          className="block w-full px-4 py-2 text-sm text-gray data-[focus]:bg-gray-100 data-[focus]:outline-none hover:bg-lightGray"
                          onClick={() => changeLanguage(lang.code)}
                        >
                          {lang.name}
                        </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-md text-black hover:bg-lightGray">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <span className="text-sm text-black">{userName}</span>
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-lightGray transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <MenuItem>
                      <button
                        onClick={() => logout()}
                        className="block w-full px-4 py-2 text-sm text-gray data-[focus]:bg-gray-100 data-[focus]:outline-none hover:bg-lightGray"
                      >
                        {t("logout")}
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  aria-current={"page"}
                  className={classNames("block py-2 pl-3 pr-4 text-base font-medium")}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="shrink-0">
                  <img alt="" src={user.imageUrl} className="size-10 rounded-full" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray">{userName}</div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <GlobeAltIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <DisclosureButton
                  as="button"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  onClick={() => logout()}
                >
                  {t("logout")}
                </DisclosureButton>
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <div className="py-10">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </div>
      </div>
    </>
  );
};
