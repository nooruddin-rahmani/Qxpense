import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <RegisterLink className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Sign Up
      </RegisterLink>
    </div>
  );
}
