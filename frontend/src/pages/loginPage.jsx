import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginUser } from "../api/authlogin";
import useAuthStore from "../store/authStore";
function LoginPage() {
  const [servererror, setServererror] = useState("");
  const setToken = useAuthStore((state) => state.setToken);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+[1-9]\d{7,14}$/;
  const {register,handleSubmit,formState: { errors },} = useForm({defaultValues: {identifier: "",password: "",},});
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
      console.log("Login response:", response);
      setToken(response.access_token);
      console.log("Token stored");
    } catch (error) {
      console.error("Login failed:", error);
      setServererror(
        error.response?.data?.detail || "Login failed"
      );
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Enter Email or Phone"
          {...register("identifier", {
            required: "Email or phone number is required",
          })}
        />
        {errors.identifier && (
          <span>{errors.identifier.message}</span>
        )}
        <input
          type="password"
          placeholder="Enter Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          })}
        />
        {errors.password && (
          <span>{errors.password.message}</span>
        )}
        {servererror && (
          <span>{servererror}</span>
        )}
        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default LoginPage;