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

const loginSchema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(6, "密码至少 6 位"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      await login(data);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "登录失败，请稍后再试。",
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
            登录运营后台
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            管理站点内容、产品服务、最近动态和留言线索
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
              label="邮箱"
              type="email"
              placeholder="admin@xiao9.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="密码"
              type="password"
              placeholder="请输入密码"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              登录
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            还没有账号？{" "}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
