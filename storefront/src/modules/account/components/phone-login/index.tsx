"use client"

import { completePhoneSignup, loginWithPhone } from "@lib/data/customer"
import { firebaseAuth } from "@lib/firebase"
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber, signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"

type Step = "phone" | "otp" | "profile"

const RESEND_SECONDS = 30

/** Plain-English messages for the Firebase errors a shopper can actually hit. */
function friendlyError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? ""
  switch (code) {
    case "auth/invalid-phone-number":
      return "Please enter a valid 10-digit mobile number."
    case "auth/invalid-verification-code":
      return "That OTP is incorrect. Please check the SMS and try again."
    case "auth/code-expired":
      return "This OTP has expired. Tap “Resend OTP” to get a new one."
    case "auth/too-many-requests":
    case "auth/quota-exceeded":
      return "Too many attempts. Please wait a few minutes and try again."
    case "auth/network-request-failed":
      return "No internet connection. Please check your network and try again."
    case "auth/captcha-check-failed":
    case "auth/unauthorized-domain":
      return "Verification isn't available on this web address yet. Please try again later."
    case "auth/billing-not-enabled":
    case "auth/operation-not-allowed":
      return "OTP by SMS isn't switched on yet. Please contact us to place your order."
    default:
      return (error as Error)?.message || "Something went wrong. Please try again."
  }
}

