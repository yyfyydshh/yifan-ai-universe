import {
  BookOpenText,
  Globe2,
  PenLine,
  Radio,
  ShieldCheck,
  TableProperties,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { ProjectIconName } from "@/lib/site-data";

const iconMap: Record<ProjectIconName, LucideIcon> = {
  globe: Globe2,
  target: Target,
  book: BookOpenText,
  shield: ShieldCheck,
  table: TableProperties,
  radio: Radio,
  pen: PenLine,
};

export function ProjectIcon({
  name,
  size = 28,
  strokeWidth = 1.5,
}: {
  name: ProjectIconName;
  size?: number;
  strokeWidth?: number;
}) {
  const Icon = iconMap[name];
  return <Icon aria-hidden="true" size={size} strokeWidth={strokeWidth} />;
}
