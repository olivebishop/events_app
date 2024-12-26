import {LoginForm}  from "@/components/auth/login-form"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign-In | Events Palour",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}