import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import DashboardLayouts from "../../layouts/DashboardLayouts";
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import useFetch from "../../hooks/useFetch";
import { IconCalendar, IconCalendarCheck, IconCalendarClock, IconCalendarPause, IconCalendarX, IconClipboardCheck, IconDots, IconHeartBroken, IconUser } from "@tabler/icons-react";
import { NotFound } from "../../components/Errors";
import Table from "../../components/Table";
import { STORAGE_URL } from "../../config";
import SalaryModal from "../../components/SalaryModal";
import FilterDropdown from "../../components/FilterDropdown";
import { fetchJobRoles } from "../../utils/SelectOptions";

const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_FILTER":
      return { ...state, filter: !state.filter };
    case "SET_JOB_ROLE_OPTIONS":
      return { ...state, jobRoleOptions: action.payload };
    case "SET_FILTER_PARAMS":
      return { ...state, filterParams: action.payload };
    default:
      return state;
  }
};

const initialState = {
  filter: false,
  jobRoleOptions: [],
  filterParams: {
    gender: "",
    jobRole: {
      jobRoleId: "",
      jobRoleTitle: "",
    },
  },
};

const Summary = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentPage, pageSize, totalPages, filter, jobRoleOptions, filterParams } = state;

  const getMonthRange = () => {
    const firstDay = moment().startOf("month").toDate();
    const lastDay = moment().endOf("month").toDate();
    return [firstDay, lastDay];
  };

  const [dateRange, setDateRange] = useState(getMonthRange());
  const [modalOpen, setModalOpen] = useState({ isOpen: false, employeeId: "" });
  useEffect(() => {
    setDateRange(getMonthRange());
  }, []);
  const formatDate = (date) => (date ? moment(date).format("YYYY-MM-DD") : "");

  const query = useMemo(() => {
    const genderQuery = filterParams.gender ? `gender=${filterParams.gender.toLowerCase()}` : "";
    const jobRoleQuery = filterParams.jobRole.jobRoleId ? `jobRole=${filterParams.jobRole.jobRoleId.toLowerCase()}` : "";
    const statusQuery = filterParams.status ? `status=${filterParams.status.toLowerCase()}` : "";
    return [genderQuery, jobRoleQuery, statusQuery].filter(Boolean).join("&");
  }, [filterParams]);

  useEffect(() => {
    fetchJobRoles(true, dispatch);
  }, [filter]);

  const { responseData: allEvents, refetch: eventRefetch } = useFetch("/event/all");
  const [holidays, setHolidays] = useState();

  useEffect(() => {
    if (allEvents) {
      const holidaysDate = allEvents
        .filter((event) => event.type === "Holiday")
        .map((holiday) => ({
          startDate: holiday.start,
          endDate: holiday.end,
        }));
      setHolidays(holidaysDate);
    }
  }, [allEvents]);

  const fetchUrl = `/attendance/summary?startDate=${formatDate(dateRange[0])}&endDate=${formatDate(dateRange[1])}${query ? `&${query}` : ""}`;

  const { responseData: summaryData, error, loading, refetch: employeeDataRefetch } = useFetch(fetchUrl);

  const handleOpenModal = useCallback((employeeId) => {
    setModalOpen({ isOpen: true, employeeId });
  }, []);

  const employeeColumns = [
    {
      key: "employee_name",
      label: "Nama Karyawan",
      icon: <IconUser size={20} />,
      render: (keyVal, employee) => {
        const profileImage = employee?.profile_picture && `${STORAGE_URL}/document/${employee?.userId}/${employee.profile_picture}`;
        return (
          <div className="flex items-center gap-3">
            {profileImage ? (
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={profileImage} alt={`${keyVal}'s Profile`} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-slate-800 text-sm">{keyVal[0]?.toUpperCase() || "?"}</div>
            )}
            <div className="flex flex-col">
              <span className="font-bold 2xl:w-full sm:w-24 lg:w-32 truncate">{keyVal}</span>
              <p className="text-xs text-slate-800 font-normal">{employee?.jobrole}</p>
            </div>
          </div>
        );
      },
    },

    {
      key: "hadir",
      label: "Kehadiran",
      icon: <IconCalendarCheck size={20} />,
      render: (val, rowData) => <span className="text-sm text-emerald-700">{val ? `${parseInt(val) + parseInt(rowData.terlambat)} Hari` : "0 Hari"}</span>,
    },
    {
      key: "total_sakit",
      label: "Sakit",
      icon: <IconHeartBroken size={20} />,
      render: (val) => <span className="text-sm text-orange-500">{val ? `${val} Hari` : "0 Hari"}</span>,
    },
    {
      key: "total_cuti",
      label: "Cuti",
      icon: <IconClipboardCheck size={20} />,
      render: (val) => <span className="text-sm text-blue-500">{val ? `${val} Hari` : "0 Hari"}</span>,
    },
    {
      key: "total_izin",
      label: "Izin",
      icon: <IconCalendarX size={20} />,
      render: (val) => <span className="text-sm text-yellow-500">{val ? `${val} Hari` : "0 Hari"}</span>,
    },
    {
      key: "tidak_masuk",
      label: "Tidak Masuk",
      icon: <IconCalendarX size={20} />,
      render: (val) => <span className="text-sm text-red-500">{val ? `${val} Hari` : "0 Hari"}</span>,
    },
    {
      key: "actual_total_late_minutes", // Key ini sekarang akan langsung berisi total menit akumulasi
      label: "Terlambat",
      icon: <IconCalendarClock size={20} />,
      render: (val, rowData) => {
        // Fungsi helper untuk format durasi (tidak perlu diubah)
        const formatDuration = (minutes) => {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return `${hours > 0 ? `${hours} Jam ` : ""}${mins} Menit`;
        };

        return (
          <div className="inline-flex items-center gap-3 p-2 bg-white rounded-md shadow-sm">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                rowData.total_exceeded_times > 0 // Menggunakan nama alias baru dari BE
                  ? "bg-red-100 text-red-600"
                  : "bg-slate-100 text-slate-800"
              }`}>
              <span className="text-xs">⏳</span>

              {/* Menggunakan 'val' yang berisi actual_total_late_minutes */}
              <span className="text-sm font-medium">{formatDuration(val)}</span>
            </div>

            {/* Tambahkan badge Batas Terlampaui di sini jika ada */}
            {rowData.total_exceeded_times > 0 && (
              <span className="text-[10px] text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">Batas Terlampaui {rowData.total_exceeded_times}X</span>
            )}
          </div>
        );
      },
    },

    {
      key: "userId",
      label: "Action",
      icon: "",
      render: (userId) => {
        return (
          <button type="button" onClick={() => handleOpenModal(userId)}>
            <IconDots />
          </button>
        );
      },
    },
  ];

  const countWorkdays = (startDate, endDate, holidays = []) => {
    let start = moment(startDate);
    let end = moment(endDate);
    let workdays = 0;

    let holidayDates = new Set();
    holidays.forEach(({ startDate, endDate }) => {
      let holidayStart = moment(startDate);
      let holidayEnd = moment(endDate).subtract(1, "day");
      while (holidayStart.isSameOrBefore(holidayEnd, "day")) {
        holidayDates.add(holidayStart.format("YYYY-MM-DD"));
        holidayStart.add(1, "day");
      }
    });

    while (start.isSameOrBefore(end, "day")) {
      const isWeekend = start.day() === 0;
      const isHoliday = holidayDates.has(start.format("YYYY-MM-DD"));
      if (!isWeekend && !isHoliday) {
        workdays++;
      }
      start.add(1, "day");
    }
    return workdays;
  };

  const statsData = [
    { label: "Hadir", value: summaryData?.attendanceSummary?.hadir || "0", color: "bg-emerald-700" },
    { label: "Izin Cuti", value: summaryData?.attendanceSummary?.izin_cuti || "0", color: "bg-yellow-500" },
    { label: "Terlambat", value: summaryData?.attendanceSummary?.terlambat || "0", color: "bg-orange-500" },
    { label: "Tidak Masuk", value: summaryData?.attendanceSummary?.tidak_masuk || "0", color: "bg-red-500" },
  ];

  return (
    <>
      <DashboardLayouts>
        <div className="flex flex-col px-5">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex w-full justify-between items-start">
              <div className="flex flex-col w-1/2">
                <h1 className="text-2xl font-bold text-gray-800">Rekap Data Absensi</h1>
                <p className="text-sm text-gray-600">Ringkasan data absensi karyawan untuk memantau kehadiran dan produktivitas.</p>
              </div>
              <div className="w-28 h-28 bg-white rounded-lg shadow-xl">
                <div className="text-center text-sm font-bold text-white py-1 bg-slate-800 rounded-t-xl">
                  {moment(dateRange[0]).format("MMMM") === moment(dateRange[1]).format("MMMM")
                    ? moment(dateRange[0]).format("MMMM")
                    : `${moment(dateRange[0]).format("MMM")} - ${moment(dateRange[1]).format("MMM")}`}
                </div>
                <div className="flex items-center flex-col">
                  <div className="text-4xl mt-3 font-bold text-slate-800">{countWorkdays(dateRange[0], dateRange[1], holidays)}</div>
                  <p className="text-xs font-semibold">Hari Kerja</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="w-full flex items-end gap-2 justify-between mb-3 mt-4">
            <div className="w-full flex gap-3 items-center px-2">
              <div className="flex items-center gap-3 w-1/3">
                <div className="bg-white p-2 rounded-xl border">
                  <IconCalendar />
                </div>
                <Flatpickr
                  value={dateRange}
                  options={{
                    mode: "range",
                    dateFormat: "d M",
                    allowInput: true,
                  }}
                  onChange={setDateRange}
                  className="border rounded-xl p-2 w-full"
                />
              </div>

              <FilterDropdown filter={filter} filterParams={filterParams} jobRoleOptions={jobRoleOptions} dispatch={dispatch} />
            </div>
            <div className="flex flex-col items-end w-1/3 px-4">
              <div className="flex items-center gap-6 my-2">
                {statsData.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-start">
                    <h1 className="text-sm font-bold text-slate-800 whitespace-nowrap">{stat.label}</h1>
                    <div className="flex gap-2 items-center whitespace-nowrap">
                      <div className={`div w-2 h-2 rounded-full ${stat.color}`}></div>
                      <p className="text-xs">{stat.value} Karyawan</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {summaryData?.stats?.length > 0 ? <Table columns={employeeColumns} data={summaryData.stats} /> : <NotFound />}
        </div>
      </DashboardLayouts>

      {modalOpen.isOpen && (
        <SalaryModal
          employeeId={modalOpen.employeeId}
          handleClose={setModalOpen}
          isVisible={modalOpen}
          periode={{
            formattedPeriode: moment(dateRange[0]).format("YYYY-MM"),
          }}
          refetch={employeeDataRefetch}></SalaryModal>
      )}
    </>
  );
};

export default Summary;
