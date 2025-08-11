import useAuth from "../hooks/useAuth";

export default function Header({ showDot, profilePicture }) {
  const { profile } = useAuth();
  const fullName = profile?.fullName ?? "User";
  const jobTitle = profile?.jobRole?.jobRoleTitle ?? "-";

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex flex-col items-start">
        <img src="/image/sekantor-logo.png" alt="SEKANTOR" className="h-6 w-auto" />
        <span className="text-[10px] text-gray-500">by ARAS Creative</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-1 rounded-full hover:bg-gray-100">
          <IconBell className="w-5 h-5 text-gray-600" />
          {showDot && <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="flex flex-col sm:flex-col text-[10px] sm:text-xs text-right leading-snug text-gray-600 whitespace-nowrap">
            <span className="text-sm font-semibold text-gray-800">{fullName}</span>
            <span className="hidden sm:inline">{jobTitle}</span>
          </div>

          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
            ) : (
              <span className="text-sm font-semibold text-gray-600">{"P"}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
