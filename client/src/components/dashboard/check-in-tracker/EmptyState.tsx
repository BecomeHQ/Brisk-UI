
export function EmptyState() {
  return (
    <div className="py-16 text-center border border-dashed border-neutral-200 rounded-lg mx-6 bg-neutral-50/80 backdrop-blur-sm">
      <svg
        className="mx-auto h-12 w-12 text-neutral-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p className="mt-4 text-neutral-600 font-medium">No check-in/out data available for this date</p>
      <p className="text-sm text-neutral-500 mt-1">Try selecting another date from the calendar</p>
    </div>
  );
}
