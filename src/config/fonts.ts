import { Noto_Sans, Inter, IBM_Plex_Mono } from "next/font/google"

export const noto = Noto_Sans({ subsets: ['latin'], variable: '--font-notosans',display:"swap" });
export const inter = Inter({ subsets: ["latin"], variable: '--font-inter',display:"swap" });
export const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ['400', '500', '600'], variable: '--font-mono',display:"optional" });