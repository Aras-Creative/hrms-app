"use client";

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { forwardRef } from "react";
import { useState, useEffect } from "react";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  sidebarCollapsed?: boolean; // responsive behavior
}

const UserButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => (
  <button ref={ref} className={`flex items-center w-full gap-2 rounded-lg px-2 py-1 hover:bg-accent hover:text-accent-foreground transition-colors ${className}`} {...props} />
));
UserButton.displayName = "UserButton";

export function NavUser({ user, sidebarCollapsed = false }: NavUserProps) {
  const [side, setSide] = useState<"bottom" | "right">("bottom");

  useEffect(() => {
    setSide(sidebarCollapsed ? "right" : "bottom");
  }, [sidebarCollapsed]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserButton>
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm leading-tight truncate">
            <span className="font-medium truncate">{user.name}</span>
            <span className="text-xs truncate">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto w-4 h-4 transition-transform duration-300 data-[state=open]:rotate-180" />
        </UserButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[220px] rounded-lg shadow-lg z-50 animate-in fade-in scale-in-90" side={side} align="end" sideOffset={4}>
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-2 px-2 py-1">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm truncate items-start">
              <span className="font-medium truncate">{user.name}</span>
              <span className="text-xs truncate">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
