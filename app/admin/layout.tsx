import { SessionProviderWrapper } from "@/components/admin/SessionProviderWrapper";

export const metadata = {
  title: {
    default: "Admin",
    template: "%s | Bharat Trails Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>;
}
