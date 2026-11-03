"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Loader2 } from "lucide-react";

import { signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type UserDropdownProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  className?: string;
  size?: "default" | "sm";
  onAction?: () => void;
};

export function UserDropdown({
  user,
  className,
  size = "default",
  onAction,
}: UserDropdownProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials =
    user.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await signOut();

      if (error) {
        toast.add({
          title: "Logout failed",
          description: error.message || "Could not log out.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Logged out",
        description: "You have been logged out successfully.",
        type: "success",
      });

      onAction?.();
      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      toast.add({
        title: "Logout failed",
        description: "Something went wrong while logging out.",
        type: "error",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavigateProfile = () => {
    onAction?.();
    router.push("/my-profile");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "cursor-pointer rounded-full outline-hidden ring-offset-background transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        aria-label="User menu"
      >
        <Avatar
          className={cn(
            "border border-border",
            size === "sm" ? "size-8" : "size-9"
          )}
        >
          <AvatarImage
            src={user.image || undefined}
            alt={user.name || "User photo"}
          />
          <AvatarFallback className="bg-primary/10 font-semibold text-xs text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg">
        {/* User name & email header */}
        <div className="px-3 py-2">
          <p className="truncate text-sm font-semibold leading-none text-foreground">
            {user.name || "User"}
          </p>
          <p className="mt-1 truncate text-xs leading-none text-muted-foreground">
            {user.email}
          </p>
        </div>

        <DropdownMenuSeparator />

        {/* My Profile */}
        <DropdownMenuItem
          onClick={handleNavigateProfile}
          className="cursor-pointer"
        >
          <UserIcon className="size-4" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout button */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="destructive"
          className="cursor-pointer"
        >
          {isLoggingOut ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;

