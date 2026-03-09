"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, CheckSquare, Settings, Lightbulb } from "lucide-react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: CheckSquare },
  { name: "Analysis", href: "/dashboard/analysis", icon: BarChart2 },
  { name: "Strategies", href: "/dashboard/strategies", icon: Lightbulb },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col z-10 transition-all">
      <Link href="/dashboard" className="flex h-16 items-center shrink-0 px-6 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-lg">R</span>
        </div>
        <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">RankIQ</span>
      </Link>
      <div className="flex bg-slate-50 flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-2 px-4 py-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm hover:border hover:border-slate-200 border border-transparent"
                }`}
              >
                <item.icon
                  className={`shrink-0 mr-3 h-5 w-5 transition-colors ${
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
