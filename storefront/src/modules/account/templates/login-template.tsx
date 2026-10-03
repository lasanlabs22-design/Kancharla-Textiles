import PhoneLogin from "@modules/account/components/phone-login"

// Kept for the old email login/register components, which are no longer shown (shoppers use phone OTP).
export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  return (
    <div className="w-full flex justify-center px-0 xsmall:px-4 py-2 xsmall:py-12">
      <div className="w-full max-w-md bg-white border border-teak-line">
        <div className="zari-band" />
        <div className="flex flex-col items-center px-5 py-8 xsmall:px-8 xsmall:py-10 small:px-10">
          <span className="font-display text-center text-[clamp(22px,7vw,28px)] leading-[1.05] tracking-[0.16em] pl-[0.16em] text-kumkum whitespace-nowrap">
            KANCHARLA
            <br />
            TEXTILES
          </span>
          <span className="mt-2 mb-6 text-[9px] tracking-[0.45em] pl-[0.45em] font-medium text-zari-ink">MANGALAGIRI</span>
          <PhoneLogin subtitle="Track your orders, manage addresses and see your wishlist. We'll send a one-time password (OTP) by SMS." />
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
