import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/");
  }

  return <div>{children}</div>;
};

export default AuthLayout;
