import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "小九建站 - 多站点建站平台",
  description:
    "面向企业官网和个人博客的多站点建站平台，支持模板配置、内容管理、公开预览和留言获客。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
