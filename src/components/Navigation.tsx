
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  title: string;
  showBackButton?: boolean;
  showFormatButton?: boolean;
  onFormatClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ title, showBackButton = false, showFormatButton = false, onFormatClick }) => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    window.location.href = '/login';
  };

  const currentUser = localStorage.getItem('currentUser');
  const user = currentUser ? JSON.parse(currentUser) : null;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 w-full">
      <div className="w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showBackButton && (
            <Button variant="ghost" size="lg" onClick={() => window.history.back()}>
              Back
            </Button>
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {showFormatButton && (
            <Button variant="outline" size="lg" onClick={onFormatClick}>
              Format Data
            </Button>
          )}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg">
                  More
                  <ChevronDown className="relative left-1 h-5 w-5 transition-transform duration-200 group-[data-state=open]:rotate-180" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] md:grid-cols-2">
                    {items.map((item) => (
                      <ListItem key={item.title} title={item.title} href={item.href}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-12 w-12 p-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuItem disabled className="text-base">
                <span className="font-bold">{user?.name}</span>
                <br />
                <span className="text-muted-foreground">{user?.email}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-base">
                <Link to="/profile" className="w-full h-full block">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-base">
                <Link to="/settings" className="w-full h-full block">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-base">
                <LogOut className="mr-2 h-5 w-5" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
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
  )
});
ListItem.displayName = "ListItem";

const NavigationMenuContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "z-50 absolute top-0 left-0 w-full origin-top-center data-[motion=from-end]:animate-in data-[motion=from-start]:animate-in data-[motion=from-end]:fade-in data-[motion=from-start]:fade-in data-[motion=from-end]:zoom-in-95 data-[motion=from-start]:zoom-in-95 data-[motion=to-end]:animate-out data-[motion=to-start]:animate-out data-[motion=to-end]:fade-out data-[motion=to-start]:fade-out data-[motion=to-end]:zoom-out-95 data-[motion=to-start]:zoom-out-95 md:w-auto",
      className
    )}
    {...props}
  />
);
NavigationMenuContent.displayName = "NavigationMenuContent";

const NavigationMenuTrigger = React.forwardRef<
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

const items = [
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

export default Navigation;
