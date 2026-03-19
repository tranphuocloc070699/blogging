import { AlertCircle, X, Lock, Info } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";

const icons = {
  500: AlertCircle,
  403: X,
  401: Lock,
  404: Info,
  default: AlertCircle,
} as const;

interface ErrorMessageProps {
  error: unknown;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  const { message, hint } = getErrorMessage(error);

  return (
    <div
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      className="flex items-center gap-3 rounded-sm border border-black/10 bg-gray-100 px-5 py-4 dark:border-white/10 dark:bg-zinc-900"
    >
      <div>
        <p className="text-[13px] font-medium text-black dark:text-white">
          {message}
        </p>
        {hint && (
          <p className="mt-0 text-[12px] text-black/60 dark:text-white/60">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
