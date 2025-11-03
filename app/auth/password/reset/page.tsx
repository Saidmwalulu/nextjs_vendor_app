"use client";

import { Suspense } from "react";
import ResetPasswordInner from "./reset-password-inner";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
