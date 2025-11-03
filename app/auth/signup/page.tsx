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
import { registerSchema } from "@/utils/auth.schema";
import { AuthCard } from "@/components/auth.card";
import Link from "next/link";
import axios from "axios";
import { API_URL } from "@/server";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/user.store";

export default function SignUp() {
  const { login, setLoading, setError } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        },
        { withCredentials: true }
      );
      const user = response.data;
      toast.success(
        "Registered successful!!, Check your email to verify your account!",
        { duration: 10000 }
      );
      login(user);
      console.log("User", user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errMsg =
          error.response?.data?.message || "Error registering user";
        toast.error(errMsg);
        setError(errMsg);
      }

      console.error("Error registering user:", error);
    } finally {
      //form.reset();
    }
  }
  return (
    <div className="bg-gray-50 flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthCard
          title="Create Account!!"
          description="Join us today and get started!"
          footer={
            <span>
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-blue-700 hover:underline"
              >
                sign in here
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-[10px] top-[30%] text-gray-400 w-h h-4" />
                            <Input
                              placeholder="enter your name"
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

                <div className="grid gap-2 mt-4">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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

                <div className="grid gap-2 mt-5">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
                  >
                    {isSubmitting ? "Registering..." : "Register"}
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
                  or continue with Gmail
                </span>
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                className="w-full hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
            </div>
          </Form>
        </AuthCard>
      </div>
    </div>
  );
}
