"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import http from "@/services/factory";
import { ApiRequestError } from "@/lib/app-error";

export default function PrismaHealthCheck() {
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (hasCheckedRef.current) {
      return;
    }
    hasCheckedRef.current = true;

    const check = async () => {
      try {
        await http.call<{ database: "up" }>({
          method: "GET",
          url: "/api/health/prisma",
        });
      } catch (error) {
        const message =
          error instanceof ApiRequestError
            ? error.message
            : "Database connection unavailable";
        toast.error(message);
      }
    };

    void check();
  }, []);

  return null;
}

