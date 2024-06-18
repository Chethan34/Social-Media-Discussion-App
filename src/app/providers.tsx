'use client';

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

interface ProvidersProp{
    children: React.ReactNode;
}
export default function Providers({children}: ProvidersProp){
  return (
    <SessionProvider>
  <NextUIProvider>{children} </NextUIProvider>
  </SessionProvider>
  );
}