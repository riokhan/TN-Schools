import { roleConfigs } from "./navConfig";

export interface PortalPageEntry {
  title: string;
  route: string;
  icon: string;
  roles: string[];
  portal: string;
  isEnabled: boolean;
}

const ROLE_TO_PORTAL: Record<string, string> = {
  STUDENT: "STUDENT",
  STUDENT_MIDDLE: "STUDENT",
  STUDENT_HIGH: "STUDENT",
  STUDENT_HIGHER: "STUDENT",
  TEACHER: "TEACHER",
  PARENT: "PARENT",
  HEADMASTER: "HEADMASTER",
  BEO: "BEO",
  DEO: "DEO",
  COMMISSIONER: "COMMISSIONER",
  MINISTER: "MINISTER",
  SUPERADMIN: "SUPERADMIN",
};

export const PORTAL_LABELS: Record<string, { label: string; icon: string }> = {
  STUDENT: { label: "Student Portal", icon: "🎓" },
  TEACHER: { label: "Teacher Portal", icon: "📚" },
  PARENT: { label: "Parent Portal", icon: "👨‍👩‍👧" },
  HEADMASTER: { label: "Headmaster Portal", icon: "🏫" },
  BEO: { label: "Block Education Officer", icon: "🏢" },
  DEO: { label: "District Education Officer", icon: "🗺️" },
  COMMISSIONER: { label: "Commissioner Portal", icon: "⚖️" },
  MINISTER: { label: "Minister Dashboard", icon: "🏛️" },
  SUPERADMIN: { label: "Super Admin Portal", icon: "🛠️" },
};

export function getPortalPagesCatalog(): PortalPageEntry[] {
  const map = new Map<string, PortalPageEntry>();

  for (const [roleKey, config] of Object.entries(roleConfigs)) {
    const portal = ROLE_TO_PORTAL[roleKey] || roleKey;

    for (const item of config.navItems) {
      if (item.href === "#" || item.label === "---" || !item.icon) continue;

      const existing = map.get(item.href);
      if (existing) {
        if (!existing.roles.includes(roleKey)) {
          existing.roles.push(roleKey);
        }
      } else {
        map.set(item.href, {
          title: item.label,
          route: item.href,
          icon: item.icon,
          roles: [roleKey],
          portal,
          isEnabled: true,
        });
      }
    }
  }

  const portalOrder = Object.keys(PORTAL_LABELS);
  return Array.from(map.values()).sort((a, b) => {
    const portalDiff = portalOrder.indexOf(a.portal) - portalOrder.indexOf(b.portal);
    if (portalDiff !== 0) return portalDiff;
    return a.title.localeCompare(b.title);
  });
}
