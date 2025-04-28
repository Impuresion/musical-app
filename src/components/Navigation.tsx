
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Home, Radio, Search } from "lucide-react";

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export function Navigation() {
  const location = useLocation();
  
  const navigationItems: NavigationItem[] = [
    {
      path: "/",
      label: "My Music",
      icon: <Home className="h-4 w-4" />
    },
    {
      path: "/recommendations",
      label: "Recommendations",
      icon: <Radio className="h-4 w-4" />
    },
    {
      path: "/browse",
      label: "Browse",
      icon: <Search className="h-4 w-4" />
    }
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          variant={location.pathname === item.path ? "default" : "outline"}
          asChild
          className="gap-2 border-primary hover:bg-primary"
        >
          <Link to={item.path}>
            {item.icon}
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
