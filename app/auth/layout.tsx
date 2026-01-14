"use client";

import Link from "next/link";
import { Image } from "antd";
import { Copyright } from "lucide-react";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen bg-gradient-to-t md:bg-gradient-to-r from-[#cbd7b7] to-white">
      <div className="w-full h-full grid place-items-center md:flex">
        <div className="md:w-2/5 lg:w-2/6 h-full px-6 py-6 hidden md:flex flex-col items-center bg-gradient-to-b from-[#19433B] via-[#3C6B5F] to-[#5EA292]">
          <div className="w-full">
            <div className="flex gap-4 items-center max-w-max">
              <Image
                src="/new_nirvala_logo.png"
                alt="nirvala-logo"
                preview={false}
                height={40}
                width={40}
                className="rounded-lg"
              />

              <p className="md:text-2xl lg:text-3xl text-transparent bg-clip-text bg-logo-gradient tracking-wide font-Parkinsans">
                nirvala
              </p>
            </div>
          </div>
          <div className="w-full flex items-center justify-center grow">
            <Image
              src="/device_mockup_2.png"
              alt="app-preview"
              preview={false}
              width="100%"
              className=""
            />
          </div>
          <div className="w-full">
            <p className="w-full justify-center flex items-center gap-x-2 font-DMSans text-sm text-[#CBD7B7]">
              <Copyright className="w-4 h-4" /> 2025 Nirvala Technologies
              Private Limited.
            </p>
          </div>
        </div>
        <div className="w-4/5 md:w-3/5 lg:w-4/6 flex flex-col items-center justify-center">
          <Image
            src="/new_nirvala_logo.png"
            alt="nirvala-logo"
            preview={false}
            height={70}
            width={70}
            className="rounded-lg"
          />
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </div>
      </div>
    </div>
  );
}
