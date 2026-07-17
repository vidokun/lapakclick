"use client";

import { useEffect, useState, useCallback } from "react";
import { ShieldCheck, Ban, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/helpers";

interface BlacklistItem {
  id: string;
  pattern: string;
  created_at: string;
}

const columns: TableColumn[] = [
  { key: "no", label: "No" },
  { key: "pattern", label: "Domain" },
  { key: "created_at", label: "Tanggal" },
  { key: "aksi", label: "Aksi" },
];

export default function AdminPage() {
  const [data, setData] = useState<BlacklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPattern, setNewPattern] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchBlacklist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blacklist");
      if (!res.ok) throw new Error("Gagal memuat data blacklist");
      const json = await res.json();
      setData(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlacklist();
  }, [fetchBlacklist]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const pattern = newPattern.trim().toLowerCase();
    if (!pattern) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        alert(json?.error ?? "Gagal menambahkan blacklist");
        return;
      }
      setNewPattern("");
      await fetchBlacklist();
    } catch {
      alert("Terjadi kesalahan saat menambahkan blacklist");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (pattern: string) => {
    if (!confirm(`Hapus "${pattern}" dari blacklist?`)) return;

    setDeleting(pattern);
    try {
      const res = await fetch("/api/admin/blacklist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        alert(json?.error ?? "Gagal menghapus blacklist");
        return;
      }
      await fetchBlacklist();
    } catch {
      alert("Terjadi kesalahan saat menghapus blacklist");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Tambah ke Blacklist" subtitle="Masukkan domain atau kata kunci yang ingin diblokir">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-start sm:items-end gap-3 mt-2">
          <div className="w-full sm:flex-1">
            <Input
              placeholder="contoh: domain-spam.com"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              disabled={submitting}
            />
          </div>
          <Button type="submit" variant="primary" loading={submitting} disabled={!newPattern.trim()}>
            <Ban size={16} />
            Tambah
          </Button>
        </form>
      </Card>

      <Card title="Daftar Blacklist">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" className="text-accent" />
          </div>
        ) : error ? (
          <EmptyState
            icon={<ShieldCheck size={40} />}
            title="Gagal memuat data"
            description={error}
            action={
              <Button variant="secondary" onClick={fetchBlacklist}>
                Coba Lagi
              </Button>
            }
          />
        ) : (
          <Table
            columns={columns}
            data={data as unknown as Record<string, unknown>[]}
            emptyMessage="Belum ada domain yang di-blacklist"
            renderRow={(row, index) => {
              const item = row as unknown as BlacklistItem;
              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-surface-2"
                >
                  <td className="px-4 py-3 text-sm text-fg-2 border-b border-border">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-fg font-mono border-b border-border">
                    {item.pattern}
                  </td>
                  <td className="px-4 py-3 text-sm text-fg-2 border-b border-border whitespace-nowrap">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      loading={deleting === item.pattern}
                      onClick={() => handleDelete(item.pattern)}
                      className="text-negative hover:text-negative hover:bg-negative/10"
                    >
                      <Trash2 size={14} />
                      Hapus
                    </Button>
                  </td>
                </tr>
              );
            }}
          />
        )}
      </Card>
    </div>
  );
}
