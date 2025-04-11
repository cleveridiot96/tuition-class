
import React from "react";
import { cn } from "@/lib/utils";

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
}

export const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-lg",
            className
          )}
          {...props}
        >
          <div className="text-lg font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-base leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

export const items = [
  {
    title: "Purchases",
    href: "/purchases",
    description: "Record and manage purchases",
  },
  {
    title: "Sales",
    href: "/sales",
    description: "Create and manage sales",
  },
  {
    title: "Inventory",
    href: "/inventory",
    description: "View and manage stock",
  },
  {
    title: "Stock Report",
    href: "/stock",
    description: "Real-time stock analysis",
  },
  {
    title: "Payments",
    href: "/payments",
    description: "Record outgoing payments",
  },
  {
    title: "Receipts",
    href: "/receipts",
    description: "Manage incoming payments",
  },
  {
    title: "Contacts",
    href: "/master",
    description: "Manage people & companies",
  },
  {
    title: "Cash Book",
    href: "/cashbook",
    description: "Track cash transactions",
  },
  {
    title: "Ledger",
    href: "/ledger",
    description: "View party balances",
  },
];

export const NavigationMenuContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "z-50 absolute top-0 left-0 w-full origin-top-center data-[motion=from-end]:animate-in data-[motion=from-start]:animate-in data-[motion=from-end]:fade-in data-[motion=from-start]:fade-in data-[motion=from-end]:zoom-in-95 data-[motion=from-start]:zoom-in-95 data-[motion=to-end]:animate-out data-[motion=to-start]:animate-out data-[motion=to-end]:fade-out data-[motion=to-start]:fade-out data-[motion=to-end]:zoom-out-95 data-[motion=to-start]:zoom-out-95 md:w-auto",
      className
    )}
    {...props}
  />
);
NavigationMenuContent.displayName = "NavigationMenuContent";

export const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "group inline-flex h-12 items-center justify-center rounded-md bg-background px-5 py-3 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent data-[active]:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";
