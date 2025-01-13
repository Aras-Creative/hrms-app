import React, { useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import { NavLink } from "react-router-dom";
import { IconArrowLeft, IconEye, IconEyeOff } from "@tabler/icons-react";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();

  const { submitData: LoginPost, loading: LoginLoading, error: LoginError } = useFetch("/auth/register", { method: "POST" });

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
          <h1 className="mb-1 text-lg font-bold text-zinc-700">Hello there!👋</h1>
          <h1 className="text-4xl text-start font-semibold">Getting Started</h1>
          <p className="text-sm text-zinc-600 mt-2">Let's create your account here.</p>

          <div className="mb-4 mt-6">
            <label htmlFor="InputEmailAdress" className="block text-sm px-2 mb-2">
              Email Address
            </label>
            <div className="flex items-center mt-1 rounded-full border border-gray-300 focus-within:border-indigo-500 p-3">
              <input
                type="email"
                placeholder="e.g., example@email.com"
                className="w-full outline-none"
                id="InputEmailAdress"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                placeholder="Password must be at least 8 characters long"
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

          <div className="mt-10">
            <div className="w-full items-center gap-2 flex justify-center mt-4 mb-4">
              <p className="text-xs text-center text-gray-600">
                By creating an account, you agree to our
                <a href="/privacy-policy" className="text-indigo-500 hover:underline px-1">
                  Privacy Policy
                </a>
                and
                <a href="/terms-and-conditions" className="text-indigo-500 hover:underline px-1">
                  Terms & Conditions.
                </a>
              </p>
            </div>

            <button
              type="submit"
              className="rounded-full w-full bg-indigo-500 text-white hover:bg-indigo-700 p-3 font-semibold transition-all duration-300 ease-in-out"
              disabled={LoginLoading}
            >
              {LoginLoading ? "Loading..." : "Create an account"}
            </button>
            <div className="w-full items-center gap-1 flex justify-center mt-3">
              <p className="text-sm">Already have an account?</p>
              <NavLink to={"/auth/sigin"} className={"text-sm hover:underline text-indigo-500"}>
                Login now
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
