import Link from 'next/link';

interface NavbarItemProps {
        href: string;
        label: string;
        isActive: boolean;
}

export default function NavbarItem({ href, label, isActive }: NavbarItemProps) {
        return (
                <Link
                        href={href}
                        className={`
        badge-spacing rounded-[20px] text-sm font-normal transition-all hover:bg-gray-100
        ${isActive
                                        ? 'text-blue-600 font-semibold'
                                        : 'text-color'
                                }
      `}
                >
                        {label}
                </Link>
        );
}