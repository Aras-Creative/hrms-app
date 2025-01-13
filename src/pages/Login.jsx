import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import { NavLink, useNavigate } from "react-router-dom";
import { IconArrowLeft, IconEye, IconEyeOff } from "@tabler/icons-react";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const { login } = useAuth();

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

  return (
    <div className="min-h-screen flex flex-col items-center bg-white max-w-screen-sm mx-auto">
      <div className="w-full mt-0 rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-24 flex items-center justify-between">
            <button type="button" className="bg-white text-slate-800">
              <IconArrowLeft />
            </button>
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

          {LoginError && <p className="text-red-500 mt-2 px-2 text-sm">{LoginError}</p>}

          <div className="mt-8">
            <button
              type="submit"
              className="rounded-full w-full bg-indigo-500 text-white hover:bg-indigo-700 p-3 font-semibold transition-all duration-300 ease-in-out"
              disabled={LoginLoading}
            >
              {LoginLoading ? "Loading..." : "Login"}
            </button>
            <div className="w-full items-center gap-2 flex justify-center mt-3">
              <p className="text-sm">Belum punya akun?</p>
              <NavLink to={"/auth/sigin"} className={"text-sm hover:underline text-indigo-500"}>
                Hubungi Administrator
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
