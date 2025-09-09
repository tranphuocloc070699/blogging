import {useEffect, useState} from "react";

export function useWindowScroll(): { x: number; y: number } {
  const [scroll, setScroll] = useState({x: 0, y: 0});

  useEffect(() => {
    const handleScroll = () =>
        setScroll({x: window.scrollX, y: window.scrollY});

    window.addEventListener("scroll", handleScroll, {passive: true});
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scroll;
}