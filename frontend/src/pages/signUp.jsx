import useAuthStore from "../store/authStore";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { signUpUser } from "../api/authsignup";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

function SignUp() {
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const [servererror, setServererror] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      phoneNo: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServererror("");

    try {
      /*
       * react-phone-number-input automatically gives us
       * the phone number in E.164 format.
       *
       * Example:
       * +919876543210
       *
       * No spaces
       * No hyphens
       * No brackets
       */

      const signupData = {
        ...data,
        phoneNo: data.phoneNo,
      };

      console.log("Signup data:", signupData);

      const response = await signUpUser(signupData);

      console.log("Signup response:", response);

      // Store the token returned by the backend
      setToken(response.access_token);

      console.log("Token stored in Zustand");

      // Signup successful → go to Login page
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);

      setServererror(
        error.response?.data?.detail || "Signup failed"
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050608] text-white">

      {/* Ambient background */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-10
          h-96
          w-96
          rounded-full
          bg-emerald-950/60
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-120px]
          top-20
          h-[420px]
          w-[420px]
          rounded-full
          bg-purple-950/60
          blur-[150px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-180px]
          left-[35%]
          h-[420px]
          w-[420px]
          rounded-full
          bg-blue-950/50
          blur-[150px]
        "
      />

      {/* Page */}

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

        {/* Signup glass container */}

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
            shadow-[inset_0_1px_0_rgba(255,255,255,0.09),inset_0_-1px_0_rgba(0,0,0,0.4),0_35px_100px_rgba(0,0,0,0.5)]
            backdrop-blur-3xl
          "
        >

          {/* Header */}

          <div className="mb-8 text-center">

            <Link
              to="/"
              className="
                mx-auto
                mb-6
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                border-emerald-400/20
                bg-gradient-to-br
                from-emerald-800
                to-emerald-950
                text-lg
                font-black
                text-emerald-200
                shadow-[inset_3px_3px_7px_rgba(255,255,255,0.12),inset_-5px_-6px_10px_rgba(0,0,0,0.7),0_12px_30px_rgba(16,185,129,0.12)]
                transition
                hover:-translate-y-0.5
              "
            >
              L
            </Link>

            <p
              className="
                mb-2
                text-[10px]
                font-bold
                tracking-[0.3em]
                text-emerald-400/50
              "
            >
              WELCOME TO LOKOL
            </p>

            <h1 className="text-3xl font-black tracking-tight">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-white/35">
              Create your account and start discovering
              people around you.
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* Email */}

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
                Email
              </label>

              <input
                type="email"
                placeholder="Enter Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
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
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-white/20
                  shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]
                  backdrop-blur-xl
                  transition
                  focus:border-emerald-400/30
                  focus:bg-white/[0.045]
                "
              />

              {errors.email && (
                <span
                  className="
                    mt-1.5
                    block
                    text-xs
                    text-red-400/80
                  "
                >
                  {errors.email.message}
                </span>
              )}

            </div>

            {/* Phone Number */}

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
                Phone Number
              </label>

              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.08]
                  bg-black/20
                  px-4
                  py-3.5
                  shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]
                  backdrop-blur-xl
                  transition
                  focus-within:border-purple-400/30
                  focus-within:bg-white/[0.045]
                "
              >

                <Controller
                  name="phoneNo"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      international
                      defaultCountry="IN"
                      placeholder="Enter phone number"
                      className="
                        phone-input
                        w-full
                        text-sm
                        text-white
                      "
                    />
                  )}
                />

              </div>

              {errors.phoneNo && (
                <span
                  className="
                    mt-1.5
                    block
                    text-xs
                    text-red-400/80
                  "
                >
                  {errors.phoneNo.message}
                </span>
              )}

            </div>

            {/* Username */}

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
                Username
              </label>

              <input
                type="text"
                placeholder="Enter Username"
                {...register("username", {
                  required: "Username is required",
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
                  shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]
                  backdrop-blur-xl
                  transition
                  focus:border-blue-400/30
                  focus:bg-white/[0.045]
                "
              />

              {errors.username && (
                <span
                  className="
                    mt-1.5
                    block
                    text-xs
                    text-red-400/80
                  "
                >
                  {errors.username.message}
                </span>
              )}

            </div>

            {/* Password */}

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
                Password
              </label>

              <input
                type="password"
                placeholder="Enter Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
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
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-white/20
                  shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]
                  backdrop-blur-xl
                  transition
                  focus:border-violet-400/30
                  focus:bg-white/[0.045]
                "
              />

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

            {/* Server error */}

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
                "
              >
                {servererror}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              className="
                w-full
                rounded-2xl
                border
                border-emerald-400/20
                bg-gradient-to-br
                from-emerald-800
                to-emerald-950
                px-6
                py-4
                text-sm
                font-bold
                text-emerald-100
                shadow-[inset_3px_3px_7px_rgba(255,255,255,0.12),inset_-5px_-6px_10px_rgba(0,0,0,0.7),0_15px_35px_rgba(16,185,129,0.12)]
                transition
                hover:-translate-y-0.5
                hover:border-emerald-300/30
                active:translate-y-0
              "
            >
              Sign Up
            </button>

          </form>

          {/* Login navigation */}

          <div
            className="
              mt-7
              border-t
              border-white/[0.06]
              pt-6
              text-center
            "
          >

            <p className="text-sm text-white/30">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="
                mt-2
                inline-block
                text-sm
                font-semibold
                text-emerald-400/80
                transition
                hover:text-emerald-300
              "
            >
              Login to LOKOL →
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SignUp;
