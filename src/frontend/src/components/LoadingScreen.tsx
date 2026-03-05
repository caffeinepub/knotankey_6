export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream-100">
      <div className="flex flex-col items-center gap-6">
        {/* Yarn ball SVG animation */}
        <div className="relative w-20 h-20">
          <svg
            viewBox="0 0 80 80"
            className="w-20 h-20 animate-yarn-spin"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Loading animation"
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="oklch(0.88 0.04 68)"
              stroke="oklch(0.72 0.04 65)"
              strokeWidth="2"
            />
            <path
              d="M20 30 Q40 15 60 30 Q75 45 60 55 Q40 70 20 55 Q5 45 20 30Z"
              fill="none"
              stroke="oklch(0.55 0.05 60)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M15 42 Q30 28 50 35 Q65 42 55 58 Q45 68 28 62 Q12 55 15 42Z"
              fill="none"
              stroke="oklch(0.38 0.06 55)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M25 22 Q45 18 58 32 Q68 44 58 58"
              fill="none"
              stroke="oklch(0.72 0.04 65)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
            <circle
              cx="40"
              cy="40"
              r="5"
              fill="oklch(0.38 0.06 55)"
              opacity="0.3"
            />
          </svg>
        </div>

        <div className="text-center">
          <h1 className="font-serif text-3xl text-warm-brown tracking-widest mb-1">
            knotankey
          </h1>
          <p className="font-sans text-sm text-warm-tan tracking-[0.2em] uppercase">
            Crafting your experience…
          </p>
        </div>

        {/* Dots loader */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-warm-tan animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
