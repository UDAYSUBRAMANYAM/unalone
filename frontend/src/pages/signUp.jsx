import useAuthStore from "../store/authStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUpUser } from "../api/authsignup";

function SignUp() {
  const setToken = useAuthStore((state) => state.setToken);

  const [servererror, setServererror] = useState("");

  const {
    register,
    handleSubmit,
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
      const response = await signUpUser(data);

      console.log("Signup response:", response);

      setToken(response.access_token);

      console.log("Token stored in Zustand");
    } catch (error) {
      console.error("Signup failed:", error);

      setServererror(
        error.response?.data?.detail || "Signup failed"
      );
    }
  };
  return (
    <>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit(onSubmit)}>

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
        />

        {errors.email && (
          <span>{errors.email.message}</span>
        )}

        <input
          type="tel"
          placeholder="Enter Phone Number"
          {...register("phoneNo", {
            required: "Phone number is required",
            pattern: {
              value: /^\+[1-9]\d{7,14}$/,
              message: "Invalid phone number",
            },
          })}
        />

        {errors.phoneNo && (
          <span>{errors.phoneNo.message}</span>
        )}

        <input
          type="text"
          placeholder="Enter Username"
          {...register("username", {
            required: "Username is required",
          })}
        />
        {errors.username && (<span>{errors.username.message}</span>)}
        <input type="password" placeholder="Enter Password"
          {...register("password", {required: "Password is required",minLength: {value: 8,message: "Password must be at least 8 characters",}})}
        />
        {errors.password && (<span>{errors.password.message}</span>)}
        {servererror && (<p>{servererror}</p>)}
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignUp;