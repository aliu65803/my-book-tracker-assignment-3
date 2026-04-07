"use client";

export default function ReadingCat() {
  return (
    <div className="fixed bottom-4 right-4 z-20 pointer-events-none select-none" aria-hidden="true">
      <svg
        width="100"
        height="100"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-60 hover:opacity-100 transition-opacity duration-500 pointer-events-auto"
      >
        {/* Tail - animated swish */}
        <path
          d="M25 85 Q10 75, 8 60 Q6 50, 15 45"
          stroke="var(--w700)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 25 85; 8 25 85; -5 25 85; 0 25 85"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Body */}
        <ellipse cx="50" cy="88" rx="28" ry="18" fill="var(--w600)" />

        {/* Head */}
        <circle cx="55" cy="62" r="18" fill="var(--w600)" />

        {/* Left ear */}
        <polygon points="40,50 34,32 48,46" fill="var(--w600)" />
        <polygon points="42,49 37,36 47,47" fill="var(--w300)" />

        {/* Right ear */}
        <polygon points="66,48 74,30 70,46" fill="var(--w600)" />
        <polygon points="67,47 72,34 69,46" fill="var(--w300)" />

        {/* Eyes - blinking */}
        <g>
          <ellipse cx="48" cy="60" rx="3" ry="3.5" fill="var(--w900)">
            <animate
              attributeName="ry"
              values="3.5;3.5;0.5;3.5;3.5"
              dur="4s"
              repeatCount="indefinite"
              keyTimes="0;0.45;0.5;0.55;1"
            />
          </ellipse>
          <ellipse cx="62" cy="60" rx="3" ry="3.5" fill="var(--w900)">
            <animate
              attributeName="ry"
              values="3.5;3.5;0.5;3.5;3.5"
              dur="4s"
              repeatCount="indefinite"
              keyTimes="0;0.45;0.5;0.55;1"
            />
          </ellipse>
          {/* Eye shine */}
          <circle cx="49.5" cy="59" r="1" fill="var(--w50)" />
          <circle cx="63.5" cy="59" r="1" fill="var(--w50)" />
        </g>

        {/* Nose */}
        <ellipse cx="55" cy="65" rx="1.5" ry="1" fill="var(--w300)" />

        {/* Mouth */}
        <path d="M53 67 Q55 69, 57 67" stroke="var(--w800)" strokeWidth="0.8" fill="none" />

        {/* Whiskers */}
        <line x1="42" y1="63" x2="28" y2="60" stroke="var(--w400)" strokeWidth="0.7" />
        <line x1="42" y1="65" x2="27" y2="66" stroke="var(--w400)" strokeWidth="0.7" />
        <line x1="68" y1="63" x2="82" y2="60" stroke="var(--w400)" strokeWidth="0.7" />
        <line x1="68" y1="65" x2="83" y2="66" stroke="var(--w400)" strokeWidth="0.7" />

        {/* Front paws */}
        <ellipse cx="38" cy="98" rx="6" ry="4" fill="var(--w500)" />
        <ellipse cx="62" cy="98" rx="6" ry="4" fill="var(--w500)" />

        {/* Book */}
        <g>
          {/* Book base/spine */}
          <rect x="38" y="78" width="30" height="20" rx="2" fill="var(--w400)" />
          {/* Left page */}
          <rect x="39" y="79" width="14" height="18" rx="1" fill="var(--w50)" />
          {/* Right page */}
          <rect x="54" y="79" width="13" height="18" rx="1" fill="var(--w100)" />
          {/* Spine line */}
          <line x1="53" y1="79" x2="53" y2="97" stroke="var(--w500)" strokeWidth="1" />
          {/* Text lines on left page */}
          <line x1="41" y1="83" x2="51" y2="83" stroke="var(--w300)" strokeWidth="0.7" />
          <line x1="41" y1="86" x2="50" y2="86" stroke="var(--w300)" strokeWidth="0.7" />
          <line x1="41" y1="89" x2="51" y2="89" stroke="var(--w300)" strokeWidth="0.7" />
          <line x1="41" y1="92" x2="48" y2="92" stroke="var(--w300)" strokeWidth="0.7" />
          {/* Text lines on right page */}
          <line x1="56" y1="83" x2="65" y2="83" stroke="var(--w200)" strokeWidth="0.7" />
          <line x1="56" y1="86" x2="64" y2="86" stroke="var(--w200)" strokeWidth="0.7" />
          <line x1="56" y1="89" x2="65" y2="89" stroke="var(--w200)" strokeWidth="0.7" />
          <line x1="56" y1="92" x2="62" y2="92" stroke="var(--w200)" strokeWidth="0.7" />

          {/* Page turning animation */}
          <path d="M53 79 Q60 79, 65 79 L65 97 Q60 97, 53 97 Z" fill="var(--w50)" opacity="0">
            <animate
              attributeName="d"
              values="M53 79 Q53 79, 53 79 L53 97 Q53 97, 53 97 Z;
                      M53 79 Q58 76, 65 79 L65 97 Q58 100, 53 97 Z;
                      M53 79 Q48 76, 41 79 L41 97 Q48 100, 53 97 Z;
                      M53 79 Q53 79, 53 79 L53 97 Q53 97, 53 97 Z"
              dur="6s"
              repeatCount="indefinite"
              keyTimes="0;0.15;0.3;0.4"
            />
            <animate
              attributeName="opacity"
              values="0;0.7;0.7;0"
              dur="6s"
              repeatCount="indefinite"
              keyTimes="0;0.05;0.35;0.4"
            />
          </path>
        </g>

        {/* Gentle body breathing */}
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-0.5; 0,0"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </svg>
    </div>
  );
}
