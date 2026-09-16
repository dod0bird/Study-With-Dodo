import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b p-4 flex items-center justify-between max-w-2xl mx-auto">
      <Link href="/" className="font-semibold">
        StudySync
      </Link>
      {user ? (
        <form action={logout} className="flex items-center gap-3">
          <span className="text-sm text-zinc-500">{user.email}</span>
          <button className="text-sm border rounded-lg px-3 py-1">Log out</button>
        </form>
      ) : (
        <Link href="/login" className="text-sm border rounded-lg px-3 py-1">
          Log in
        </Link>
      )}
    </nav>
  );
}