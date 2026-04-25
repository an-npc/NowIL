import { useState } from "react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    title: "Real time\nNIL values",
    description:
      "select a player's profile, see all of their stats and factors influence their NIL evaluation",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/6f1acb7306795917cb04a9b66cef4fac240d4d27?width=1284",
  },
  {
    title: "Compare\nAthletes",
    description:
      "browse thousands of college athletes side by side, filter by sport, school, position, and engagement metrics",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/6f1acb7306795917cb04a9b66cef4fac240d4d27?width=1284",
  },
  {
    title: "Close\nSmarter Deals",
    description:
      "connect with athletes directly and negotiate NIL deals backed by real data and live market insights",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/6f1acb7306795917cb04a9b66cef4fac240d4d27?width=1284",
  },
];

const FONT = "Inter, -apple-system, Roboto, Helvetica, sans-serif";

export default function Index() {
  const [step, setStep] = useState(0);

  const canGoBack = step > 0;
  const canGoNext = step < STEPS.length - 1;

  const handleBack = () => {
    if (canGoBack) setStep((s) => s - 1);
  };

  const handleNext = () => {
    if (canGoNext) setStep((s) => s + 1);
  };

  const current = STEPS[step];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="w-full px-6 sm:px-12 xl:px-[9.86%] pt-6 sm:pt-8 xl:pt-[5.9%]">
        <div className="flex gap-2 sm:gap-3 xl:gap-[2.4%]">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full transition-colors duration-300"
              style={{
                height: "clamp(6px, 0.7vw, 10px)",
                backgroundColor: i <= step ? "#1db954" : "#64748B",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col xl:flex-row px-6 sm:px-12 xl:px-[9.86%] pt-8 sm:pt-10 xl:pt-[3%] gap-6 xl:gap-0">
        {/* Left Column */}
        <div className="flex flex-col justify-center xl:w-[38.8%] xl:flex-shrink-0 xl:pr-[5%]">
          <h1
            className="text-slate-900 whitespace-pre-line"
            style={{
              fontFamily: FONT,
              fontSize: "clamp(32px, 4.9vw, 70px)",
              letterSpacing: "0.03em",
              lineHeight: "130%",
              fontWeight: 400,
            }}
          >
            {current.title}
          </h1>

          <p
            className="text-slate-900 mt-6 xl:mt-[8%]"
            style={{
              fontFamily: FONT,
              fontSize: "clamp(15px, 2.2vw, 32px)",
              letterSpacing: "0.03em",
              lineHeight: "130%",
              fontWeight: 400,
            }}
          >
            {current.description}
          </p>
        </div>

        {/* Right Column - Image */}
        <div className="flex items-center justify-center xl:flex-1">
          <img
            src={current.image}
            alt="NIL values illustration"
            className="w-full object-contain"
            style={{
              maxWidth: "clamp(260px, 45vw, 642px)",
              aspectRatio: "1 / 1",
            }}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full px-6 sm:px-12 xl:px-[9.86%] pb-8 sm:pb-10 xl:pb-[6.5%] pt-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-0 sm:justify-between">
        {/* Buttons: Back + Next */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center text-white rounded-[16px] xl:rounded-[20px] transition-opacity duration-200"
            style={{
              fontFamily: FONT,
              fontSize: "clamp(16px, 2.8vw, 40px)",
              letterSpacing: "0.03em",
              lineHeight: "130%",
              fontWeight: 400,
              backgroundColor: "#475569",
              width: "clamp(88px, 14.7vw, 212px)",
              height: "clamp(40px, 6vw, 86px)",
              opacity: canGoBack ? 1 : 0.45,
              cursor: canGoBack ? "pointer" : "not-allowed",
            }}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center justify-center text-white rounded-[16px] xl:rounded-[20px] transition-opacity duration-200"
            style={{
              fontFamily: FONT,
              fontSize: "clamp(16px, 2.8vw, 40px)",
              letterSpacing: "0.03em",
              lineHeight: "130%",
              fontWeight: 400,
              backgroundColor: "#1db954",
              width: "clamp(88px, 14.7vw, 212px)",
              height: "clamp(40px, 6vw, 86px)",
              opacity: canGoNext ? 1 : 0.45,
              cursor: canGoNext ? "pointer" : "not-allowed",
            }}
          >
            Next
          </button>
        </div>

        {/* Guest Link */}
        <div
          className="text-center sm:text-right"
          style={{
            fontFamily: FONT,
            fontSize: "clamp(13px, 2.8vw, 40px)",
            letterSpacing: "0.03em",
            lineHeight: "130%",
            fontWeight: 400,
            color: "#0F172A",
          }}
        >
          <span>Don&apos;t have account?</span>
          <br />
          <Link
            to="/guest"
            className="underline"
            style={{
              color: "#0F172A",
              textDecorationThickness: "6%",
              textUnderlineOffset: "auto",
            }}
          >
            Continue as Guest
          </Link>
          <span>!</span>
        </div>
      </div>
    </div>
  );
}
