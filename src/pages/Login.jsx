import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { NavLink } from "react-router-dom";
import { IconCircleCheck, IconDeviceMobile, IconEye, IconEyeOff } from "@tabler/icons-react";
import useAuth from "../hooks/useAuth";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import AutoCloseModal from "../components/AutoCloseModal";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "", fingerprint: "" });
  const { login } = useAuth();
  const [notification, setNotification] = useState("");

  const [showChangeDeviceModal, setShowChangeDeviceModal] = useState(false);
  const [changeDeviceForm, setChangeDeviceForm] = useState({ loginID: "", deviceID: "" });

  const handleChangeDevice = () => {
    setShowChangeDeviceModal(true);
  };

  const handleCloseModal = () => {
    setShowChangeDeviceModal(false);
    setChangeDeviceForm((prev) => ({ ...prev, loginID: "" }));
  };

  const { submitData: muate, loading, error } = useFetch("/auth/change-device", { method: "POST" });

  const handleSubmitChangeDevice = async (e) => {
    e.preventDefault();

    const { success, data, error: mutateError } = await muate(changeDeviceForm);

    setShowChangeDeviceModal(false);
    setChangeDeviceForm((prev) => ({ ...prev, loginID: "" }));

    setNotification("Berhasil request, hubungi administrator untuk konfirmasi approval");

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    const loadFingerprint = async () => {
      let fingerprint = localStorage.getItem("fingerprint");
      if (!fingerprint) {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        fingerprint = result.visitorId;
        localStorage.setItem("fingerprint", fingerprint);
      }
      setFormData((prevState) => ({
        ...prevState,
        fingerprint: fingerprint,
      }));
      setChangeDeviceForm((prev) => ({ ...prev, deviceID: fingerprint }));
    };
    loadFingerprint();
  }, []);

  const { submitData: LoginPost, loading: LoginLoading, error: LoginError } = useFetch("/auth/login", { method: "POST" });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, data } = await LoginPost(formData);
    if (success) {
      login(data.content);
    }
  };

  console.log(LoginError);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white max-w-screen-sm mx-auto">
      <div className="w-full mt-0 rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-24 flex items-center justify-end">
            <img src="/image/sekantor-logo.png" className="w-24" alt="logo" />
          </div>
          <h1 className="mb-2 text-lg font-bold text-zinc-700">Selamat datang!👋</h1>
          <h1 className="text-4xl text-start font-semibold">Login ke akun kamu dulu yuk!</h1>
          <p className="text-sm text-zinc-600 mt-2">Ayo masuk ke akunmu untuk memulai.</p>

          <div className="mb-4 mt-6">
            <label htmlFor="InputEmailAdress" className="block text-sm px-2 mb-2">
              Email atau ID
            </label>
            <div className="flex items-center mt-1 rounded-full border border-gray-300 focus-within:border-indigo-500 p-3">
              <input
                type="text"
                placeholder="Email atau ID Karyawan"
                className="w-full outline-none"
                id="InputEmailAdress"
                name="email"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor="InputPassword" className="text-sm block px-2 mb-2">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-full border border-gray-300 focus-within:border-indigo-500 p-3 mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Katasandi minimal 8 karakter"
                className="w-full outline-none"
                id="InputPassword"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button type="button" onClick={togglePasswordVisibility} className="text-gray-500 hover:text-indigo-500">
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          {/* {LoginError && <p className="text-red-500 mt-2 px-2 text-sm">{LoginError}</p>} */}

          {LoginError && (
            <div className="mt-2 px-2 space-y-1">
              {Array.isArray(LoginError) ? (
                // Langsung array of string?
                typeof LoginError[0] === "string" ? (
                  LoginError.map((msg, i) => (
                    <p key={i} className="text-red-500 text-sm">
                      {msg}
                    </p>
                  ))
                ) : (
                  // Array of object? [{ password: [...] }]
                  LoginError.map((errObj, index) =>
                    Object.entries(errObj).map(([field, messages]) =>
                      Array.isArray(messages) ? (
                        messages.map((msg, idx) => (
                          <p key={`${field}-${index}-${idx}`} className="text-red-500 text-sm">
                            {msg}
                          </p>
                        ))
                      ) : (
                        <p key={`${field}-${index}`} className="text-red-500 text-sm">
                          {messages}
                        </p>
                      )
                    )
                  )
                )
              ) : typeof LoginError === "object" ? (
                // Object biasa? { password: [...] }
                Object.entries(LoginError).map(([field, messages]) =>
                  Array.isArray(messages) ? (
                    messages.map((msg, idx) => (
                      <p key={`${field}-${idx}`} className="text-red-500 text-sm">
                        {msg}
                      </p>
                    ))
                  ) : (
                    <p key={field} className="text-red-500 text-sm">
                      {messages}
                    </p>
                  )
                )
              ) : (
                // Fallback last resort
                <p className="text-red-500 text-sm">{String(LoginError)}</p>
              )}
            </div>
          )}

          <div className="mt-8">
            <button
              type="submit"
              className="rounded-full w-full bg-indigo-500 text-white hover:bg-indigo-700 p-3 font-semibold transition-all duration-300 ease-in-out"
              disabled={LoginLoading}>
              {LoginLoading ? "Loading..." : "Login"}
            </button>
            <div className="w-full items-center gap-2 flex justify-center mt-3">
              <p className="text-sm">Belum punya akun?</p>
              <NavLink to={"#"} className={"text-sm hover:underline text-indigo-500"}>
                Hubungi Administrator
              </NavLink>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button type="button" onClick={handleChangeDevice} className="flex items-center gap-2 text-sm text-indigo-500 hover:underline">
              <IconDeviceMobile className="w-4 h-4" />
              Ganti Perangkat
            </button>
          </div>
        </form>
      </div>
      {showChangeDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-zinc-700">Ganti Perangkat</h2>
            <form onSubmit={handleSubmitChangeDevice}>
              <label htmlFor="loginId" className="block text-sm mb-2">
                Masukkan Email atau ID Karyawan
              </label>
              <input
                type="text"
                id="loginId"
                value={changeDeviceForm.loginID}
                onChange={(e) =>
                  setChangeDeviceForm((prev) => ({
                    ...prev,
                    loginID: e.target.value,
                  }))
                }
                placeholder="Email atau ID"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={handleCloseModal} className="text-sm text-gray-600 hover:text-gray-800">
                  Batal
                </button>
                <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded text-sm hover:bg-indigo-600">
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notification && <AutoCloseModal duration={5000} message={notification} icon={<IconCircleCheck className="mx-auto text-green-500 w-16 h-16 mb-4" />} />}

      <div className=" text-center text-xs text-slate-600 pb-24">
        &copy; {new Date().getFullYear()} Sekantor by Aras Creative. All rights reserved.
        <br />
        Version 2.1.0
      </div>
    </div>
  );
};

export default Login;
