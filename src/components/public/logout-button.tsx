// components/LogoutButton.tsx
'use client';

import { signOut } from "next-auth/react";  // ← THIS ONE (client)
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    const handleLogout = async () => {
        await signOut({
            redirect: false,        // prevent instant redirect
            callbackUrl: "/"        // optional: where to go after
        });

        // Now safe to redirect manually
        window.location.href = "/";
        // or: router.push("/") if you prefer
    };

    return (
        <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2"
        >
            <LogOut className="w-4 h-4" />
            Log out
        </Button>
    );
}