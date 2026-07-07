import { Fraunces, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Madspild-jægeren — jagten på nedsat mad",
  description:
    "Find nedsatte udløbsvarer nær dig, live fra Salling Groups Anti Food Waste API. Se dagens bedste fund i Netto, Føtex og Bilka, saml en indkøbsliste og undgå madspild.",
  icons: { icon: [{ url: "favicon.svg", type: "image/svg+xml" }] },
};

export const viewport = {
  themeColor: "#0E0F0D",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Apply saved theme before paint to avoid a flash of the wrong body theme.
const themeScript = `try{var t=localStorage.getItem('mj_theme');if(t&&t!=='auto'){document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="da" className={`${serif.variable} ${display.variable} ${sans.variable}`}>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
