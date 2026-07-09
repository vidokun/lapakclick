import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

export const metadata = {
  title: "Pengaturan - Lapakclick",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-fg">Pengaturan</h1>
        <p className="text-muted mt-1">
          Kelola profil akun, keamanan, dan data Anda.
        </p>
      </div>

      <SettingsForm 
        user={{
          id: user.id,
          email: user.email || "",
          name: user.user_metadata?.full_name || "",
        }} 
      />
    </div>
  );
}
