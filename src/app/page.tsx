import { LoginForm } from "@/components/forms/auth/login-form";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="">
      <LoginForm />
      <Toaster />
    </div>
  );
}
