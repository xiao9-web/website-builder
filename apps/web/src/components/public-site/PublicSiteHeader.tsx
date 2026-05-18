import Link from "next/link";
import type { PublicMenu, PublicSiteConfig } from "@/lib/public-site/types";

interface PublicSiteHeaderProps {
  config: PublicSiteConfig;
  menus: PublicMenu[];
}

const sectionSlugs = new Set(["products", "about", "cooperation", "contact"]);

function menuHref(siteSlug: string, menu: PublicMenu) {
  if (menu.menuType === "HOME" || menu.slug === "home") {
    return `/sites/${siteSlug}`;
  }
  if (sectionSlugs.has(menu.slug)) {
    return `/sites/${siteSlug}#${menu.slug}`;
  }
  return `/sites/${siteSlug}/${menu.slug}`;
}

export function PublicSiteHeader({ config, menus }: PublicSiteHeaderProps) {
  const brand = config.brandConfig;
  const companyName = brand.companyName || config.name;
  const shortName = brand.shortName || companyName;
  const topMenus = menus.filter((menu) => !menu.parentId);
  const childMenus = new Map<number, PublicMenu[]>();
  menus
    .filter((menu) => menu.parentId)
    .forEach((menu) => {
      const parentId = Number(menu.parentId);
      childMenus.set(parentId, [...(childMenus.get(parentId) ?? []), menu]);
    });

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-[#f7f5ee]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/sites/${config.slug}`} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-800 text-sm font-bold text-white">
            春昌
          </span>
          <span className="text-base font-semibold text-stone-950">
            {shortName}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex">
          {topMenus.map((menu) => {
            const children = childMenus.get(menu.id) ?? [];
            return (
              <div key={menu.id} className="group relative">
                <Link
                  href={menuHref(config.slug, menu)}
                  className="transition hover:text-emerald-800"
                >
                  {menu.label}
                </Link>
                {children.length ? (
                  <div className="invisible absolute left-0 top-full z-50 min-w-44 rounded-md border border-emerald-900/10 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                    {children.map((child) => (
                      <div key={child.id}>
                        <Link
                          href={menuHref(config.slug, child)}
                          className="block rounded px-3 py-2 text-sm text-stone-700 transition hover:bg-emerald-50 hover:text-emerald-900"
                        >
                          {child.label}
                        </Link>
                        {(childMenus.get(child.id) ?? []).map((grandchild) => (
                          <Link
                            key={grandchild.id}
                            href={menuHref(config.slug, grandchild)}
                            className="block rounded px-6 py-2 text-xs text-stone-500 transition hover:bg-emerald-50 hover:text-emerald-900"
                          >
                            {grandchild.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
        <Link
          href={`/sites/${config.slug}#contact`}
          className="rounded-md bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900"
        >
          联系咨询
        </Link>
      </div>
    </header>
  );
}
