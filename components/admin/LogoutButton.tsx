"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="inline-flex items-center gap-2 rounded-full border-2 border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:border-forest/40 hover:bg-forest/[0.04]"
    >
      <LogOut size={15} aria-hidden />
      Logout
    </button>
  );
}
