import { LoginForm } from "@/components/LoginForm";

async function LoginPage({ searchParams }) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm callbackUrl={callbackUrl || "/dashboard"} />
      </div>
    </div>
  );
}

export default LoginPage;