export default function PhoneLogin({
  title = "Sign in with your mobile",
  subtitle = "We'll send a one-time password (OTP) by SMS. No password needed.",
}: {
  title?: string
  subtitle?: string
}) {
  const router = useRouter()
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [profile, setProfile] = useState({ first_name: "", last_name: "", email: "" })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  const confirmation = useRef<ConfirmationResult | null>(null)
  const verifier = useRef<RecaptchaVerifier | null>(null)
  const recaptchaBox = useRef<HTMLDivElement>(null)

  // Resend countdown
  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  useEffect(() => () => verifier.current?.clear(), [])

  const getVerifier = () => {
    if (!verifier.current && recaptchaBox.current) {
      verifier.current = new RecaptchaVerifier(firebaseAuth(), recaptchaBox.current, { size: "invisible" })
    }
    return verifier.current!
  }

  const sendOtp = async (e?: FormEvent) => {
    e?.preventDefault()
    setError(null)
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.")
      return
    }
    setBusy(true)
    try {
      confirmation.current = await signInWithPhoneNumber(firebaseAuth(), `+91${phone}`, getVerifier())
      setOtp("")
      setStep("otp")
      setResendIn(RESEND_SECONDS)
    } catch (err) {
      setError(friendlyError(err))
      // A used/failed reCAPTCHA can't be reused; build a fresh one next time.
      verifier.current?.clear()
      verifier.current = null
    } finally {
      setBusy(false)
    }
  }

  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP.")
      return
    }
    setBusy(true)
    try {
      const { user } = await confirmation.current!.confirm(otp)
      const idToken = await user.getIdToken()
      await signOut(firebaseAuth()) // the store session takes over from here
      const res = await loginWithPhone(idToken)
      if (res.status === "error") setError(res.message)
      else if (res.status === "needs_profile") setStep("profile")
      else router.refresh()
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setBusy(false)
    }
  }

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!profile.first_name.trim()) {
      setError("Please enter your first name.")
      return
    }
    // Medusa needs an email to create a customer account; it's also where order emails and invoices go.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      setError("Please enter a valid email address.")
      return
    }
    setBusy(true)
    const res = await completePhoneSignup(profile)
    setBusy(false)
    if (res.status === "error") setError(res.message)
    else router.refresh()
  }

  return (
    <div className="w-full" data-testid="phone-login">
      {step !== "profile" ? (
        <div className="text-center">
          <h1 className="font-display text-[clamp(26px,7.5vw,32px)] leading-tight text-teak">{title}</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-teak-muted">
            {step === "otp" ? (
              <>
                Enter the 6-digit OTP sent to <span className="font-medium text-teak">+91 {phone}</span>
              </>
            ) : (
              subtitle
            )}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="font-display text-[clamp(26px,7.5vw,32px)] leading-tight text-teak">Welcome!</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-teak-muted">
            Your number is verified. Add your name and email to finish creating your account.
          </p>
        </div>
      )}

      {step === "phone" && (
        <form onSubmit={sendOtp} className="mt-7 grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.14em] text-teak-muted">
              Mobile number
            </span>
            <div className="flex h-12 items-stretch border border-teak-line bg-white focus-within:border-teak">
              <span className="flex items-center border-r border-teak-line px-3 text-[15px] text-teak">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98765 43210"
                className="min-w-0 flex-1 bg-transparent px-3 text-[16px] tracking-wide text-teak outline-none"
                data-testid="phone-input"
                autoFocus
              />
            </div>
          </label>
          <button type="submit" disabled={busy} className="kt-btn h-12 w-full disabled:opacity-60" data-testid="send-otp">
            {busy ? "Sending OTP…" : "Send OTP"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={verifyOtp} className="mt-7 grid gap-4">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="••••••"
            aria-label="6-digit OTP"
            className="h-14 w-full border border-teak-line bg-white text-center text-[22px] tracking-[0.6em] text-teak outline-none focus:border-teak"
            data-testid="otp-input"
            autoFocus
          />
          <button type="submit" disabled={busy} className="kt-btn h-12 w-full disabled:opacity-60" data-testid="verify-otp">
            {busy ? "Verifying…" : "Verify & continue"}
          </button>
          <div className="flex items-center justify-between text-[13px]">
            <button
              type="button"
              onClick={() => {
                setStep("phone")
                setError(null)
              }}
              className="text-teak-muted underline underline-offset-4"
            >
              Change number
            </button>
            <button
              type="button"
              onClick={() => sendOtp()}
              disabled={busy || resendIn > 0}
              className="font-medium text-kumkum disabled:text-teak-muted"
            >
              {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      {step === "profile" && (
        <form onSubmit={saveProfile} className="mt-7 grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="First name"
              required
              value={profile.first_name}
              autoComplete="given-name"
              onChange={(v) => setProfile((p) => ({ ...p, first_name: v }))}
            />
            <Field
              label="Last name"
              value={profile.last_name}
              autoComplete="family-name"
              onChange={(v) => setProfile((p) => ({ ...p, last_name: v }))}
            />
          </div>
          <Field
            label="Email"
            type="email"
            required
            hint="For order confirmations and GST invoices"
            value={profile.email}
            autoComplete="email"
            onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
          />
          <button type="submit" disabled={busy} className="kt-btn h-12 w-full disabled:opacity-60" data-testid="save-profile">
            {busy ? "Saving…" : "Continue"}
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="mt-4 border border-kumkum/30 bg-kumkum-soft px-3 py-2.5 text-[13px] text-kumkum" data-testid="login-error">
          {error}
        </p>
      )}

      <p className="mt-6 text-center text-[12px] leading-relaxed text-teak-muted">
        By continuing, you agree to Kancharla Textiles&apos; Terms of Use and Privacy Policy.
      </p>
      {/* Required by Google when the reCAPTCHA badge is hidden (globals.css) */}
      <p className="mt-2 text-center text-[11px] leading-relaxed text-teak-muted">
        Protected by reCAPTCHA. Google&apos;s{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
          Terms
        </a>{" "}
        apply.
      </p>

      {/* Invisible reCAPTCHA (Firebase's bot check before sending an SMS) */}
      <div ref={recaptchaBox} />
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  hint,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  hint?: string
  autoComplete?: string
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.14em] text-teak-muted">
        {label}
        {required && <span className="text-kumkum"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full border border-teak-line bg-white px-3 text-[16px] text-teak outline-none focus:border-teak"
      />
      {hint && <span className="mt-1 block text-[12px] text-teak-muted">{hint}</span>}
    </label>
  )
}
