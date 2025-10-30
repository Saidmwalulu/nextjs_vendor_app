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
import { passwordResetRequestSchema } from "@/utils/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Mail, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { API_URL } from "@/server";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const form = useForm<z.infer<typeof passwordResetRequestSchema>>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof passwordResetRequestSchema>) {
    try {
      const response = await axios.post(
        `${API_URL}/auth/password/forgot`,
        {
          email: values.email,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setEmail(values.email);
        setEmailSent(true);
        toast.success(response.data.success, {duration: 10000});
      }
    } catch (error) {
      if (axios.isAxiosError(error)) toast.error(error.response?.data?.message || "Error sending reset link");
    }
  }

  if (emailSent) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <AuthCard
            title="Check Your Email"
            logo={
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            }
            description={
              <span>
                We&apos;ve sent a password reset link to
                <br />
                <span>{email}</span>
              </span>
            }
          >
            <div className="text-sm text-gray-600 text-center">
              <p>
                Didn&apos;t receive the email? check your spam folder or try
                again.
              </p>
            </div>
            <Button
              onClick={() => setEmailSent(false)}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
            >
              Resend Email
            </Button>
            <Button
              variant={"outline"}
              className="w-full hover:shadow-lg transform hover:scale-[1.02] cursor-pointer mt-4"
            >
              <Link
                href="/auth/signin"
                className="text-blue-700 text-sm flex justify-center "
              >
                Back to Sign In
              </Link>
            </Button>
          </AuthCard>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthCard
          title="Forgot Password?"
          description="No worries! Enter your email and we'll send you reset instructions."
          footer={
            <span>
              Remember your password?{" "}
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
                <div className="grid gap-2 mt-5">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
                  >
                    {isSubmitting ? "Sending reset link..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            </div>
          </Form>
        </AuthCard>
      </div>
    </div>
  );
}
