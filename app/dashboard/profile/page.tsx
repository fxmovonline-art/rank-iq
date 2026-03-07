import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

function getDisplayName(email: string) {
  return email.split("@")[0];
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      email: true,
      plan: true,
      usageCount: true,
      createdAt: true,
      projects: {
        select: { id: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const displayName = getDisplayName(user.email);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-10">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">Your account details and subscription summary.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-10">
        <h2 className="text-lg font-semibold text-slate-900">Account Information</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">User Name</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{displayName}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
            <p className="mt-2 text-base font-semibold text-slate-900 break-all">{user.email}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current Plan</p>
            <p className="mt-2 text-base font-semibold text-slate-900 capitalize">{user.plan}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Projects</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{user.projects.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Usage Count</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{user.usageCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Member Since</p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
