import { IconCalendar, IconFingerprint, IconHome2, IconLoader2, IconReceipt2, IconUser } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNavigation({ actionButton }) {
  const location = useLocation();

  const items = [
    { label: "Beranda", icon: <IconHome2 size={22} />, path: "/homepage" },
    { label: "Profil", icon: <IconUser size={22} />, path: "/settings" },
  ];

  const hasAction = Boolean(actionButton);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" role="navigation" aria-label="Bottom Navigation">
      {hasAction && <div className="absolute left-1/2 -top-10 transform -translate-x-1/2 z-40">{actionButton}</div>}

      <nav className="relative bg-white border-t border-gray-200 shadow-md">
        <div className={`grid ${hasAction ? "grid-cols-3" : "grid-cols-2"} px-2 py-2 relative z-20 text-center`}>
          {hasAction ? (
            <>
              <BottomNavItem key={0} label={items[0].label} icon={items[0].icon} path={items[0].path} active={location.pathname === items[0].path} />
              <div />
              <BottomNavItem key={1} label={items[1].label} icon={items[1].icon} path={items[1].path} active={location.pathname === items[1].path} />
            </>
          ) : (
            items.map((item, index) => <BottomNavItem key={index} label={item.label} icon={item.icon} path={item.path} active={location.pathname === item.path} />)
          )}
        </div>
      </nav>
    </div>
  );
}

// Pastikan komponen BottomNavItem juga ada di file yang sama atau diimpor
function BottomNavItem({ label, icon, path, active }) {
  return (
    <Link to={path} className={`flex flex-col items-center justify-center text-xs ${active ? "text-indigo-600 font-semibold" : "text-gray-500"}`}>
      {icon}
      <span className="mt-1">{label}</span>
    </Link>
  );
}
