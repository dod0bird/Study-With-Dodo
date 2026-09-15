import { login, signup } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="p-8 max-w-sm mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Log in</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="border rounded-lg p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={6}
          className="border rounded-lg p-2"
        />
        <button formAction={login} className="bg-black text-white rounded-lg p-2">
          Log in
        </button>
        <button formAction={signup} className="border rounded-lg p-2">
          Sign up
        </button>
      </form>
    </main>
  );
}