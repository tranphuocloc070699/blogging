import Link from 'next/link';
import { Button } from '../ui';
import { ChevronLeft } from 'lucide-react';
import Image from "next/image";
interface LogoProps {
        variant: 'default' | 'back'
        onBack?: () => void
}

export default function Logo({ variant = 'default', onBack }: LogoProps) {
        if (variant === 'back') {
                return (
                        <Button
                                onClick={onBack}
                                variant={"secondary"}
                                size={"icon"}
                                className="rounded-full"
                        >
                                <ChevronLeft />
                        </Button>
                );
        }

        return (
                <Link href="/" className="text-stone-600 font-bold font-mono  md:text-lg text-base hover:text-gray-900 transition-colors flex items-center">
                                <Image  src={"/logo.svg"} alt="logo" width={80} height={40} />
                </Link>
        );
}