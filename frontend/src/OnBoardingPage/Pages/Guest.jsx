import { Link } from "react-router-dom";

export default function Guest() {
  return (
    <div className="min-h-screen bg-white font-rounded flex flex-col items-center justify-center px-6 text-center">
      {/* Progress Bar placeholder */}
      <div className="w-full px-6 sm:px-10 lg:px-[9.86%] pt-6 sm:pt-8 lg:pt-[5.9%] absolute top-0 left-0">
        <div className="flex gap-2 sm:gap-3 lg:gap-[28px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 h-[6px] sm:h-[8px] lg:h-[10px] rounded-full"
              style={{ backgroundColor: "#64748B" }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-md">
        <h1
          className="text-slate-900 leading-[130%]"
          style={{
            fontFamily: "'M PLUS Rounded 1c', -apple-system, Roboto, Helvetica, sans-serif",
            fontSize: "clamp(32px, 5vw, 60px)",
            letterSpacing: "0.03em",
            fontWeight: 400,
          }}
        >
          Browse as Guest
        </h1>
        <p
          className="text-slate-900 mt-6"
          style={{
            fontFamily: "'M PLUS Rounded 1c', -apple-system, Roboto, Helvetica, sans-serif",
            fontSize: "clamp(16px, 2.2vw, 28px)",
            letterSpacing: "0.03em",
            lineHeight: "130%",
            fontWeight: 400,
          }}
        >
          Continue prompting to fill in this page with the guest experience.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center text-white rounded-[16px] sm:rounded-[20px] mt-10 transition-opacity duration-200 hover:opacity-90"
          style={{
            fontFamily: "'M PLUS Rounded 1c', -apple-system, Roboto, Helvetica, sans-serif",
            fontSize: "clamp(18px, 2.8vw, 40px)",
            letterSpacing: "0.03em",
            lineHeight: "130%",
            fontWeight: 400,
            backgroundColor: "#15803D",
            padding: "clamp(10px, 1.5vw, 20px) clamp(24px, 4vw, 60px)",
          }}
        >
          Back to Onboarding
        </Link>
      </div>
    </div>
  );
}
