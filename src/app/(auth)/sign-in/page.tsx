"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      setIsLoading(provider);

      await signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setIsLoading(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />

        {/* Grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.08]
            [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]
            [background-size:50px_50px]
            [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]
          "
        />
      </div>

      {/* Navbar */}
      <header className="relative z-20 flex h-20 items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="/ApiPilot.gif"
            alt="API Pilot"
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain"
          />
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          All systems operational
        </div>
      </header>

      {/* Main */}
      <section className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center px-5 pb-12">
        <div className="grid w-full max-w-6xl items-center gap-20 lg:grid-cols-[1fr_440px]">
          {/* Left content */}
          <div className="hidden lg:block">
            <div className="max-w-xl">
              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-3 py-1.5 text-xs font-medium text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />
                The API workspace for developers
              </div>

              {/* Heading */}
              <h1 className="text-6xl font-bold leading-[1.05] tracking-[-0.04em] text-white">
                Your APIs.
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Your workflow.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-slate-400">
                Design, test and manage your APIs from one powerful workspace
                built to keep your development workflow fast and organized.
              </p>

              {/* Features */}
              <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  "Powerful API testing",
                  "Organized collections",
                  "Fast developer workflow",
                  "Secure authentication",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2.5 text-sm text-slate-300"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/10">
                      <Check className="h-3 w-3 text-blue-400" />
                    </div>

                    {feature}
                  </div>
                ))}
              </div>

              {/* Small terminal decoration */}
              <div className="mt-12 w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0d13]/80 shadow-2xl">
                <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-[10px] text-slate-600">
                    api-pilot
                  </span>
                </div>

                <div className="px-5 py-4 font-mono text-xs leading-6">
                  <p className="text-slate-500">
                    <span className="text-blue-400">$</span> api-pilot
                    <span className="text-slate-600"> --start</span>
                  </p>

                  <p className="text-emerald-400">✓ Workspace ready</p>

                  <p className="text-slate-500">
                    <span className="text-blue-400">→</span> Ready to build
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login card */}
          <div className="w-full max-w-[440px]">
            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/[0.10]
                bg-[#0b0f17]/90
                p-7
                shadow-[0_30px_100px_-30px_rgba(0,0,0,0.9)]
                backdrop-blur-2xl
                sm:p-9
              "
            >
              {/* Card top glow */}
              <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[80px]" />

              {/* Logo */}
              <div className="relative flex justify-center">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-xl">
                  <Image
                    src="/ApiPilot.gif"
                    alt="API Pilot"
                    width={58}
                    height={58}
                    priority
                    className="h-12 w-12 object-contain"
                  />
                </div>
              </div>

              {/* Heading */}
              <div className="relative mt-6 text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Sign in to continue to API Pilot
                </p>
              </div>

              {/* Social buttons */}
              <div className="relative mt-8 space-y-3">
                {/* Google */}
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading !== null}
                  onClick={() => handleSocialLogin("google")}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border-white/[0.10]
                    bg-white/[0.04]
                    text-sm
                    font-medium
                    text-slate-200
                    shadow-none
                    transition-all
                    hover:border-white/[0.18]
                    hover:bg-white/[0.08]
                    hover:text-white
                  "
                >
                  {isLoading === "google" ? <LoadingSpinner /> : <GoogleIcon />}

                  {isLoading === "google"
                    ? "Connecting..."
                    : "Continue with Google"}
                </Button>

                {/* GitHub */}
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading !== null}
                  onClick={() => handleSocialLogin("github")}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border-white/[0.10]
                    bg-white/[0.04]
                    text-sm
                    font-medium
                    text-slate-200
                    shadow-none
                    transition-all
                    hover:border-white/[0.18]
                    hover:bg-white/[0.08]
                    hover:text-white
                  "
                >
                  {isLoading === "github" ? <LoadingSpinner /> : <GithubIcon />}

                  {isLoading === "github"
                    ? "Connecting..."
                    : "Continue with GitHub"}
                </Button>
              </div>

              {/* Divider */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/[0.07]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-600">
                  Secure access
                </span>

                <div className="h-px flex-1 bg-white/[0.07]" />
              </div>

              {/* Security box */}
              <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/10 bg-blue-500/10">
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-200">
                      Secure authentication
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Your account is securely authenticated through Google or
                      GitHub.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p className="mt-6 text-center text-[11px] leading-5 text-slate-600">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            {/* Bottom */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Protected by secure authentication
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------------- Icons ---------------- */

function LoadingSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21.805 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.5a4.7 4.7 0 01-2.04 3.08v2.56h3.3c1.93-1.78 3.045-4.4 3.045-7.67z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.07-.91 6.76-2.46l-3.3-2.56c-.91.61-2.07.97-3.46.97-2.66 0-4.91-1.8-5.72-4.22H2.87v2.64A10.2 10.2 0 0012 22z"
        fill="#34A853"
      />
      <path
        d="M6.28 13.73A6.1 6.1 0 016 12c0-.6.1-1.19.28-1.73V7.63H2.87A10 10 0 002 12c0 1.61.39 3.13 1.08 4.37l3.2-2.64z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.05c1.5 0 2.84.52 3.9 1.54l2.92-2.92C17.06 3.04 14.76 2 12 2a10.2 10.2 0 00-9.13 5.63l3.41 2.64C7.09 7.85 9.34 6.05 12 6.05z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.35-3.87-1.35-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18A11.1 11.1 0 0112 6.1c.98 0 1.96.13 2.88.38 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.08.78 2.18v3.06c0 .3.2.66.79.55A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
