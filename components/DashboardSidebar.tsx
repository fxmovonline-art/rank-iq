"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, CheckSquare, Lightbulb, X } from "lucide-react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/dashboard/projects", icon: CheckSquare },
  { name: "Analysis", href: "/dashboard/analysis", icon: BarChart2 },
  { name: "Strategies", href: "/dashboard/strategies", icon: Lightbulb },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  const isProjectsPath = (path: string) => path.startsWith("/dashboard/project/");

  const isLinkActive = (href: string) => {
    if (href === "/dashboard/projects") {
      return pathname === href || isProjectsPath(pathname);
    }
    return pathname === href;
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">RankIQ</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Desktop logo */}
        <Link
          href="/dashboard"
          className="hidden lg:flex h-16 items-center shrink-0 px-6 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">RankIQ</span>
        </Link>

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-4 lg:px-6 py-6">
            {navigation.map((item) => {
              const isActive = isLinkActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-4 py-3 text-sm rounded-lg transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon
                    className={`shrink-0 mr-3 h-5 w-5 transition-colors ${
                      isActive ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-600"
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
    </>
  );
}
