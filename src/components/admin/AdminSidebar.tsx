"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, Tag, ShoppingBag, Users, Bell, Settings,
  Calculator, LogOut, MessageSquare, DollarSign, UserCheck, CalendarDays,
  CheckSquare, BookOpen, Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSupportStore } from "@/store/supportStore";
import { useT } from "@/hooks/useT";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const newRequestsCount = useSupportStore((s) => s.getUnreadCount());
  const t = useT();

  useEffect(() => { setMounted(true); }, []);

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: t.admin.dashboard },
    { href: "/admin/products", icon: Package, label: t.admin.products },
    { href: "/admin/categories", icon: Tag, label: t.admin.categories },
    { href: "/admin/orders", icon: ShoppingBag, label: t.admin.orders },
    { href: "/admin/debts", icon: BookOpen, label: t.admin.debts },
    { href: "/admin/partners", icon: Handshake, label: t.admin.partners },
    { href: "/admin/requests", icon: MessageSquare, label: t.admin.requests, badge: true },
    { href: "/admin/users", icon: Users, label: t.admin.users },
    { divider: true, label: t.admin.hr },
    { href: "/admin/hr/employees", icon: UserCheck, label: t.admin.employees },
    { href: "/admin/hr/attendance", icon: CalendarDays, label: t.admin.attendance },
    { href: "/admin/hr/salary", icon: DollarSign, label: t.admin.salary },
    { href: "/admin/hr/tasks", icon: CheckSquare, label: t.admin.tasks },
    { divider: true, label: t.admin.settings },
    { href: "/admin/calculator", icon: Calculator, label: t.admin.calculator },
    { href: "/admin/notifications", icon: Bell, label: t.admin.notifications },
    { href: "/admin/settings", icon: Settings, label: t.admin.settings },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-bg-secondary border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-gold rounded-xl flex items-center justify-center">
              <span className="text-bg-primary font-black text-sm">FM</span>
            </div>
            <div>
              <p className="font-bold text-text-primary text-sm">F.M.I Metall</p>
              <p className="text-accent-gold text-xs">{t.admin.panel}</p>
            </div>
          </div>
          {mounted && <LanguageSwitcher compact />}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item, idx) => {
          if ("divider" in item) {
            return (
              <div key={idx} className="pt-4 pb-1 px-4">
                <p className="text-xs font-semibold text-text-muted tracking-widest uppercase">{item.label}</p>
                <div className="h-px bg-border mt-2" />
              </div>
            );
          }
          const Icon = item.icon!;
          const isActive = pathname === item.href || pathname.startsWith(item.href! + "/");
          const badgeCount = item.badge ? newRequestsCount : 0;
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent-gold text-bg-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card"
              )}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
              {mounted && badgeCount > 0 && !isActive && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          {t.admin.logout}
        </Link>
      </div>
    </aside>
  );
}
