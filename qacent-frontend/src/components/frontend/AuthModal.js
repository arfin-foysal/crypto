"use client";
import React, { useState } from "react";
import { Button, Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import Signup from "@/app/(auth)/signup/page";
import Login from "../../app/(auth)/login/page";
const AuthModal = ({ isOpen = false, onClose }) => {
  const [isOpenSignUp, setIsOpenSignUp] = useState(false);
  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
    setIsOpenSignUp(false);
  };
  const handleOpenSignUp = () => {
    setIsOpenSignUp(true);
  };
  const handleOpenSignIn = () => {
    setIsOpenSignUp(false);
  };
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-50 focus:outline-none"
        onClose={handleClose}
      >
        <div className="fixed inset-0 z-10 w-screen h-screen">
          <div className="flex h-full items-center justify-center">
            <DialogPanel
              transition
              className="w-full overflow-y-auto h-full rounded-xl bg-white/5 backdrop-blur-md transition duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <div className="px-6 py-12 lg:px-8 flex flex-col items-center justify-center">
                {/* Sign up form */}
                {isOpenSignUp ? (
                  <Signup
                    handleOpenSignIn={handleOpenSignIn}
                    onClose={handleClose}
                  />
                ) : (
                  <Login
                    handleOpenSignUp={handleOpenSignUp}
                    onClose={handleClose}
                  />
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AuthModal;
