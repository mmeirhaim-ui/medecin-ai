import type { Metadata } from "next";
import { DM_Sans, Fraunces, Noto_Sans_Hebrew } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LocaleProvider } from "@/components/LocaleProvider";
import {
  LOCALE_STORAGE_KEY,
  LOCALE_STORAGE_KEY_LEGACY,
} from "@/lib/i18n/locales";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const notoHebrew = Noto_Sans_Hebrew({
  variable: "--font-noto-hebrew",
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Doctor AI — Assisted medical orientation",
  description:
    "Describe your symptoms, add photos if needed, and receive careful orientation (not a diagnosis). Available in English, French, Hebrew, and Russian.",
  openGraph: {
    title: "Doctor AI",
    description:
      "Medical orientation assistant: symptoms, photos, emergency guardrails.",
    locale: "en_US",
  },
};

const localeBootScript = `
(function(){
  try {
    var key=${JSON.stringify(LOCALE_STORAGE_KEY)};
    var legacy=${JSON.stringify(LOCALE_STORAGE_KEY_LEGACY)};
    var stored=localStorage.getItem(key)||localStorage.getItem(legacy);
    var supported=['en','fr','he','ru'];
    var loc=stored;
    if(!loc||supported.indexOf(loc)<0){
      var langs=navigator.languages||[navigator.language||'en'];
      for(var i=0;i<langs.length;i++){
        var b=String(langs[i]||'').toLowerCase().split('-')[0];
        if(supported.indexOf(b)>=0){loc=b;break;}
      }
    }
    if(!loc||supported.indexOf(loc)<0) loc='en';
    document.documentElement.lang=loc;
    document.documentElement.dir=loc==='he'?'rtl':'ltr';
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} ${notoHebrew.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeBootScript }} />
      </head>
      <body className="relative z-0 flex min-h-full flex-col text-[var(--ink)]">
        <LocaleProvider>
          <Header />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
