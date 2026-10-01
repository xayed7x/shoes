"use client";

import { useState, ReactNode, createContext, useContext } from "react";

interface TabsCtx {
  active: string;
  setActive: (id: string) => void;
}
const Ctx = createContext<TabsCtx | null>(null);
const useTabs = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Tabs parts must be inside Tabs.Root");
  return ctx;
};

function Root({
  defaultTab,
  children,
}: {
  defaultTab: string;
  children: ReactNode;
}) {
  const [active, setActive] = useState(defaultTab);
  return <Ctx.Provider value={{ active, setActive }}>{children}</Ctx.Provider>;
}

function List({ children }: { children: ReactNode }) {
  return (
    <div
      role="tablist"
      className="flex gap-1 p-1 bg-[#0D1424] rounded-[12px] border border-white/06 w-fit"
    >
      {children}
    </div>
  );
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  const isActive = active === id;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tab-panel-${id}`}
      id={`tab-${id}`}
      type="button"
      onClick={() => setActive(id)}
      className={`
        px-4 py-1.5 rounded-[10px] text-[13px] font-medium transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
        ${
          isActive
            ? "bg-[#111A2E] text-[#E6EAF2] shadow-sm"
            : "text-[#8B95A9] hover:text-[#E6EAF2]"
        }
      `}
    >
      {children}
    </button>
  );
}

function Panel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs();
  if (active !== id) return null;
  return (
    <div
      role="tabpanel"
      id={`tab-panel-${id}`}
      aria-labelledby={`tab-${id}`}
    >
      {children}
    </div>
  );
}

export const Tabs = { Root, List, Tab, Panel };
