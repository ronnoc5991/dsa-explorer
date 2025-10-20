"use client";

// import { useState } from "react";
import linkMap, { ALGORITHMS_PATH, DATA_STRUCTURES_PATH } from "@/app/linkMap";
import "./styles.css";
import useIsMobile from "@/hooks/useIsMobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

// TODO: bring in clsx to handle class names?

export default function Header() {
  // TODO: implement hamburger later?
  // const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="header">
      {/* <button
        className={`hamburger ${isOpen ? "hamburger--open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
      >
        <div></div>
        <div></div>
        <div></div>
      </button> */}
      <NavigationMenu viewport={isMobile}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <a href="/">DSA Explorer</a>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <a href={DATA_STRUCTURES_PATH}>Data Structures</a>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {Object.values(linkMap.dataStructures).map(
                ({ displayName, href }) => (
                  <NavigationMenuLink>
                    <a href={href}>{displayName}</a>
                  </NavigationMenuLink>
                )
              )}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <a href={ALGORITHMS_PATH}>Algorithms</a>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {Object.values(linkMap.algorithms).map(
                ({ displayName, href }) => (
                  <NavigationMenuLink>
                    <a href={href}>{displayName}</a>
                  </NavigationMenuLink>
                )
              )}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
