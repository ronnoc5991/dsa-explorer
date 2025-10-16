"use client";

import { useEffect, useRef, useState } from "react";
import "./styles.css";

type AccordionProps = {
  header: React.ReactNode;
  body: React.ReactNode;
};

export default function Accordion({ header, body }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const accordionBody = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!accordionBody.current) return;

    const closedHeight = 0;
    const openHeight = accordionBody.current.scrollHeight;

    const fromHeight = isOpen ? closedHeight : openHeight;
    const toHeight = isOpen ? openHeight : closedHeight;

    accordionBody.current.style.height = `${fromHeight}px`;
    console.log("setting from: ", fromHeight);

    const onTransitionEnd = () => {
      if (!accordionBody.current) return;
      console.log("transition ended");
      accordionBody.current.style.height = "";
      accordionBody.current.removeEventListener(
        "transitionend",
        onTransitionEnd
      );
    };

    accordionBody.current.addEventListener("transitionend", onTransitionEnd);

    setTimeout(() => {
      if (!accordionBody.current) return;
      accordionBody.current.style.height = `${toHeight}px`;
      console.log("setting to: ", toHeight);
    }, 0);

    return () => {
      console.log("attempting to remove listener");
      if (!accordionBody.current) return;
      accordionBody.current.removeEventListener(
        "transitionend",
        onTransitionEnd
      );
    };
  }, [isOpen]);

  return (
    <div className="accordion">
      <button onClick={() => setIsOpen((o) => !o)}>{header}</button>
      <div
        className={`accordion-body ${isOpen ? "accordion-body--open" : ""}`}
        ref={accordionBody}
      >
        {body}
      </div>
    </div>
  );
}
