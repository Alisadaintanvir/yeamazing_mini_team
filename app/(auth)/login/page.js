import { LoginForm } from "@/components/LoginForm";
import { AuthHeader } from "@/components/AuthHeader";

async function LoginPage({ searchParams }) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-screen w-full flex flex-col">
      <AuthHeader />
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        {/* Content */}
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>
          <LoginForm callbackUrl={callbackUrl || "/dashboard"} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
