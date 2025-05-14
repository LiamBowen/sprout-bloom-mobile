
import { useLocation, useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { ForgotPassword } from "@/components/auth/ForgotPassword";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isForgotPassword = location.pathname.includes('forgot-password');
  
  const handleBackToSignIn = () => {
    navigate("/auth");
  };

  return isForgotPassword ? (
    <ForgotPassword onBack={handleBackToSignIn} />
  ) : (
    <AuthForm />
  );
};

export default Auth;
