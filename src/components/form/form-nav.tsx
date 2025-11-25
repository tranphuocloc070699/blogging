'use client'

import SimpleBar from "@/components/simple-bar";
import {cn} from "@/lib/utils";
import {Link} from "react-scroll"


export const formParts = {
  summary: 'summary',
  content: 'content',
  thumbnail: 'thumbnail',
  terms: 'terms',
  seo: 'seo',
};

export const menuItems = [
  {
    label: 'Summary',
    value: formParts.summary,
  },
  {
    label: 'Content',
    value: formParts.content,
  },
  {
    label: 'Thumbnail',
    value: formParts.thumbnail,
  },
  {
    label: 'Terms',
    value: formParts.terms,
  },
  {
    label: 'SEO',
    value: formParts.seo,
  },
];

interface FormNavProps {
  className?: string;
}

export default function FormNav({className}: FormNavProps) {
  return (
      <div
          className={cn(
              'sticky top-[68px] z-20 border-b border-gray-300 bg-white py-0 font-medium text-gray-500 @2xl:top-[72px] dark:bg-gray-50 2xl:top-20',
              className
          )}
      >
        <SimpleBar>
          <div className="inline-grid grid-flow-col gap-5 md:gap-7 lg:gap-10">
            {menuItems.map((tab) => (
                <Link
                    key={tab.value}
                    to={tab.value}
                    spy={true}
                    hashSpy={true}
                    smooth={true}
                    offset={-130}
                    duration={500}
                    className="relative cursor-pointer whitespace-nowrap py-4 hover:text-gray-1000 text-sm before:absolute before:bottom-0 before:left-0 before:z-[1] before:h-0 before:w-full before:bg-gray-1000 before:transition-all"
                    activeClass="!font-semibold !text-black before:!h-1"
                >
                  {tab.label}
                </Link>
            ))}
          </div>
        </SimpleBar>
      </div>
  );
}
