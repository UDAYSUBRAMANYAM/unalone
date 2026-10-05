
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";

import { loginUser } from "../api/authlogin";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const [servererror, setServererror] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+[1-9]\d{7,14}$/;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // If already logged in, don't show login page
  useEffect(() => {
    if (token) {
      navigate("/landing_page", { replace: true });
    }
  }, [token, navigate]);

  const getIdentifierType = (identifier) => {
    if (emailRegex.test(identifier)) {
      return "email";
    }

    if (phoneRegex.test(identifier)) {
      return "phno";
    }

    return null;
  };

  const onSubmit = async (data) => {
    setServererror("");

    const identifierType = getIdentifierType(data.identifier);

    if (!identifierType) {
      setServererror("Invalid email or phone number");
      return;
    }

    const loginData =
      identifierType === "email"
        ? {
            email: data.identifier,
            password: data.password,
          }
        : {
            phno: data.identifier,
            password: data.password,
          };

    try {
      const response = await loginUser(loginData);


      // Store JWT
      setToken(response.access_token);


      // Go directly to landing page
      navigate("/landing_page", { replace: true });
    } catch (error) {

      setServererror(
        error.response?.data?.detail || "Login failed"
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050608] text-white">

      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      {/* Emerald ambient light */}

      <div
        className="
          pointer-events-none
          absolute
          -left-48
          top-[-80px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-emerald-950/50
          blur-[160px]
        "
      />

      {/* Purple ambient light */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-150px]
          top-[10%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-purple-950/50
          blur-[170px]
        "
      />

      {/* Blue ambient light */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-250px]
          left-[30%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-blue-950/40
          blur-[180px]
        "
      />

      {/* =====================================================
          PAGE
      ====================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-5
          py-10
        "
      >

        {/* =================================================
            LOGIN CARD
        ================================================== */}

        <div
          className="
            w-full
            max-w-md
            rounded-[2rem]
            border
            border-white/[0.09]
            bg-white/[0.035]
            p-6
            sm:p-8
            shadow-[inset_0_1px_0_rgba(255,255,255,0.09),inset_0_-1px_0_rgba(0,0,0,0.5),0_35px_100px_rgba(0,0,0,0.55)]
            backdrop-blur-3xl
          "
        >

          {/* =================================================
              HEADER
          ================================================== */}

          <div className="mb-9 text-center">

            {/* LOKOL Logo */}

            <Link
              to="/"
              className="
                mx-auto
                mb-6
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-[1.25rem]
                border
                border-emerald-400/20
                bg-gradient-to-br
                from-emerald-800
                via-emerald-900
                to-[#06130f]
                text-xl
                font-black
                text-emerald-200
                shadow-[inset_4px_4px_8px_rgba(255,255,255,0.12),inset_-6px_-7px_12px_rgba(0,0,0,0.75),0_15px_35px_rgba(16,185,129,0.12)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-emerald-300/30
              "
            >
              L
            </Link>

            <p
              className="
                mb-2
                text-[10px]
                font-bold
                tracking-[0.35em]
                text-emerald-400/50
              "
            >
              WELCOME BACK
            </p>

            <h1
              className="
                text-3xl
                font-black
                tracking-tight
              "
            >
              Login to LOKOL
            </h1>

            <p
              className="
                mx-auto
                mt-3
                max-w-xs
                text-sm
                leading-relaxed
                text-white/35
              "
            >
              Connect with people around you.
              Your local world is waiting.
            </p>

          </div>

          {/* =================================================
              LOGIN FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* =================================================
                EMAIL / PHONE
            ================================================== */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-medium
                  text-white/45
                "
              >
                Email or Phone Number
              </label>

              <input
                type="text"
                placeholder="Email or +919876543210"
                autoComplete="username"
                {...register("identifier", {
                  required: "Email or phone number is required",
                })}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/[0.08]
                  bg-black/20
                  px-4
                  py-3.5
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-white/20
                  shadow-[inset_0_2px_8px_rgba(0,0,0,0.35),inset_0_-1px_0_rgba(255,255,255,0.025)]
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  focus:border-emerald-400/30
                  focus:bg-white/[0.045]
                  focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.35),0_0_25px_rgba(16,185,129,0.05)]
                "
              />

              {errors.identifier && (
                <span
                  className="
                    mt-1.5
                    block
                    text-xs
                    text-red-400/80
                  "
                >
                  {errors.identifier.message}
                </span>
              )}

            </div>

            {/* =================================================
                PASSWORD
            ================================================== */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  className="
                    text-xs
                    font-medium
                    text-white/45
                  "
                >
                  Password
                </label>

                <button
                  type="button"
                  className="
                    text-[11px]
                    font-medium
                    text-purple-400/60
                    transition
                    hover:text-purple-300
                  "
                  onClick={() => {
                    // Forgot password can be implemented later
                  }}
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message:
                        "Password must be at least 8 characters long",
                    },
                  })}
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-black/20
                    px-4
                    py-3.5
                    pr-12
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/20
                    shadow-[inset_0_2px_8px_rgba(0,0,0,0.35),inset_0_-1px_0_rgba(255,255,255,0.025)]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    focus:border-purple-400/30
                    focus:bg-white/[0.045]
                    focus:shadow-[inset_0_2px_8px_rgba(0,0,0,0.35),0_0_25px_rgba(168,85,247,0.05)]
                  "
                />

                {/* Show / Hide Password */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    flex
                    items-center
                    justify-center
                    text-white/25
                    transition-all
                    duration-200
                    hover:text-white/70
                    focus:outline-none
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      strokeWidth={1.7}
                    />
                  ) : (
                    <Eye
                      size={18}
                      strokeWidth={1.7}
                    />
                  )}
                </button>

              </div>

              {errors.password && (
                <span
                  className="
                    mt-1.5
                    block
                    text-xs
                    text-red-400/80
                  "
                >
                  {errors.password.message}
                </span>
              )}

            </div>

            {/* =================================================
                SERVER ERROR
            ================================================== */}

            {servererror && (
              <div
                className="
                  rounded-2xl
                  border
                  border-red-400/10
                  bg-red-500/[0.06]
                  px-4
                  py-3
                  text-center
                  text-sm
                  text-red-300/80
                  backdrop-blur-xl
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
                "
              >
                {servererror}
              </div>
            )}

            {/* =================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              type="submit"
              className="
                group
                relative
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-emerald-400/20
                bg-gradient-to-br
                from-emerald-800
                via-emerald-900
                to-[#06130f]
                px-6
                py-4
                text-sm
                font-bold
                text-emerald-100
                shadow-[inset_4px_4px_8px_rgba(255,255,255,0.10),inset_-6px_-7px_12px_rgba(0,0,0,0.75),0_15px_35px_rgba(16,185,129,0.10)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-emerald-300/30
                hover:shadow-[inset_4px_4px_8px_rgba(255,255,255,0.12),inset_-6px_-7px_12px_rgba(0,0,0,0.75),0_20px_40px_rgba(16,185,129,0.16)]
                active:translate-y-0
              "
            >

              {/* Button ambient shine */}

              <span
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-transparent
                  via-white/[0.05]
                  to-transparent
                  translate-x-[-100%]
                  transition-transform
                  duration-700
                  group-hover:translate-x-[100%]
                "
              />

              <span className="relative">
                Login
              </span>

            </button>

          </form>

          {/* =================================================
              SIGNUP
          ================================================== */}

          <div
            className="
              mt-8
              border-t
              border-white/[0.06]
              pt-6
              text-center
            "
          >

            <p className="text-sm text-white/30">
              Don't have an account?
            </p>

            <Link
              to="/signup"
              className="
                mt-2
                inline-block
                text-sm
                font-semibold
                text-emerald-400/80
                transition-all
                hover:text-emerald-300
              "
            >
              Create your LOKOL account →
            </Link>

          </div>

          {/* =================================================
              BACK TO HOME
          ================================================== */}

          <div className="mt-5 text-center">

            <Link
              to="/"
              className="
                text-[11px]
                text-white/20
                transition
                hover:text-white/45
              "
            >
              ← Back to home
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;
