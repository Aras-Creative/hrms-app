<div className={`w-full top-40 absolute right-0 left-0 h-full bg-gray-100 z-10 rounded-t-3xl py-3`}>
  <div className="mx-auto w-16 h-1 rounded-full bg-slate-600"></div>
  <div className="bg-gray-100 pb-6 rounded-lg">
    <div className="px-4 py-4">
      <div className="px-6 py-3 bg-white shadow rounded-3xl">
        <div className="justify-between items-center flex w-full">
          <div className="flex flex-col gap-1 justify-center">
            <h1 className="text-slate-900 text-lg font-bold">{selectedMonth.label}</h1>
            <div className="flex items-center">
              <IconCalendarCheck />
              <h1 className="text-slate-700">Kehadiran</h1>
            </div>
            <h1 className="text-3xl font-bold text-indigo-600">{stats[0].value} Hari</h1>
          </div>

          <div className="flex justify-center">
            <CircularProgressBar baseColor="stroke-gray-300" strokeColor="stroke-indigo-500" radius={50} strokeWidth={15} text={currentTime.format("HH:mm")} progress={progress} />
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2 mb-2">
          <div className="w-full gap-3 flex items-center">
            <div className="w-1/2 rounded-2xl px-3 py-2 bg-red-500 flex  justify-between items-center text-white font-semibold">
              <div className="flex flex-col">
                <h1 className="text-sm">Absen</h1>
                <h1 className="text-lg font-bold">{stats[2].value} Hari</h1>
              </div>

              <IconCalendarOff />
            </div>
            <div className="w-1/2 rounded-2xl px-3 py-2 bg-yellow-500 flex  justify-between items-center text-white font-semibold">
              <div className="flex flex-col">
                <h1 className="text-sm">Izin/Cuti</h1>
                <h1 className="text-lg font-bold">{stats[1].value} Hari</h1>
              </div>

              <IconCalendarPause />
            </div>
          </div>

          <div className="w-full bg-slate-800 flex justify-between items-center rounded-3xl px-4 py-1">
            <div className="flex gap-4 items-center">
              <IconClockExclamation size={40} className="text-white text-xl" />
              <div className="flex flex-col">
                <h1 className="text-white text-sm">Keterlambatan</h1>
                <p className={`text-sm font-bold ${stats[3].value >= 30 ? "text-red-500" : "text-white"}`}>{stats[3].value}/30 Menit</p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <CircularProgressBar
                textSize={"text-xs"}
                bgTextColor={"none"}
                textColor="text-white"
                radius={24}
                strokeWidth={6}
                text={`${Math.min(Math.floor((stats[3].value / 30) * 100), 100)}%`}
                progress={Math.min(Math.floor((stats[3].value / 30) * 100), 100)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="px-4 pb-4">
      <div className="py-3 px-2 flex items-center overflow-hidden justify-between bg-white shadow rounded-3xl">
        <div>
          <NavLink to={"/leave/request"} className="px-3 py-2.5 flex w-full whitespace-nowrap items-center gap-2 flex-row-reverse text-white font-bold bg-indigo-500 rounded-full">
            <p className="text-xs">Izin Cuti</p>
            <IconCalendarPause size={16} />
          </NavLink>
        </div>

        <div>
          <NavLink to={"/payslip"} className="px-3 py-2.5 flex w-full whitespace-nowrap items-center gap-2 flex-row-reverse text-white font-bold bg-indigo-500 rounded-full">
            <p className="text-xs">Slip Gaji</p>
            <IconReceipt size={16} />
          </NavLink>
        </div>

        <div className="overflow-hidden">
          <NavLink
            to={"/calendar"}
            className="p-2.5 flex w-full whitespace-nowrap overflow-hidden items-center gap-2 flex-row-reverse text-white font-bold bg-indigo-500 rounded-full">
            <p className="text-xs">Kalender</p>
            <IconCalendar size={16} />
          </NavLink>
        </div>
      </div>
    </div>

    <div className="w-full px-4">
      <div className="w-full bg-white rounded-3xl shadow border px-5 py-4">
        <div className="flex justify-between">
          <h1 className="text-sm text-slate-800 font-semibold">{formatDate(new Date())}</h1>
        </div>
        <div className="mt-4 pl-3 w-full">
          {TodayEvent && TodayEvent?.type === "Holiday" ? (
            <div className="flex flex-col items-center w-full justify-center pb-4 mt-12">
              <img src={RestDayIMG} alt="Rest Day" className="w-72 mb-4" />
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-800">Hari Ini Adalah Hari Libur 🎉</h2>
                <p className=" text-gray-600 mb-2">Waktunya santai, nikmati liburmu!</p>
                <p className="text-sm font-medium text-blue-500">{TodayEvent.title}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full border-l border-zinc-400 pl-6">
                <AttendanceItem
                  time={todayAttendance?.clockIn || "N/A"}
                  label="Jam masuk"
                  statusLabel={"Jam Masuk"}
                  status={todayAttendance?.status === "Hadir" ? "Tepat Waktu" : todayAttendance?.status || "Belum ada"}
                  statusIcon={
                    todayAttendance?.status === "Terlambat" ? (
                      <IconCircleXFilled className="text-red-500" />
                    ) : todayAttendance?.clockIn ? (
                      <IconCircleCheckFilled className="text-green-500" />
                    ) : (
                      <IconCircle className="text-zinc-400" />
                    )
                  }
                  icon={<IconTransferIn />}
                  statusClass={`${
                    todayAttendance?.clockIn
                      ? `bg-gradient-to-br ${
                          todayAttendance?.status === "Hadir"
                            ? "from-green-500 to-teal-400"
                            : todayAttendance?.status === "Terlambat"
                            ? "from-red-600 to-red-500"
                            : todayAttendance?.status === "Tidak Masuk"
                            ? "from-red-500 to-pink-600"
                            : "from-green-500 to-teal-400"
                        } text-white`
                      : "bg-zinc-50 text-zinc-600"
                  }`}
                  iconClass={`${todayAttendance?.clockIn ? "text-white" : "text-indigo-600"}`}
                />
                {/* <AttendanceItem
                            time={todayAttendance?.breakOut || "N/A"}
                            label={`${todayAttendance?.breakOut ? `Mulai jam ${todayAttendance?.breakOut}` : "Belum dimulai"}`}
                            status={`Jam ${currentTime.format("HH:mm")}`}
                            statusIcon={
                              todayAttendance?.breakIn ? (
                                <IconCircleCheckFilled className="text-green-500" />
                              ) : todayAttendance?.breakOut ? (
                                <IconMapPinFilled className="text-indigo-500" />
                              ) : (
                                <IconCircle className="text-zinc-400" />
                              )
                            }
                            icon={<IconCoffee />}
                            statusLabel={"Istirahat"}
                            statusClass={`${
                              todayAttendance?.breakIn
                                ? "bg-gradient-to-br from-green-500 to-teal-400 text-white"
                                : todayAttendance?.breakOut
                                ? "bg-gradient-to-bl from-indigo-700 to-indigo-500 text-white"
                                : "bg-zinc-50 text-zinc-600"
                            }`}
                            iconClass={`${todayAttendance?.breakOut ? "text-white" : "text-indigo-600"}`}
                          />

                          <AttendanceItem
                            time={todayAttendance?.breakIn || "N/A"}
                            label="Istirahat selesai"
                            status={`Jam ${currentTime.format("HH:mm")}`}
                            statusIcon={todayAttendance?.breakIn ? <IconCircleCheckFilled className="text-green-500" /> : <IconCircle className="text-zinc-400" />}
                            statusLabel={"Selesai"}
                            icon={<IconCoffeeOff />}
                            statusClass={`${todayAttendance?.breakIn ? "bg-gradient-to-br from-green-500 to-teal-400 text-white" : "bg-zinc-50 text-zinc-600"}`}
                            iconClass={`${todayAttendance?.breakIn ? "text-white" : "text-indigo-600"}`}
                          /> */}
                <AttendanceItem
                  time={todayAttendance?.clockOut || profile?.workingHours?.clockOut}
                  label="Jam pulang"
                  statusLabel={"Jam Pulang"}
                  statusIcon={todayAttendance?.clockOut ? <IconCircleCheckFilled className="text-green-500" /> : <IconCircle className="text-zinc-400" />}
                  status={`Jam ${currentTime.format("HH:mm")}`}
                  icon={<IconTransferOut />}
                  statusClass={`${todayAttendance?.clockOut ? "bg-gradient-to-br from-green-500 to-teal-400 text-white" : "bg-zinc-50 text-zinc-600"}`}
                  iconClass={`${todayAttendance?.clockOut ? "text-white" : "text-indigo-600"}`}
                />

                <ShiftCard remainingTime="" status={todayAttendance?.status} />
                {!isDisabled() && <ButtonStatus onClick={doPostFetch} loading={recordAttendanceLoading} label={todayAttendance?.clockIn ? "Masuk" : "Pulang"} />}
              </div>
            </>
          )}
        </div>
        {!isDisabled() && (
          <div className="w-full mt-6" onMouseMove={onSwipe} onTouchMove={onSwipe} onMouseUp={stopSwipe} onTouchEnd={stopSwipe} onMouseDown={startSwipe} onTouchStart={startSwipe}>
            <div className="bg-slate-100 w-full rounded-full p-2 relative">
              <div className="absolute inset-0 flex items-center justify-center text-center z-0">
                <p className="text-slate-500">
                  {(() => {
                    if (todayAttendance?.clockIn && !todayAttendance?.breakOut) {
                      return "Isitrahat";
                    } else if (todayAttendance?.breakOut && !todayAttendance?.breakIn) {
                      return "Selesai Istirahat";
                    } else if (todayAttendance?.breakIn && !todayAttendance?.clockOut) {
                      return "Pulang";
                    } else if ((todayAttendance?.clockIn, todayAttendance?.clockOut, todayAttendance?.breakIn, todayAttendance?.breakOut)) {
                      return "Selesai";
                    } else {
                      return "Masuk";
                    }
                  })()}
                </p>
              </div>
              <div
                className="bg-indigo-500 z-10 flex items-center justify-center text-white font-bold h-12 w-12 rounded-full cursor-pointer"
                style={{ transform: `translateX(${position}px)` }}>
                {recordAttendanceLoading ? (
                  <div className="animate-spin">
                    <IconLoader2 />
                  </div>
                ) : (
                  <IconArrowRight />
                )}
              </div>
            </div>

            <AttendanceCalendar data={AttendanceData?.attendanceStats?.thisMonthData || []} />
          </div>
        )}
      </div>
    </div>
  </div>
</div>;

// const [progress, setProgress] = useState(0);
// useEffect(() => {
//   const startTime = moment(profile?.workingHours?.clockIn, "HH:mm");
//   const endTime = moment(profile?.workingHours?.clockOut, "HH:mm");
//   const interval = setInterval(() => {
//     const now = moment();
//     if (now.isAfter(endTime)) {
//       clearInterval(interval);
//       setProgress(100);
//     } else {
//       const totalDuration = endTime.diff(startTime);
//       const elapsedDuration = now.diff(startTime);
//       const progressPercentage = (elapsedDuration / totalDuration) * 100;
//       setProgress(progressPercentage);
//     }
//   }, 1000);

//   return () => clearInterval(interval);
// }, []);

const [position, setPosition] = useState(0);
const [dragging, setDragging] = useState(false);
const [hasFetched, setHasFetched] = useState(false);

const startSwipe = useCallback((e) => {
  setDragging(true);
}, []);

const onSwipe = (e) => {
  if (dragging) {
    const offsetX = e.clientX || e.touches[0].clientX;
    const newPosition = Math.max(0, Math.min(window.innerWidth - 140, offsetX - 40));
    setPosition(newPosition);

    let threshold = window.innerWidth * 0.7;
    if (window.innerWidth < 720) {
      threshold = window.innerWidth * 0.4;
    }
    if (newPosition >= threshold && !hasFetched) {
      doPostFetch();
      setHasFetched(true);

      setTimeout(() => {
        setHasFetched(false);
      }, 10000);
    }
  }
};

const stopSwipe = () => {
  setPosition(0);
  setDragging(false);
};

const AttendanceItem = ({ time, label, statusLabel, status, icon, statusClass, iconClass, statusIcon }) => (
  <div className="flex w-full items-center py-2">
    <div className="flex w-1/2 flex-col items-start relative">
      <h1 className="text-slate-800 font-semibold">{time}</h1>
      <p className="text-[12px] text-zinc-400">{label}</p>
      <div className="absolute -left-9 top-2 bg-white rounded-full">{statusIcon}</div>
    </div>
    <div className={`w-1/2 border rounded-xl py-2 px-3 flex items-center justify-between ${statusClass}`}>
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-semibold whitespace-nowrap">{statusLabel}</h1>
        <span className="text-[10px]">{status}</span>
      </div>
      <div className={iconClass}>{icon}</div>
    </div>
  </div>
);
