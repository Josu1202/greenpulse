interface AdminTabsProps {
  active: "dashboard" | "reports" | "lessons" | "users";
}

/**
 * Las pestañas administrativas ahora viven en AdminSidebar.
 * Se conserva este componente para no romper las páginas que aún lo importan.
 */
export function AdminTabs({ active: _active }: AdminTabsProps) {
  return null;
}
