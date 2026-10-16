import type { Metadata, Viewport } from "next";
import { Inter, Nunito, Roboto } from "next/font/google";
import "./globals.css";

// Inter stands in for SF Pro on devices that don't have it; Nunito for SF Pro Rounded.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
});

// Only for the official Google sign-in button, which specifies Roboto Medium.
const roboto = Roboto({
  variable: "--font-roboto",
  weight: "500",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Roastube: your YouTube taste, roasted",
    template: "%s · Roastube",
  },
  description:
    "Sign in with Google and Crispy, a TV that's seen too much, roasts your personality based on your YouTube likes, subscriptions and playlists. Read-only. Nothing is saved.",
  applicationName: "Roastube",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable} ${roboto.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
