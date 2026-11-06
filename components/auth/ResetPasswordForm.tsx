
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function ResetPasswordForm() {
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setNotice("");

    // Password validation
    if (password.length < 12) {
      setError("Password must be at least 12 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate OTP only when MFA is required
    if (mfaRequired && !/^\d{6,8}$/.test(otp)) {
      setError("Enter a valid authenticator code.");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(
        password,
        mfaRequired ? otp : undefined
      );

      // MFA is required before password update
      if (result.requiresMfa) {
        setMfaRequired(true);

        setNotice(
          "Your account has MFA enabled. Enter your authenticator code to continue."
        );

        return;
      }

      // Handle errors
      if (!result.success) {
        setError(
          result.error ?? "Unable to update your password."
        );

        return;
      }

      // Successful update redirects through AuthContext.
    } catch (error) {
      console.error("Password reset error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <ShieldCheck className="h-9 w-9 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            MiniVault
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Create a new secure password
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              Reset password
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Choose a strong new password for your MiniVault account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {error}
            </div>
          )}

          {/* Information */}
          {notice && (
            <div
              role="status"
              className="mb-5 flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-300"
            >
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{notice}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                New password
              </label>

              <div className="relative">
                <LockKeyhole
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter new password"
                  required
                  minLength={12}
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Minimum 12 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Confirm password
              </label>

              <div className="relative">
                <LockKeyhole
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm new password"
                  required
                  minLength={12}
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  disabled={loading}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* MFA Authenticator */}
            {mfaRequired && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

                <div className="mb-3 flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-blue-400" />

                  <label
                    htmlFor="otp"
                    className="font-medium text-white"
                  >
                    Authenticator code
                  </label>
                </div>

                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(event) =>
                    setOtp(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 8)
                    )
                  }
                  placeholder="Enter your 6-digit code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={8}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-lg tracking-[0.2em] text-white outline-none placeholder:text-sm placeholder:tracking-normal focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Open Google Authenticator or your compatible authenticator app.
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading ||
                (mfaRequired && !/^\d{6,8}$/.test(otp))
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <LockKeyhole className="h-5 w-5" />
                  {mfaRequired
                    ? "Verify and update password"
                    : "Update password"}
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm">
            <Link
              href="/login"
              className="text-blue-400 transition hover:text-blue-300"
            >
              Back to login
            </Link>
          </p>
        </div>

        {/* Security notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className="h-4 w-4" />
          Your password is securely managed by MiniVault.
        </div>

      </div>
    </main>
  );
}
