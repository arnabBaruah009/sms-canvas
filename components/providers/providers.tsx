"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ReduxProvider } from "@/lib/redux/redux-provider";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <NextUIProvider>{children}</NextUIProvider>
      <Toaster />
    </ReduxProvider>
  );
}
