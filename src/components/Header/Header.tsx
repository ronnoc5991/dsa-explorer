"use client";

import { useState } from "react";
import linkMap, { DATA_STRUCTURES_PATH, ALGORITHMS_PATH } from "@/app/linkMap";
import Accordion from "../Accordion/Accordion";
import "./styles.css";

// TODO: have a slide out thing when hovering on a category
// render the list of things for that category

// create the mobile stuff...
// if we switch to desktop viewports, toggle that to true or just use an isMobile boolean somewhere
// need to show another menu based on the open state...
// does it need to transition for now?
// when we bring in transitions... can slide in from left and inert when not open or on desktop viewport
// display none it on desktop viewports

// TODO: bring in clsx to handle class names?

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <button
        className={`hamburger ${isOpen ? "hamburger--open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
      >
        <div></div>
        <div></div>
        <div></div>
      </button>
      <a href="/">DSA Explorer</a>
      <nav className={`mobile-nav ${isOpen ? "mobile-nav--open" : ""}`}>
        <ul className="mobile-link-list">
          <li>
            <Accordion
              header={<a href={DATA_STRUCTURES_PATH}>Data Structures</a>}
              body={
                <ul>
                  {Object.values(linkMap.dataStructures).map(
                    ({ displayName, href }) => (
                      <li key={href}>
                        <a href={href}>{displayName}</a>
                      </li>
                    )
                  )}
                </ul>
              }
            />
          </li>
          <li>
            <Accordion
              header={<a href={ALGORITHMS_PATH}>Algorithms</a>}
              body={
                <ul>
                  {Object.values(linkMap.algorithms).map(
                    ({ displayName, href }) => (
                      <li key={href}>
                        <a href={href}>{displayName}</a>
                      </li>
                    )
                  )}
                </ul>
              }
            />
          </li>
        </ul>
      </nav>
      {/* <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          width: "100%",
        }}
      >
        <a href="/">DSA Explorer</a>
        <ul
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <li>
            <a href={DATA_STRUCTURES_PATH}>Data Structures</a>
          </li>
          <li>
            <a href={ALGORITHMS_PATH}>Algorithms</a>
          </li>
        </ul>
      </nav> */}
    </header>
  );
}
