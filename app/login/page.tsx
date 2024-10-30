import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginLink className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Sign In
      </LoginLink>
    </div>
  );
}
