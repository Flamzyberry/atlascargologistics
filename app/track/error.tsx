"use client";

import { useEffect } from "react";
import Image from "next/image";

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "Atlas Cargo Logistics";

export default function TrackingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Tracking page error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <Image
              src="/logo.PNG"
              alt={COMPANY_NAME}
              fill
              className="object-contain"
            />
          </div>

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            We encountered an error loading the tracking page. This may be due to
            your browser or device settings. Please try again.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/track"
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors inline-block"
            >
              Go to Tracking Page
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            If the problem persists, try using a different browser or device.
          </p>
        </div>
      </div>
    </main>
  );
}
