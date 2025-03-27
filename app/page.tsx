import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import { authOptions } from "@/lib/auth-options";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  redirect('/dashboard');
}