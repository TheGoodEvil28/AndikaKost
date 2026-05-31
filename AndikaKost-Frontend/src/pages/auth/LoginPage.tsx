import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { loginSchema } from "../../utils/validators";
import { login, me } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Logo from "../../assets/Logo.png";

type Values = { email: string; password: string };

export default function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const setMe = useAuthStore((s) => s.setMe);
  const token = useAuthStore((s) => s.token);
  const currentUser = useAuthStore((s) => s.me);

  const { register, handleSubmit, formState, setError } = useForm<Values>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (values: Values) => {
    try {
      const token = await login(values.email, values.password);
      setToken(token);
      const user = await me();
      setMe(user);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/tenant/dashboard", { replace: true });
    } catch {
      setToken(null);
      setMe(null);
      setError("email", { message: "Invalid email or password" });
    }
  };

  useEffect(() => {
    if (!token || !currentUser) return;
    navigate(currentUser.role === "admin" ? "/admin/dashboard" : "/tenant/dashboard", { replace: true });
  }, [token, currentUser, navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-5xl gap-6 p-6 md:grid-cols-2 md:items-center">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="AndikaKost logo" className="h-12 w-12 rounded-xl object-cover" />
            <h1 className="text-2xl font-bold">AndikaKost</h1>
          </div>
          <p className="mt-2 text-slate-600 text-ui-base">
            Simple, accessible kost management for admins and tenants.
          </p>
          <form className="mt-6 grid gap-3" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Email" type="email" {...register("email")} error={formState.errors.email?.message} autoComplete="username" />
            <Input label="Password" type="password" {...register("password")} error={formState.errors.password?.message} autoComplete="current-password" />
            <Button type="submit">Login</Button>
            <div className="text-sm text-slate-600">
              Admin seed credentials are configured in backend <code>.env</code>.
            </div>
          </form>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-ui-lg font-semibold">For Admins</h2>
          <ul className="mt-2 list-disc pl-5 text-slate-700">
            <li>Clear dashboard summary</li>
            <li>Room and tenant management</li>
            <li>Verify payments and respond to complaints</li>
          </ul>
          <h2 className="mt-6 text-ui-lg font-semibold">For Tenants</h2>
          <ul className="mt-2 list-disc pl-5 text-slate-700">
            <li>See bills and payment status</li>
            <li>Upload payment proof</li>
            <li>Submit complaints with optional photos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
