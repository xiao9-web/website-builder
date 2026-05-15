"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const registerSchema = z
  .object({
    name: z.string().min(2, "姓名至少 2 个字符"),
    email: z.string().email("请输入有效邮箱"),
    password: z.string().min(6, "密码至少 6 位"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "注册失败，请稍后再试。",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            小九建站
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            创建账号
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            开始管理你的企业官网和内容站点
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {error && (
            <div
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="姓名"
              type="text"
              placeholder="请输入姓名"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="邮箱"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="密码"
              type="password"
              placeholder="至少 6 位"
              error={errors.password?.message}
              {...register("password")}
            />
            <Input
              label="确认密码"
              type="password"
              placeholder="再次输入密码"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              创建账号
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            已有账号？{" "}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              去登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
