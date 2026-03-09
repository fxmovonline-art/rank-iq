"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Search, LogOut, User, Menu, Plus } from "lucide-react";
import { signOut } from "next-auth/react";

interface DashboardTopbarProps {
  onMenuClick: () => void;
}

export default function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 bg-white border-b border-slate-200">
      <div className="flex flex-1 items-center justify-between px-4 lg:px-8">
        {/* Mobile hamburger menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        <div className="flex flex-1 lg:ml-0 ml-2">
          <div className="w-full max-w-lg lg:max-w-xs relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
              placeholder="Search projects..."
              type="search"
            />
          </div>
        </div>
        <div className="ml-4 flex items-center gap-3 lg:ml-6">
          {/* New Project Button */}
          <Link
            href="/dashboard/projects/create"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline font-medium">New Project</span>
          </Link>

          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen((prev) => !prev);
                setIsUserMenuOpen(false);
              }}
              className="p-2 bg-slate-50 text-slate-400 hover:text-slate-500 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg p-4 z-20">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <p className="mt-2 text-sm text-slate-500">No new notifications right now.</p>
              </div>
            )}
          </div>

          <div className="relative ml-3" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsUserMenuOpen((prev) => !prev);
                setIsNotificationsOpen(false);
              }}
              className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 p-1 border border-slate-200 shadow-sm gap-2 pr-3"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                HR
              </div>
              <span className="text-slate-700 font-medium tracking-tight">User</span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-20">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <div className="my-1 border-t border-slate-200" />
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
