import { FileText } from "lucide-react";

export function ListEmpty() {
  return (
    <div
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      className="flex items-center gap-3 rounded-sm border border-black/10 bg-gray-100 px-5 py-4 dark:border-white/10 dark:bg-zinc-900"
    >
      <FileText
        size={16}
        className="shrink-0 text-black dark:text-white"
        strokeWidth={1.5}
      />
      <p className="text-[13px] mt-0 pt-0 font-medium text-black dark:text-white">
        Resources empty
      </p>
    </div>
  );
}
