import { Suspense } from "react";
import UserProfile from "./user-profile";
import { Skeleton } from "../ui/skeleton";

export default function UserProfileWrapper() {
    return (
        <Suspense
            fallback={
                <Skeleton className="rounded-full h-[38px] w-[38px]" />
            }
        >
            <UserProfile />
        </Suspense>
    );
}