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
    <div className="app-page min-h-screen">
      <div className="mx-auto grid max-w-6xl gap-6 p-4 md:grid-cols-12 md:items-center md:p-8">
        <div className="theme-surface rounded-3xl border p-6 md:col-span-5 md:p-7">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="AndikaKost logo" className="h-12 w-12 rounded-xl border border-white/40 shadow" />
            <h1 className="text-2xl font-bold brand-heading">AndikaKost</h1>
          </div>
          <p className="mt-2 text-ui-base text-muted">Login to manage rooms, payments, and complaints with a clean centralized workflow.</p>
          <form className="mt-6 grid gap-3" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Email" type="email" {...register("email")} error={formState.errors.email?.message} autoComplete="username" />
            <Input
              label="Password"
              type="password"
              {...register("password")}
              error={formState.errors.password?.message}
              autoComplete="current-password"
            />
            <Button type="submit">Login</Button>
            <div className="text-sm text-muted">
              Admin seed credentials are configured in backend <code>.env</code>.
            </div>
          </form>
        </div>

        <div className="theme-surface rounded-3xl border p-6 md:col-span-7 md:p-8">
          <div className="inline-flex rounded-full brand-chip px-3 py-1 text-sm font-semibold">Platform Benefits</div>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">One sleek workspace for admin and tenant operations</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <h3 className="text-lg font-semibold brand-heading">For Admins</h3>
              <ul className="mt-2 list-disc pl-5 text-muted">
                <li>Live occupancy and booking visibility</li>
                <li>Structured payment verification flow</li>
                <li>Complaint handling with status tracking</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
              <h3 className="text-lg font-semibold brand-heading">For Tenants</h3>
              <ul className="mt-2 list-disc pl-5 text-muted">
                <li>Transparent bill and payment status</li>
                <li>Fast upload of payment proof</li>
                <li>Simple complaint submission process</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
