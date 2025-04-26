
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { useLocation } from "react-router-dom";

const Auth = () => {
  // Check if the path includes 'forgot-password'
  const location = useLocation();
  const isForgotPassword = location.pathname.includes('forgot-password');

  if (isForgotPassword) {
    return <ForgotPassword onBack={() => window.location.href = "/auth"} />;
  }

  return <AuthForm />;
};

export default Auth;
