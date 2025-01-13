import {
  IconBriefcase,
  IconCalendar,
  IconCurrencyDollar,
  IconFile,
  IconHeadset,
  IconHelpCircle,
  IconHome,
  IconMailOpened,
  IconMenu2,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

const linkGroups = [
  {
    links: [
      { to: "/", icon: <IconMenu2 /> },
      { to: "/dashboard", icon: <IconHome /> },
      { to: "/dashboard/calendar", icon: <IconCalendar /> },
      { to: "/dashboard/leaves", icon: <IconMailOpened /> },
    ],
    borderClass: "border-b border-zinc-300",
  },
  {
    links: [
      { to: "/dashboard/employee", icon: <IconUserCircle /> },
      { to: "/dashboard/jobrole", icon: <IconBriefcase /> },
      { to: "/dashboard/document", icon: <IconFile /> },
      { to: "/dashboard/payroll", icon: <IconCurrencyDollar /> },
    ],
  },
  {
    links: [
      { to: "/dashboard/settings", icon: <IconSettings /> },
      { to: "/dashboard/help", icon: <IconHeadset /> },
      { to: "/dashboard/faq", icon: <IconHelpCircle className="bg-slate-800 text-slate-100 text-2xl rounded-full" /> },
    ],
    borderClass: "border-t border-gray-300 absolute bottom-0",
  },
];

const renderLinks = (links) => {
  return links.map((link, index) => (
    <NavLink
      key={index}
      to={link.to}
      end
      className={({ isActive }) =>
        `bg-white hover:bg-slate-200 p-3 text-xl rounded-xl transition-all duration-300 ease-out ${
          isActive ? "bg-zinc-200 text-slate-700" : "text-gray-400 hover:text-slate-500"
        } ${link.extraClass || ""} ${link.visibility || ""} lg:p-2 lg:text-xs`
      }
    >
      {link.icon}
    </NavLink>
  ));
};

const Sidebar = () => {
  return (
    <div>
      {linkGroups.map((group, index) => (
        <div key={index} className={`flex flex-col gap-3 justify-center items-center mx-3 py-4 ${group.borderClass}`}>
          {renderLinks(group.links)}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
