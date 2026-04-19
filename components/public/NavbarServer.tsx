import { getSetting } from "@/lib/settings";
import type { NavSettings } from "@/lib/settings";
import NavbarClient from "./Navbar";

// Server component — fetches nav settings from DB, passes to client Navbar
export default async function NavbarServer() {
  const nav = await getSetting<NavSettings>("nav").catch(() => ({
    niyuktaUrl: "https://niyukta.com",
    niyuktaLabel: "Niyukta",
    showNiyuktaInNav: true,
    extraLinks: [],
  }));

  return <NavbarClient navSettings={nav} />;
}
