"use client";

import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="inline-flex w-full justify-center rounded-full bg-[#333333] px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 cursor-pointer archivo">
            {user?.full_name || "User"}
            <svg
              className="-mr-1 ml-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </MenuButton>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-[#333333] shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1">
              <MenuItem>
                <Link
                  href="/profile"
                  className={`text-white
                     group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Profile
                </Link>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={logout}
                  className={`text-white cursor-pointer
                     group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Logout
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
