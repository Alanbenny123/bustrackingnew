"use client";

import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, pipe, minLength } from "valibot";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/ui/PasswordInput";

const resetPasswordSchema = object({
  password: pipe(
    string(),
    minLength(6, "Password must be at least 6 characters")
  ),
  confirmPassword: pipe(
    string(),
    minLength(6, "Password must be at least 6 characters")
  ),
});

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

type Props = {
  token: string;
};

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: valibotResolver(resetPasswordSchema),
  });

  // Watch password field for confirmation validation
  const password = watch("password");

  // Custom validation for password confirmation
  const validateConfirmPassword = (value: string) => {
    if (value !== password) {
      return "Passwords do not match";
    }
    return true;
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError("root", {
          message: result.error || "Failed to reset password",
        });
        return;
      }

      router.push("/login?reset=true");
    } catch (error) {
      if (error instanceof Error) {
        setError("root", { message: error.message });
        return;
      }

      setError("root", { message: "An error occurred. Please try again." });
    }
  };

  if (!token) {
    return (
      <div className="text-center text-red-500">
        Invalid or missing reset token. Please request a new password reset.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errors.root?.message && (
        <div className="text-red-500 text-sm text-center">
          {errors.root.message}
        </div>
      )}

      <PasswordInput
        id="password"
        label="New Password"
        autoComplete="new-password"
        registration={register("password")}
        error={errors.password?.message}
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirm Password"
        autoComplete="new-password"
        registration={register("confirmPassword", {
          validate: validateConfirmPassword,
        })}
        error={errors.confirmPassword?.message}
      />

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </form>
  );
}
