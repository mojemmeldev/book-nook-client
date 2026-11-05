import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
};

export default function MyProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
