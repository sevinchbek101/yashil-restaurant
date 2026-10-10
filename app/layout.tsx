import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={title:"YASHIL — Sog‘lom taomlar",description:"Yangi va foydali bowl hamda salatlar."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="uz"><body>{children}</body></html>}
