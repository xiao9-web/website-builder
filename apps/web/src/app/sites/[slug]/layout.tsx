import { PublicSiteTransition } from "@/components/public-site/PublicSiteTransition";

export default function PublicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicSiteTransition>{children}</PublicSiteTransition>;
}
