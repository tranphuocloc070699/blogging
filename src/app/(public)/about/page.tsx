'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import TextType from '@/components/TextType';
import ShinyText from '@/components/ShinyText';
import { Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const imageRef = useRef(null);
  const contactRef = useRef(null);
  const contactItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const titleRef = useRef(null);

  useEffect(() => {
    // Animate title
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        }
      );
    }

    // Subtle fade and scale animation for image
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          delay: 0.3,
        }
      );
    }

    // Scroll animation for contact section
    if (contactRef.current) {
      gsap.fromTo(
        contactRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: contactRef.current,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Stagger animation for contact items
    if (contactItemsRef.current.length > 0) {
      gsap.fromTo(
        contactItemsRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: contactRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-12 md:mb-16 text-center"
        >
          About Me
        </h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {/* Avatar Image */}
          <div ref={imageRef} className="flex-shrink-0">
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
              <Image
                src="/avatar.JPG"
                alt="Profile Avatar"
                fill
                className="rounded-3xl object-cover shadow-lg"
                priority
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-6">
            {/* Typing Animation */}
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              <TextType
                text={[
                  "Hi, I'm a frontend developer",
                  "Technology enthusiast",
                  "Philosophy lover",
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                loop={true}
                variableSpeed={undefined}
                onSentenceComplete={undefined}
              />
            </div>

            {/* About Text */}
            <div className="text-base md:text-lg text-gray-600 leading-relaxed space-y-4">
              <div>
                My name is <ShinyText text="Loc" speed={3} className="font-semibold text-xl" />, but call me <ShinyText text="Felix" speed={3} className="font-semibold text-xl" />. I&apos;m a frontend developer with a deep enthusiasm for technology,
                philosophy, and the curiosities of the world.
              </div>
              <p>
                I enjoy exploring new ideas and sharing what I learn, hoping it can
                make your journey a little easier than mine.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        ref={contactRef}
        className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 border-t border-gray-200"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Get in Touch
        </h2>

        <div className="space-y-4">
          {/* Email */}
          <a
            href="mailto:tranphuocloc070699@gmail.com"
            ref={(el) => {
              if (el) contactItemsRef.current[0] = el;
            }}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-base md:text-lg text-gray-800 font-medium">
                tranphuocloc070699@gmail.com
              </div>
            </div>
          </a>

          {/* Medium */}
          <a
            href="https://medium.com/@tranphuocloc070699"
            target="_blank"
            rel="noopener noreferrer"
            ref={(el) => {
              if (el) contactItemsRef.current[1] = el;
            }}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full group-hover:bg-gray-900 transition-colors">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Medium</div>
              <div className="text-base md:text-lg text-gray-800 font-medium">
                @tranphuocloc070699
              </div>
            </div>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/tranphuocloc070699"
            target="_blank"
            rel="noopener noreferrer"
            ref={(el) => {
              if (el) contactItemsRef.current[2] = el;
            }}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-900 rounded-full group-hover:bg-black transition-colors">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.37-12-12-12" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">GitHub</div>
              <div className="text-base md:text-lg text-gray-800 font-medium">
                tranphuocloc070699
              </div>
            </div>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/tran.phuoc.loc.243614/"
            target="_blank"
            rel="noopener noreferrer"
            ref={(el) => {
              if (el) contactItemsRef.current[3] = el;
            }}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-brand-50 transition-colors group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-full group-hover:bg-blue-700 transition-colors">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Facebook</div>
              <div className="text-base md:text-lg text-gray-800 font-medium">
                Trần Phước Lộc
              </div>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/trần-phước-lộc-06b43325a"
            target="_blank"
            rel="noopener noreferrer"
            ref={(el) => {
              if (el) contactItemsRef.current[4] = el;
            }}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-blue-700 rounded-full group-hover:bg-blue-800 transition-colors">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">LinkedIn</div>
              <div className="text-base md:text-lg text-gray-800 font-medium">
                Trần Phước Lộc
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
