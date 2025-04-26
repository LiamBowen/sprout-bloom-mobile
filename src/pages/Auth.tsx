
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { ForgotPassword } from "@/components/auth/ForgotPassword";

const Auth = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  if (isForgotPassword) {
    return <ForgotPassword onBack={() => setIsForgotPassword(false)} />;
  }

  return <AuthForm />;
};

export default Auth;
