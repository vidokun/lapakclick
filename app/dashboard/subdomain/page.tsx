"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table, TableColumn } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Search, Plus } from "lucide-react";

type Subdomain = {
  id: string;
  name: string;
  status: "active" | "pending" | "suspended";
  created_at: string;
  target?: string;
  ssl_status?: string;
};

export default function SubdomainPage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingSubdomain, setDeletingSubdomain] = useState<Subdomain | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const fetchSubdomains = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/subdomains");
        if (!res.ok) throw new Error("Failed to fetch subdomains");
        const data = await res.json();
        if (mounted) {
          if (Array.isArray(data.data)) {
            setSubdomains(data.data);
          } else if (Array.isArray(data)) {
            setSubdomains(data);
          } else {
            setSubdomains([]);
          }
        }
      } catch (error) {
        console.error(error);
        if (mounted) {
          setToastMessage({
            type: "error",
            message: "Gagal memuat subdomain.",
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchSubdomains();
    
    return () => {
      mounted = false;
    };
  }, []);

  const filteredData = useMemo(() => {
    return (Array.isArray(subdomains) ? subdomains : []).filter((sub) => {
      const matchesSearch = sub.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
      const matchesFilter =
        statusFilter === "all" ||
        (statusFilter === "active" && sub.status === "active") ||
        (statusFilter === "pending" && sub.status === "pending") ||
        (statusFilter === "expired" && sub.status === "suspended");

      return matchesSearch && matchesFilter;
    });
  }, [subdomains, searchQuery, statusFilter]);

  const handleDelete = async () => {
    if (!deletingSubdomain) return;
    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/subdomains/${deletingSubdomain.id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.error?.message || "Failed to delete");
      }
      
      setToastMessage({
        type: "success",
        message: `Subdomain ${deletingSubdomain.name}.lapak.click berhasil dihapus.`,
      });
      
      setSubdomains(prev => prev.filter(s => s.id !== deletingSubdomain.id));
      setDeleteModalOpen(false);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Gagal menghapus subdomain.";
      setToastMessage({
        type: "error",
        message: msg,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (subdomain: Subdomain) => {
    setDeletingSubdomain(subdomain);
    setDeleteModalOpen(true);
  };

  const columns: TableColumn[] = [
    { key: "name", label: "Subdomain", sortable: true },
    { key: "status", label: "Status" },
    { key: "ssl", label: "SSL" },
    { key: "target", label: "Target" },
    { key: "created_at", label: "Dibuat" },
    { key: "actions", label: "Aksi" },
  ];

  return (
    <div className="space-y-6 relative">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg">Subdomain Saya</h1>
          <p className="text-sm text-fg-2">Kelola subdomain yang sudah di-claim</p>
        </div>
        <Button onClick={() => router.push("/dashboard/subdomain/claim")}>
          <Plus size={16} className="mr-2 inline" />
          Domain Baru
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted" />
          </div>
          <Input
            placeholder="Cari subdomain..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-1 w-full sm:w-auto">
          <Button
            variant={statusFilter === "all" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            Semua
          </Button>
          <Button
            variant={statusFilter === "active" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("active")}
          >
            Aktif
          </Button>
          <Button
            variant={statusFilter === "pending" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "expired" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("expired")}
          >
            Expired
          </Button>
        </div>
      </div>

      <Table<Record<string, unknown>>
        columns={columns}
        data={filteredData as unknown as Record<string, unknown>[]}
        loading={loading}
        emptyMessage={
          searchQuery
            ? "Tidak ada subdomain yang cocok dengan pencarian."
            : "Belum ada subdomain. Klaim sekarang!"
        }
        renderRow={(row: Record<string, unknown>) => {
          const sub = row as unknown as Subdomain;
          return (
            <tr key={sub.id} className="border-b border-border hover:bg-surface-2/50 transition-colors">
              <td className="px-4 py-3">
                <span className="font-mono text-sm text-fg font-medium">
                  {sub.name}.lapak.click
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    sub.status === "active"
                      ? "success"
                      : sub.status === "pending"
                      ? "warning"
                      : "error"
                  }
                >
                  {sub.status === "active" ? "Aktif" : sub.status === "pending" ? "Pending" : "Nonaktif"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-fg-2">
                <Badge variant={sub.status === 'active' ? 'success' : 'info'}>
                  {sub.status === 'active' ? 'Aktif' : 'N/A'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-fg-2">
                {sub.target || "Belum diset"}
              </td>
              <td className="px-4 py-3 text-sm text-muted">
                {new Date(sub.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/dashboard/dns?subdomain=${sub.id}`)}
                  >
                    DNS
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-negative hover:bg-negative/10 hover:text-negative"
                    onClick={() => confirmDelete(sub)}
                  >
                    Hapus
                  </Button>
                </div>
              </td>
            </tr>
          );
        }}
      />

      <Modal
        open={deleteModalOpen}
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        title="Hapus Subdomain"
      >
        <div className="space-y-4">
          <p className="text-sm text-fg-2">
            Apakah Anda yakin ingin menghapus subdomain <strong>{deletingSubdomain?.name}.lapak.click</strong>? 
            Tindakan ini tidak dapat dibatalkan. Semua DNS records yang terkait akan ikut terhapus.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              className="bg-negative text-white hover:bg-negative/90"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Ya, Hapus Subdomain
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
