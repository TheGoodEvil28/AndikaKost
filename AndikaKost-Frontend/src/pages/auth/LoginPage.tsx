import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loginSchema } from "../../utils/validators";
import { login, me } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/ui/Icon";
import PublicHeader from "../../components/layout/PublicHeader";

type Values = { email: string; password: string };

const workspaceFeatures = [
  { icon: "rooms" as const, title: "Room clarity", description: "Assignments, availability, and resident details in one place." },
  { icon: "wallet" as const, title: "Payment tracking", description: "Bills and uploaded proof with a visible verification status." },
  { icon: "complaints" as const, title: "Responsive support", description: "Submit and track maintenance concerns without losing context." }
];

export default function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setMe = useAuthStore((state) => state.setMe);
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.me);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState, setError } = useForm<Values>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (values: Values) => {
    try {
      const nextToken = await login(values.email, values.password);
      setToken(nextToken);
      const user = await me();
      setMe(user);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/tenant/dashboard", { replace: true });
    } catch {
      setToken(null);
      setMe(null);
      setError("email", { message: "The email or password is incorrect." });
    }
  };

  useEffect(() => {
    if (!token || !currentUser) return;
    navigate(currentUser.role === "admin" ? "/admin/dashboard" : "/tenant/dashboard", { replace: true });
  }, [token, currentUser, navigate]);

  return (
    <div className="app-page min-h-screen">
      <PublicHeader />
      <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 sm:py-8 lg:grid-cols-[1fr_0.82fr] lg:items-stretch lg:gap-7 lg:py-12">
        <section className="relative order-2 overflow-hidden rounded-[1.75rem] bg-[var(--action-primary-bg)] p-6 text-[var(--action-primary-fg)] shadow-[var(--shadow-lg)] sm:p-8 lg:order-1 lg:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.1em]">
              <Icon name="shield" className="h-4 w-4" />
              Secure workspace
            </div>
            <h1 className="mt-5 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">Everything about your stay, organized and easy to follow.</h1>
            <p className="mt-4 max-w-xl leading-7 opacity-80">
              Admins get an operational overview. Tenants get a simple home for rooms, bills, and support.
            </p>
            <div className="mt-8 grid gap-3">
              {workspaceFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15">
                    <Icon name={feature.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-bold">{feature.title}</h2>
                    <p className="mt-1 text-sm leading-5 opacity-75">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="theme-surface order-1 rounded-[1.75rem] border p-5 sm:p-8 lg:order-2 lg:p-10">
          <div className="page-kicker">Welcome back</div>
          <h2 className="mt-2 text-3xl font-bold text-[var(--surface-fg)]">Sign in to AndikaKost</h2>
          <p className="mt-2 text-muted">Use the account provided by your AndikaKost administrator.</p>

          <form className="mt-7 grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Email address"
              type="email"
              {...register("email")}
              error={formState.errors.email?.message}
              autoComplete="username"
              placeholder="name@example.com"
            />
            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={formState.errors.password?.message}
                autoComplete="current-password"
                placeholder="Enter your password"
              />
              <label className="mt-2 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg text-sm font-semibold text-muted-strong">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                  className="h-4 w-4 accent-[var(--action-primary-bg)]"
                />
                Show password
              </label>
            </div>
            <Button type="submit" loading={formState.isSubmitting} className="mt-1 w-full">
              Sign in
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-subtle)] p-3 text-sm leading-6 text-muted">
            Need account access? Contact the property admin. Login credentials are never displayed on this page.
          </div>
        </section>
      </main>
    </div>
  );
}
