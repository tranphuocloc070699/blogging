import React from 'react';
import Link from "next/link";

type LogoProps = {
  withBrandName?: boolean;
}

const Logo = ({withBrandName}: LogoProps) => {
  return <Link href={"/"}>
    <h1 className={"flex items-center gap-4"}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path
            d="M39.9817 21.3433V38.66L31.315 30.01L39.9817 21.3433ZM11.3267 10.0167H28.6433L19.9933 18.6833L11.3267 10.0167ZM26.7833 8.15833H9.46667L1.33333 0.025H18.65L26.7833 8.15833ZM38.6383 20.0167L29.9883 28.6667L21.3217 20.0167L29.9883 11.35L38.6383 20.0167ZM39.9933 18.65L21.3433 0H39.9933V18.65ZM38.65 39.9933H1.33333L19.9833 21.3433L38.65 39.9933ZM0 38.6717V1.355L18.65 20.005L0 38.6717Z"
            fill="black"/>
      </svg>
      {
          withBrandName && <p className={"typo-head-3"}>SoftSky</p>
      }
    </h1>
  </Link>


};

export default Logo;