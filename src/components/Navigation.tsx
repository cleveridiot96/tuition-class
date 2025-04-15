
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Home, Menu as MenuIcon } from "lucide-react";
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
  
  const handleFormatData = () => {
    if (onFormatClick) {
      // Dispatch a custom event that will be captured by FormatEventConnector
      document.dispatchEvent(new CustomEvent('format-click'));
      onFormatClick();
    }
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showBackButton && (
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              Back
            </Button>
          )}
          <Link to="/" className="flex items-center mr-4">
            <Button variant="ghost" size="icon" className="mr-2">
              <Home size={18} />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {showFormatButton && (
            <Button variant="outline" size="sm" onClick={handleFormatData}>
              Format Data
            </Button>
          )}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <div className="group inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  <MenuIcon className="mr-2 h-4 w-4" />
                  Menu
                  <ChevronDown className="relative left-1 h-4 w-4 transition-transform duration-200 group-[data-state=open]:rotate-180" />
                </div>
                <div className="z-50 absolute top-full left-0 w-full origin-top-center data-[motion=from-end]:animate-in data-[motion=from-start]:animate-in data-[motion=from-end]:fade-in data-[motion=from-start]:fade-in data-[motion=from-end]:zoom-in-95 data-[motion=from-start]:zoom-in-95 data-[motion=to-end]:animate-out data-[motion=to-start]:animate-out data-[motion=to-end]:fade-out data-[motion=to-start]:fade-out data-[motion=to-end]:zoom-out-95 data-[motion=to-start]:zoom-out-95 md:w-auto">
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] md:grid-cols-2 bg-white shadow-lg rounded-md max-h-[70vh] overflow-y-auto">
                    {items.map((item) => (
                      <ListItem key={item.title} title={item.title} href={item.href}>
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
              <DropdownMenuItem disabled>
                <span className="font-bold">{user?.name}</span>
                <br />
                <span className="text-muted-foreground">{user?.email}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="w-full h-full block">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="w-full h-full block">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
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
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </li>
  )
});
ListItem.displayName = "ListItem";

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
    title: "Master Data",
    href: "/master",
    description: "Manage people & companies",
  },
  {
    title: "Cash Book",
    href: "/cashbook",
    description: "Track cash transactions",
  },
  {
    title: "Party Ledger",
    href: "/ledger",
    description: "View party balances",
  },
];

export default Navigation;
