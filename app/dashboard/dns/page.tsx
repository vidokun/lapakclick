"use client";

import { useEffect, useState } from "react";
import { Table, TableColumn } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Edit2, Trash2, ShieldCheck, Globe } from "lucide-react";

type Subdomain = {
  id: string;
  name: string;
  status: "active" | "pending" | "suspended";
};

type DnsRecord = {
  id: string;
  type: string;
  name: string;
  content: string;
  proxied: boolean;
  ttl: number;
  priority?: number;
};

export default function DnsManagementPage() {
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [selectedSubdomainId, setSelectedSubdomainId] = useState<string>("");
  
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentRecord, setCurrentRecord] = useState<Partial<DnsRecord>>({
    type: "A",
    name: "@",
    content: "",
    ttl: 1,
    proxied: false
  });
  
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchSubdomains();
  }, []);

  useEffect(() => {
    if (selectedSubdomainId) {
      fetchRecords(selectedSubdomainId);
    } else {
      setRecords([]);
    }
  }, [selectedSubdomainId]);

  const fetchSubdomains = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/subdomains");
      if (!res.ok) throw new Error("Gagal memuat subdomain");
      const data = await res.json();
      
      const activeSubdomains = data.data || [];
      setSubdomains(activeSubdomains);
      
      if (activeSubdomains.length > 0) {
        setSelectedSubdomainId(activeSubdomains[0].id);
      }
    } catch (err) {
      console.error(err);
      setToastMessage({ type: "error", message: "Gagal memuat subdomain" });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (subdomainId: string) => {
    try {
      setRecordsLoading(true);
      const res = await fetch("/api/dns/cloudflare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "list_records",
          subdomainId
        })
      });
      
      if (!res.ok) throw new Error("Gagal memuat catatan DNS");
      const data = await res.json();
      
      const formattedRecords: DnsRecord[] = (data.data || []).map((r: any) => ({
        id: r.id,
        type: r.type,
        name: r.name,
        content: r.content,
        proxied: r.proxied,
        ttl: r.ttl,
        priority: r.priority
      }));
      
      setRecords(formattedRecords);
    } catch (err) {
      console.error(err);
      setToastMessage({ type: "error", message: "Gagal memuat catatan DNS" });
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleCreateRecord = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selectedSubdomainId) return;
    
    try {
      setFormLoading(true);
      const res = await fetch("/api/dns/cloudflare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_record",
          subdomainId: selectedSubdomainId,
          type: currentRecord.type,
          name: "@", // Always force @ for A/CNAME targeting
          value: currentRecord.content,
          ttl: currentRecord.ttl,
          priority: currentRecord.priority
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Gagal mengarahkan subdomain");
      }
      
      setToastMessage({ type: "success", message: "Subdomain berhasil diarahkan" });
      setIsAddModalOpen(false);
      setCurrentRecord({ type: "A", name: "@", content: "", ttl: 1, proxied: false });
      fetchRecords(selectedSubdomainId);
    } catch (err: any) {
      setToastMessage({ type: "error", message: err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateRecord = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selectedSubdomainId || !currentRecord.id) return;
    
    try {
      setFormLoading(true);
      const res = await fetch("/api/dns/cloudflare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_record",
          subdomainId: selectedSubdomainId,
          recordId: currentRecord.id,
          type: currentRecord.type,
          name: currentRecord.type === "TXT" ? currentRecord.name : "@", // Allow names only for TXT
          value: currentRecord.content,
          ttl: currentRecord.ttl,
          priority: currentRecord.priority
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Gagal memperbarui tujuan");
      }
      
      setToastMessage({ type: "success", message: "Tujuan berhasil diperbarui" });
      setIsEditModalOpen(false);
      fetchRecords(selectedSubdomainId);
    } catch (err: any) {
      setToastMessage({ type: "error", message: err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!selectedSubdomainId || !currentRecord.id) return;
    
    try {
      setFormLoading(true);
      const res = await fetch("/api/dns/cloudflare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_record",
          subdomainId: selectedSubdomainId,
          recordId: currentRecord.id
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Gagal menghapus tujuan");
      }
      
      setToastMessage({ type: "success", message: "Arah tujuan berhasil dihapus" });
      setIsDeleteModalOpen(false);
      fetchRecords(selectedSubdomainId);
    } catch (err: any) {
      setToastMessage({ type: "error", message: err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (record: DnsRecord) => {
    // If it's the root domain A/CNAME record, hide the name field by ensuring it's @ 
    // (though our UI will handle hiding the name input for A/CNAME based on record type logic)
    setCurrentRecord({
      ...record,
      name: record.name.startsWith(subdomains.find(s => s.id === selectedSubdomainId)?.name || "") 
        ? "@" 
        : record.name
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (record: DnsRecord) => {
    setCurrentRecord(record);
    setIsDeleteModalOpen(true);
  };

  const columns: TableColumn[] = [
    {
      key: "type",
      label: "Tipe",
    },
    {
      key: "content",
      label: "Tujuan / Nilai",
    },
    {
      key: "name",
      label: "Keterangan",
    },
    {
      key: "actions",
      label: "Aksi",
    },
  ];

  const renderRow = (record: Record<string, unknown>) => {
    const r = record as DnsRecord;
    const isTargetRecord = r.type === "A" || r.type === "CNAME";
    const selectedSub = subdomains.find(s => s.id === selectedSubdomainId);
    const domainName = selectedSub ? `${selectedSub.name}.lapak.click` : "";

    return (
      <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-2/50 transition-colors">
        <td className="px-4 py-3 whitespace-nowrap">
          <Badge variant={
            r.type === 'CNAME' ? 'success' : 
            r.type === 'A' ? 'info' :
            r.type === 'TXT' ? 'warning' : 'info'
          }>
            {isTargetRecord ? `Target (${r.type})` : r.type}
          </Badge>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {r.type === "A" ? <Globe className="w-4 h-4 text-muted" /> : null}
            <span className="font-mono text-sm text-fg truncate max-w-[200px] block" title={r.content}>
              {r.content}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-muted">
             {isTargetRecord ? `Mengarahkan ${domainName} ke tujuan` : r.name}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-right">
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openEditModal(r)}
              aria-label="Edit record"
            >
              <Edit2 className="w-4 h-4 text-muted" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openDeleteModal(r)}
              aria-label="Hapus record"
            >
              <Trash2 className="w-4 h-4 text-negative" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  const selectedSub = subdomains.find(s => s.id === selectedSubdomainId);
  const domainName = selectedSub ? `${selectedSub.name}.lapak.click` : "";
  const hasTargetRecord = records.some(r => r.type === "A" || r.type === "CNAME");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg">Arahkan Subdomain</h1>
          <p className="text-muted mt-1">Atur tujuan subdomain Anda (IP Address atau Alias/CNAME).</p>
        </div>
      </div>

      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-surface rounded-4 border border-border">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      ) : subdomains.length === 0 ? (
        <EmptyState
          title="Tidak ada subdomain"
          description="Klaim subdomain terlebih dahulu untuk dapat mengarahkannya."
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-surface p-4 rounded-4 border border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label htmlFor="subdomain-select" className="text-sm font-medium text-fg-2 whitespace-nowrap">
              Pilih Subdomain:
            </label>
            <select
              id="subdomain-select"
              value={selectedSubdomainId}
              onChange={(e) => setSelectedSubdomainId(e.target.value)}
              className="block w-full sm:w-auto rounded-4 border border-border py-2 pl-3 pr-10 text-fg bg-surface focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm sm:leading-6"
            >
              {subdomains.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}.lapak.click</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h2 className="text-lg font-medium text-fg">Tujuan {domainName}</h2>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setCurrentRecord({ type: "TXT", name: "", content: "", ttl: 1, proxied: false });
                  setIsAddModalOpen(true);
                }}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Tambah TXT Record
              </Button>
              {!hasTargetRecord && (
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setCurrentRecord({ type: "A", name: "@", content: "", ttl: 1, proxied: false });
                    setIsAddModalOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Arahkan Subdomain
                </Button>
              )}
            </div>
          </div>

          <Table<Record<string, unknown>>
            columns={columns}
            data={records as unknown as Record<string, unknown>[]}
            loading={recordsLoading}
            emptyMessage={`Belum ada arah tujuan untuk ${domainName}. Klik "Arahkan Subdomain" untuk mengatur.`}
            renderRow={renderRow}
          />
        </div>
      )}

      {/* ADD MODAL */}
      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={currentRecord.type === "TXT" ? "Tambah TXT Record (Verifikasi)" : "Arahkan Subdomain"}
      >
        <form onSubmit={handleCreateRecord} className="space-y-4">
          <div className="bg-surface-2 p-3 rounded text-sm text-fg-2 mb-4 border border-border">
            {currentRecord.type === "TXT" 
              ? "Gunakan TXT record untuk verifikasi layanan (seperti Google Search Console)."
              : `Pilih tipe A untuk mengarahkan ke IP Address (VPS/Server), atau CNAME untuk mengarahkan ke layanan pihak ketiga (Vercel, Blogger, dsb).`}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Tipe Tujuan</label>
              <select
                value={currentRecord.type}
                onChange={(e) => setCurrentRecord({...currentRecord, type: e.target.value})}
                className="block w-full rounded-4 border border-border py-1.5 pl-3 pr-10 text-fg bg-surface focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm sm:leading-6"
                disabled={currentRecord.type === "TXT"} // Lock if opened specifically for TXT
              >
                {currentRecord.type === "TXT" ? (
                  <option value="TXT">TXT Record</option>
                ) : (
                  <>
                    <option value="A">IP Address (A Record)</option>
                    <option value="CNAME">Alias (CNAME)</option>
                  </>
                )}
              </select>
            </div>
            {currentRecord.type === "TXT" && (
              <div>
                <label className="block text-sm font-medium text-fg mb-1">Nama (Opsional)</label>
                <Input
                  value={currentRecord.name === "@" ? "" : currentRecord.name}
                  onChange={(e) => setCurrentRecord({...currentRecord, name: e.target.value})}
                  placeholder="Kosongkan untuk root domain"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              {currentRecord.type === "A" ? "IP Address Tujuan" : 
               currentRecord.type === "CNAME" ? "Domain Tujuan (Alias)" : "Nilai TXT"}
            </label>
            <Input
              value={currentRecord.content}
              onChange={(e) => setCurrentRecord({...currentRecord, content: e.target.value})}
              placeholder={
                currentRecord.type === "A" ? "contoh: 192.168.1.1" : 
                currentRecord.type === "CNAME" ? "contoh: cname.vercel-dns.com" : "contoh: google-site-verification=..."
              }
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={currentRecord.type === "TXT" ? "Edit TXT Record" : "Edit Tujuan Subdomain"}
      >
        <form onSubmit={handleUpdateRecord} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Tipe Tujuan</label>
              <select
                value={currentRecord.type}
                onChange={(e) => setCurrentRecord({...currentRecord, type: e.target.value})}
                className="block w-full rounded-4 border border-border py-1.5 pl-3 pr-10 text-fg bg-surface-2 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm sm:leading-6"
                disabled={currentRecord.type === "TXT"} // Can't change TXT to A/CNAME easily, force recreate
              >
                {currentRecord.type === "TXT" ? (
                  <option value="TXT">TXT Record</option>
                ) : (
                  <>
                    <option value="A">IP Address (A Record)</option>
                    <option value="CNAME">Alias (CNAME)</option>
                  </>
                )}
              </select>
            </div>
            {currentRecord.type === "TXT" && (
              <div>
                <label className="block text-sm font-medium text-fg mb-1">Nama</label>
                <Input
                  value={currentRecord.name === "@" ? "" : currentRecord.name}
                  onChange={(e) => setCurrentRecord({...currentRecord, name: e.target.value})}
                  placeholder="Kosongkan untuk root domain"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              {currentRecord.type === "A" ? "IP Address Tujuan" : 
               currentRecord.type === "CNAME" ? "Domain Tujuan (Alias)" : "Nilai TXT"}
            </label>
            <Input
              value={currentRecord.content}
              onChange={(e) => setCurrentRecord({...currentRecord, content: e.target.value})}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={currentRecord.type === "TXT" ? "Hapus TXT Record" : "Hapus Arah Tujuan"}
      >
        <div className="space-y-4">
          <p className="text-fg-2 text-sm">
            Yakin ingin menghapus {currentRecord.type === "TXT" ? "TXT record ini" : "arah tujuan ini"}?
            {currentRecord.type !== "TXT" && " Subdomain Anda tidak akan bisa diakses sampai Anda mengatur tujuan baru."}
          </p>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button type="button" variant="danger" loading={formLoading} onClick={handleDeleteRecord}>
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
