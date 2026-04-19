// Logo.jsx - SurveySnap brand logo (SVG + text)
export default function Logo({ size = 36 }) {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* SVG Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Card/form background */}
        <rect width="40" height="40" rx="10" fill="#4F46E5" />

        {/* Clipboard lines - survey form */}
        <rect x="10" y="14" width="14" height="2.5" rx="1.25" fill="white" />
        <rect x="10" y="20" width="20" height="2.5" rx="1.25" fill="white" />
        <rect x="10" y="26" width="10" height="2.5" rx="1.25" fill="white" />

        {/* Checkmark circle - snap/done indicator */}
        <circle cx="30" cy="13" r="7" fill="#A5B4FC" />
        <path
          d="M27 13l2 2 4-4"
          stroke="#4F46E5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Brand name */}
      <span className="text-xl font-extrabold tracking-tight leading-none">
        <span className="text-indigo-600">Survey</span>
        <span className="text-gray-800">Snap</span>
      </span>
    </div>
  );
}
