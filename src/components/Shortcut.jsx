import { Link } from "react-router-dom";
import { IconCalendar, IconFileInvoice, IconClockHour4, IconClipboardText, IconListDetails } from "@tabler/icons-react";

const Shortcut = () => {
  const items = [
    { label: "Kalender", icon: <IconCalendar size={18} />, color: "text-blue-500", path: "/calendar" }, // Icon size even smaller
    { label: "Izin & Cuti", icon: <IconClipboardText size={18} />, color: "text-green-500", path: "/leave" }, // Icon size even smaller
    { label: "Kehadiran", icon: <IconClockHour4 size={18} />, color: "text-red-500", path: "/attendance-history" }, // Icon size even smaller
    { label: "Gaji", icon: <IconFileInvoice size={18} />, color: "text-purple-500", path: "/payslip" }, // Icon size even smaller
    { label: "Aktivitas", icon: <IconListDetails size={18} />, color: "text-yellow-500", path: "/activity-history" }, // Icon size even smaller
  ];

  return (
    <div className="py-2">
      {" "}
      <div className="flex justify-center space-x-2 px-2">
        {" "}
        {items.map((item, index) => (
          <Link key={index} to={item.path} className="flex flex-col items-center flex-shrink-0 w-[18%] md:w-[15%] text-center">
            <div className={`p-2 rounded-lg border border-gray-100 ${item.color}`}>{item.icon}</div>

            <span className="mt-1 text-xs font-medium text-gray-500 leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shortcut;
