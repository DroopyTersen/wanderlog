import { Link, useLocation } from "react-router-dom";

export const TabLink = ({ to, children, isActive }) => {
  return (
    <Link
      to={to}
      className={`font-semibold tab tab-bordered ${
        isActive ? "tab-active" : ""
      }`}
    >
      {children}
    </Link>
  );
};

export const Tabs = ({ items }: { items: { to: string; label: string }[] }) => {
  let { pathname } = useLocation();
  let activeTab =
    items.find(({ to }) => pathname.includes(to))?.to || items[0]?.to;

  return (
    <div className="tabs mt-8 uppercase font-bold">
      {items.map(({ to, label }) => (
        <TabLink key={to} to={to} isActive={activeTab === to}>
          {label}
        </TabLink>
      ))}
    </div>
  );
};
