"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import TextType from "@/components/TextType";
import { Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const imageRef = useRef(null);
  const contactRef = useRef(null);
  const contactItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const titleRef = useRef(null);
  const signatureRef = useRef(null);

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
          ease: "power2.out",
        },
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
          ease: "power2.out",
          delay: 0.3,
        },
      );
    }

    // Signature fade in
    if (signatureRef.current) {
      gsap.fromTo(
        signatureRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          delay: 0.6,
        },
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
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }

    // Stagger animation for contact items
    if (contactItemsRef.current.length > 0) {
      gsap.fromTo(
        contactItemsRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }
  }, []);

  const contacts = [
    {
      label: "Email",
      value: "tranphuocloc070699@gmail.com",
      href: "mailto:tranphuocloc070699@gmail.com",
      icon: <Mail className="w-4 h-4" />,
    },
    {
      label: "GitHub",
      value: "tranphuocloc070699",
      href: "https://github.com/tranphuocloc070699",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.37-12-12-12" />
        </svg>
      ),
    },
    {
      label: "Medium",
      value: "@tranphuocloc070699",
      href: "https://medium.com/@tranphuocloc070699",
      icon: <span className="font-bold text-sm leading-none">M</span>,
    },
    {
      label: "Substack",
      value: "@felix070699",
      href: "https://substack.com/@felix070699",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      value: "Trần Phước Lộc",
      href: "https://www.linkedin.com/in/trần-phước-lộc-06b43325a",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      value: "Trần Phước Lộc",
      href: "https://www.facebook.com/tran.phuoc.loc.243614/",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
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
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72">
              <Image
                src="/avatar.JPG"
                alt="Profile Avatar"
                fill
                className="rounded-3xl object-cover shadow-lg"
                priority
                sizes="(max-width: 768px) 192px, (max-width: 1024px) 256px, 288px"
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8VAAAIBAgQE"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-6">
            {/* Typing Animation */}
            <div className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              <TextType
                text={["Start small.", "Stay consistent.", "Grow every day."]}
                className="text-2xl"
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
              <p>
                I’m a developer who enjoys building simple and useful software.
                This blog is where I share small lessons, experiments, and ideas
                from my daily work and learning journey.
                <br />I believe good technology should feel clear, steady, and
                quietly reliable over time.
              </p>
            </div>

            {/* Calligraphy Signature */}
            <div
              ref={signatureRef}
              className="pt-2 flex justify-center flex-col items-end gap-4"
            >
              <span style={{ fontFamily: "cursive" }} className="text-2xl">
                Best Regard
              </span>

              <Image
                src={"/signature.svg"}
                width={80}
                height={80}
                alt="Signature"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        ref={contactRef}
        className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16 border-t border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-widest mb-8">
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {contacts.map((contact, i) => (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                contact.href.startsWith("mailto:")
                  ? undefined
                  : "noopener noreferrer"
              }
              ref={(el) => {
                if (el) contactItemsRef.current[i] = el;
              }}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors flex-shrink-0">
                {contact.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  {contact.label}
                </div>
                <div className="text-sm text-gray-800 font-medium truncate">
                  {contact.value}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
