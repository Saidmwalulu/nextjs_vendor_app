"use client";
import { AuthCard } from "@/components/auth.card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/utils/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/server";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const exp = searchParams.get("exp");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      verificationCode: code ?? "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    console.log(values);
    try {
      const response = await axios.post(`${API_URL}/auth/password/reset`, {
        password: values.password,
        confirmPassword: values.confirmPassword,
        verificationCode: values.verificationCode,
      });
      toast.success(response.data.success, { duration: 8000 });
      router.push("/auth/signin");
    } catch (error) {
      if (axios.isAxiosError(error)) toast.error(error.response?.data?.message);
    }
  }
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthCard
          title="Reset your password!!"
          description="Enter your new password below and proceed to signin account!"
        >
          <Form {...form}>
            <div className="flex flex-col">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-2 mt-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-[10px] top-[30%] text-gray-400 w-h h-4" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="enter password"
                              {...field}
                              className="pl-[35px]"
                            />
                            <div
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-[10px] top-[30%] text-gray-400 cursor-pointer"
                            >
                              {showPassword ? (
                                <EyeOff className="w-[18px] h-[18px]" />
                              ) : (
                                <Eye className="w-[18px] h-[18px]" />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2 mt-4">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm new password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-[10px] top-[30%] text-gray-400 w-h h-4" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="confirm password"
                              {...field}
                              className="pl-[35px]"
                            />
                            <div
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-[10px] top-[30%] text-gray-400 cursor-pointer"
                            >
                              {showPassword ? (
                                <EyeOff className="w-[18px] h-[18px]" />
                              ) : (
                                <Eye className="w-[18px] h-[18px]" />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Hidden field for verificationCode */}
                <input type="hidden" {...form.register("verificationCode")} />

                <div className="grid gap-2 mt-5">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
                  >
                    {isSubmitting ? "Reseting password..." : "Reset password"}
                  </Button>
                </div>
              </form>
            </div>
            <div>
              <Button
                variant="outline"
                className="w-full hover:shadow-lg transform hover:scale-[1.02] cursor-pointer mt-4"
              >
                <Link href="/auth/forgot-password" className="text-blue-700 text-sm">Request new reset link</Link>
              </Button>
            </div>
          </Form>
        </AuthCard>
      </div>
    </div>
  );
}
