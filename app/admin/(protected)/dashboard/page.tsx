import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboardPage() {
  // Defense in depth: middleware already protects this route, but a server
  // component should never assume that and trust an unauthenticated render.
  const session = await getServerSession(authOptions);

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest2 text-terracotta-dark">Admin</p>
      <h1 className="mt-3 font-display text-3xl text-charcoal">
        Welcome, {session?.user?.name ?? "Admin"}
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-charcoal/65">
        Signed in as {session?.user?.email}. This dashboard will grow section by section as each
        admin module (Trips, Destinations, Blog, Enquiries, Analytics) is built.
      </p>
    </div>
  );
}
