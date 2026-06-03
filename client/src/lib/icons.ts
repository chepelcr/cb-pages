import {
  Flag,
  Users,
  Award,
  Calendar,
  Shield,
  Star,
  Target,
  Heart,
  Crown,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Clock,
  Camera,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons are content too: content JSON stores an `iconName` string and the UI
 * resolves it through this registry. Never hardcode an icon-per-id switch in a
 * component. To offer a new icon in the admin, add it here.
 */
export const ICONS: Record<string, LucideIcon> = {
  Flag,
  Users,
  Award,
  Calendar,
  ShieldIcon: Shield,
  Shield,
  Star,
  Target,
  Heart,
  Crown,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Clock,
  Camera,
};

/** Icon names offered for milestones (history timeline). */
export const MILESTONE_ICONS = ["Flag", "Users", "Award", "Calendar"] as const;

/** Icon names offered for shield values. */
export const SHIELD_VALUE_ICONS = [
  "Award",
  "ShieldIcon",
  "Star",
  "Flag",
  "Target",
  "Heart",
] as const;

/** Icon names offered for social links. */
export const SOCIAL_ICONS = ["Facebook", "Instagram", "Youtube"] as const;

export function resolveIcon(name: string | undefined, fallback: LucideIcon = Flag): LucideIcon {
  if (name && ICONS[name]) return ICONS[name];
  return fallback;
}
