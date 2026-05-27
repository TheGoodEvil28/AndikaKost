import Button from "../ui/Button";
import { useAuthStore } from "../../store/authStore";

export default function Navbar({ title }: { title: string }) {
  const me = useAuthStore((s) => s.me);
  const logout = useAuthStore((s) => s.logout);
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div>
        <div className="text-ui-lg font-semibold">{title}</div>
        {me ? <div className="text-sm text-slate-600">{me.full_name}</div> : null}
      </div>
      <Button variant="secondary" onClick={logout}>
        Logout
      </Button>
    </header>
  );
}

