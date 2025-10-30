"use client";
import { AuthCard } from "@/components/auth.card";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/server";
import { useUserStore } from "@/store/user.store";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function VerifyEmail() {
  const { code } = useParams<{ code: string }>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);

  const { login } = useUserStore();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/auth/email/verify/${code}`
        );
        setMessage(response.data.success);
        setSuccess(true);
        const user = response.data.user;
        login(user);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Error verifying email");
          setMessage(error.response?.data?.message || "Error verifying email");
          console.error("Error verifying email:", error);
        }
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };
    if (code) verifyEmail();
  }, [code, login]);

  const resendEmail = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/resend/email`, {
        withCredentials: true,
      });
      toast.success(response.data.success,{duration: 10000});
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {success ? (
          <AuthCard
            title={message}
            logo={
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            }
            description="Your email address has been verified. You can now access all features of your account."
          >
            <Button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer">
              <Link href="/auth/signin">Continue to Login</Link>
            </Button>
            <Button
              variant={"outline"}
              className="w-full hover:shadow-lg transform hover:scale-[1.02] cursor-pointer mt-4"
            >
              <Link
                href="/"
                className="text-blue-700 text-sm flex justify-center "
              >
                Go home
              </Link>
            </Button>
          </AuthCard>
        ) : (
          <AuthCard title="Invalid or Expired Link" description={message}>
            <Button
              onClick={resendEmail}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
            >
              Resend Verification Link
            </Button>
          </AuthCard>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
