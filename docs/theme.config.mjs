import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

function Logo() {
  return (
    <h1 className="flex items-center">
      <img
        src="/logo.svg"
        alt="Queuebase Documentation"
        className="h-12 w-12"
      />
      <span className="text-xl font-bold text-white">Queuebase docs</span>
    </h1>
  );
}

function Head() {
  const { asPath, defaultLocale, locale } = useRouter();
  const { frontMatter } = useConfig();
  const url =
    "https://queuebase.com" +
    (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

  return (
    <>
      <meta property="og:url" content={url} />
      <meta
        property="og:title"
        content={frontMatter.title || "Queuebase Docs"}
      />
      <meta
        property="og:description"
        content={
          frontMatter.description ||
          "Queuebase makes it easy to build and run background jobs in Next.js"
        }
      />
    </>
  );
}

export default {
  chat: {
    link: "https://discord.gg/jWD24YE9bJ",
  },
  logo: Logo,
  head: Head,
  editLink: {
    component: () => null,
  },
  feedback: {
    content: () => null,
  },
  footer: {
    component: () => null,
  },
  primaryHue: 161,
  primarySaturation: 94,
  darkMode: true,
  nextThemes: {
    defaultTheme: "light",
  },
  navigation: false,
  useNextSeoProps() {
    return {
      titleTemplate: "%s - Queuebase",
    };
  },
};
