"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  FormLabel,
  FormItem,
  FormControl,
  FormField,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { loginShema } from "@/utils/auth.schema";
import { AuthCard } from "@/components/auth.card";
import Link from "next/link";
import axios from "axios";
import { API_URL } from "@/server";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useUserStore } from "@/store/user.store";

export default function SignIn() {
  const { login, setLoading, setError } = useUserStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof loginShema>>({
    resolver: zodResolver(loginShema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof loginShema>) {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/login",
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      );
      const user = response.data.user;
      toast.success(response.data.message);

      login(user);
      
      if (user.role === "ADMIN") router.push("/dashboard/admin");
      else if (user.role === "SELLER") router.push("/dashboard/seller");
      else router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg = error.response?.data?.message || "Error logging in";
        toast.error(errMsg);
        setError(errMsg);
      }
      console.error("Login error", error);
    }
  }
  const handleLoginWithGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="bg-gray-50 flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthCard
          title="Welcome!!"
          description="Sign in to your account to continue"
          footer={
            <span>
              New account?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-700 hover:underline"
              >
                sign up here
              </Link>
            </span>
          }
        >
          <Form {...form}>
            <div className="flex flex-col">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-[10px] top-[30%] text-gray-400 w-h h-4" />
                            <Input
                              placeholder="email@example.com"
                              {...field}
                              className="pl-[35px]"
                            />
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
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

                <div className="my-4">
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="grid gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </div>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  or continue with
                </span>
              </div>
            </div>
            <div>
              <Button
                onClick={handleLoginWithGoogle}
                variant="outline"
                className="w-full hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
            </div>
            {/* <div className="mt-3">
              <Button
                variant="outline"
                className="w-full hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
              >
                Continue with Facebook
              </Button>
            </div> */}
          </Form>
        </AuthCard>
      </div>
    </div>
  );
}
