import { ArchipelagoHome } from "@/components/archipelago-home";
import { buildPageMetadata } from "@/lib/site-config";
export const metadata = buildPageMetadata({ title: "杨逸凡的世界", description: "我做过的，写过的，想过的，以及还没做完的，都在这里。", pathname: "/" });
export default function HomePage() { return <ArchipelagoHome />; }
