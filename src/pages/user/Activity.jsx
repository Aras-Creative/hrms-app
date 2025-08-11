import { IconAlertCircle, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import useFetch from "../../hooks/useFetch";
import { format, parseISO } from "date-fns";
import Layouts from "./profile/Layouts";
import useAuth from "../../hooks/useAuth";
import { id } from "date-fns/locale";

const Activity = () => {
  const { profile } = useAuth();
  const { responseData: activities } = useFetch(`/employee/activities/${profile?.userId}`);

  return (
    <Layouts backUrl={"/homepage"} title={"Riwayat Log AKtivitas"}>
      <ActivityList activities={activities ?? []} />
    </Layouts>
  );
};

export default Activity;

function ActivityList({ activities }) {
  const statusMap = {
    success: { icon: <IconCircleCheck size={18} />, color: "text-green-500" },
    failed: { icon: <IconCircleX size={18} />, color: "text-red-500" },
    pending: { icon: <IconAlertCircle size={18} />, color: "text-yellow-500" },
  };

  return (
    <div className="w-full mt-12 px-4 rounded-3xl py-4 bg-white shadow-sm">
      {" "}
      <ul className="divide-y divide-gray-200">
        {activities?.length > 0 ? (
          activities.map((item) => {
            const statusInfo = statusMap[item.status] || {
              icon: <IconCircleX size={18} className="text-gray-400" />,
              color: "text-gray-700",
            };

            const activityInfo = {
              label: item.activity.replace(/_/g, " ") || "Aktivitas Tidak Dikenal",
            };

            const formattedDate = item.createdAt ? format(parseISO(item.createdAt), "dd MMMM yyyy, HH:mm", { locale: id }) : "-";

            return (
              <li key={item.id} className="flex items-start gap-3 py-4">
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800 flex items-center">
                    <span className={`mr-2 text-xs font-semibold ${statusInfo.color}`}>{statusInfo.icon}</span>
                    <span className="capitalize"> {activityInfo.label}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.meta?.reason || `Status: ${item.status}`}</p>
                  <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
                </div>
              </li>
            );
          })
        ) : (
          <li className="py-4 text-center text-gray-500">Tidak ada aktivitas terbaru.</li>
        )}
      </ul>
    </div>
  );
}
