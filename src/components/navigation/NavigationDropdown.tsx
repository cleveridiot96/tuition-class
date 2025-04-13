
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { NavigationMenuContent, NavigationMenuTrigger, ListItem, items } from "./NavigationItems";

const NavigationDropdown = () => {
  // Get current location to conditionally hide the dropdown on stock page
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Don't render the dropdown on the stock page
  if (location.pathname === "/stock") {
    return null;
  }

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="navigation-dropdown">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger 
              className="text-sm md:text-lg px-2 md:px-4 py-1 md:py-2 android-ripple"
              onClick={() => setIsOpen(prev => !prev)}
            >
              More
              <ChevronDown className="relative left-0 md:left-1 h-4 w-4 md:h-5 md:w-5 transition-transform duration-200 group-[data-state=open]:rotate-180" />
            </NavigationMenuTrigger>
            {isOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 bg-white shadow-lg rounded-md border">
                <ul className="grid gap-2 md:gap-3 p-3 md:p-6 md:w-[500px] lg:w-[600px] md:grid-cols-2 max-h-[80vh] overflow-y-auto">
                  {items.map((item) => (
                    <ListItem 
                      key={item.title} 
                      title={item.title} 
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </div>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavigationDropdown;
