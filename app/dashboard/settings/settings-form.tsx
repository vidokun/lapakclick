"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [name, setName] = useState(user.name);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Security state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Notification state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
  const [showToast, setShowToast] = useState(false);

  const [showDeleteModal1, setShowDeleteModal1] = useState(false);
  const [showDeleteModal2, setShowDeleteModal2] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const showNotification = (msg: string, type: "success" | "error" | "info") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name },
      });

      if (error) throw error;
      showNotification("Profil berhasil diperbarui", "success");
      router.refresh();
    } catch (error) {
      const err = error as Error;
      showNotification(err.message || "Gagal memperbarui profil", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification("Kata sandi baru tidak cocok", "error");
      return;
    }
    if (newPassword.length < 8) {
      showNotification("Kata sandi minimal 8 karakter", "error");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // Supabase updateUser for password requires the user to be signed in
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      showNotification("Kata sandi berhasil diperbarui", "success");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const err = error as Error;
      showNotification(err.message || "Gagal memperbarui kata sandi", "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "HAPUS") {
      showNotification("Ketik HAPUS untuk konfirmasi", "error");
      return;
    }

    setIsDeleting(true);
    try {
      // Use the delete_user RPC we'll create in Supabase
      const { error } = await supabase.rpc("delete_user");
      
      if (error) {
        // Fallback to API route if RPC is not available
        const res = await fetch("/api/auth/delete-account", { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Gagal menghapus akun");
        }
      }

      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      const err = error as Error;
      showNotification(err.message || "Terjadi kesalahan saat menghapus akun", "error");
      setIsDeleting(false);
      setShowDeleteModal2(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 max-w-2xl">
        <Card title="Informasi Profil" subtitle="Perbarui data pribadi Anda.">
          <form onSubmit={handleUpdateProfile} className="mt-4 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Email</label>
              <Input value={user.email} disabled className="bg-surface-2 opacity-70" />
              <p className="text-xs text-muted mt-1">Alamat email tidak dapat diubah di sini.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Nama Lengkap</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Masukkan nama lengkap" 
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isUpdatingProfile || name === user.name}>
                {isUpdatingProfile ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Card>

        <Card title="Keamanan" subtitle="Perbarui kata sandi Anda.">
          <form onSubmit={handleUpdatePassword} className="mt-4 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Kata Sandi Baru</label>
              <Input 
                type="password"
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Minimal 8 karakter" 
                minLength={8}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Konfirmasi Kata Sandi Baru</label>
              <Input 
                type="password"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Konfirmasi kata sandi baru" 
                minLength={8}
                required
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isUpdatingPassword || !newPassword || !confirmPassword}>
                {isUpdatingPassword ? "Memperbarui..." : "Ubah Kata Sandi"}
              </Button>
            </div>
          </form>
        </Card>

        <Card 
          title="Akun" 
          subtitle="Zona berbahaya. Setelah akun dihapus, tidak bisa dikembalikan."
          className="border-negative/30"
        >
          <div className="mt-4">
            <p className="text-sm text-muted mb-4">
              Menghapus akun akan menghapus semua data Anda, termasuk subdomain dan catatan DNS.
            </p>
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteModal1(true)}
            >
              Hapus Akun
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        open={showDeleteModal1}
        onClose={() => setShowDeleteModal1(false)}
        title="Hapus Akun?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal1(false)}>Batal</Button>
            <Button 
              variant="danger" 
              onClick={() => {
                setShowDeleteModal1(false);
                setShowDeleteModal2(true);
              }}
            >
              Lanjutkan
            </Button>
          </>
        }
      >
        <div className="text-fg text-sm space-y-4">
          <p>
            Yakin ingin menghapus akun Anda?
          </p>
          <ul className="list-disc pl-5 text-red-500 font-medium">
            <li>Semua subdomain akan dihapus</li>
            <li>Semua catatan DNS Cloudflare akan dihapus</li>
            <li>Akses akan langsung hilang</li>
          </ul>
        </div>
      </Modal>

      <Modal
        open={showDeleteModal2}
        onClose={() => {
          setShowDeleteModal2(false);
          setDeleteConfirmation("");
        }}
        title="Konfirmasi Penghapusan"
        footer={
          <>
            <Button variant="ghost" onClick={() => {
              setShowDeleteModal2(false);
              setDeleteConfirmation("");
            }}>
              Batal
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== "HAPUS" || isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus Permanen"}
            </Button>
          </>
        }
      >
        <div className="text-fg text-sm space-y-4">
          <p>
            Tindakan ini <strong>tidak</strong> dapat dibatalkan. Ketik <strong>HAPUS</strong> untuk konfirmasi.
          </p>
          <Input 
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="HAPUS"
            className="border-negative/30 focus:border-negative focus:ring-negative/20"
          />
        </div>
      </Modal>

      {showToast && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setShowToast(false)} 
        />
      )}
    </>
  );
}
