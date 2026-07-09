"use client";

import { useEffect, useState, useRef } from "react";
import { Table, TableColumn } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Edit2, Trash2 } from "lucide-react";

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
    name: "",
    content: "",
    ttl: 1,
    proxied: false
  });
  
  const [formLoading, setFormLoading] = useState(false);
  const fetchedSubdomains = useRef(false);

  useEffect(() => {
    if (fetchedSubdomains.current) return;
    fetchedSubdomains.current = true;
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
      
      const activeSubdomains = data.subdomains || [];
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
      
      const formattedRecords: DnsRecord[] = (data.result || []).map((r: any) => ({
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
          name: currentRecord.name,
          value: currentRecord.content,
          ttl: currentRecord.ttl,
          priority: currentRecord.priority
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Gagal membuat record");
      }
      
      setToastMessage({ type: "success", message: "Catatan DNS berhasil ditambahkan" });
      setIsAddModalOpen(false);
      setCurrentRecord({ type: "A", name: "", content: "", ttl: 1, proxied: false });
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
          name: currentRecord.name,
          value: currentRecord.content,
          ttl: currentRecord.ttl,
          priority: currentRecord.priority
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Gagal memperbarui record");
      }
      
      setToastMessage({ type: "success", message: "Catatan DNS berhasil diperbarui" });
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
        throw new Error(errorData.error?.message || "Gagal menghapus record");
      }
      
      setToastMessage({ type: "success", message: "Catatan DNS berhasil dihapus" });
      setIsDeleteModalOpen(false);
      fetchRecords(selectedSubdomainId);
    } catch (err: any) {
      setToastMessage({ type: "error", message: err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (record: DnsRecord) => {
    setCurrentRecord(record);
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
      key: "name",
      label: "Nama",
    },
    {
      key: "content",
      label: "Nilai",
    },
    {
      key: "ttl",
      label: "TTL",
    },
    {
      key: "actions",
      label: "Aksi",
    },
  ];

  const renderRow = (record: Record<string, any>) => {
    return (
      <tr key={record.id} className="border-b border-border last:border-0 hover:bg-surface-2/50 transition-colors">
        <td className="px-4 py-3 whitespace-nowrap">
          <Badge variant={
            record.type === 'CNAME' ? 'success' : 
            record.type === 'TXT' ? 'warning' : 'info'
          }>
            {record.type}
          </Badge>
        </td>
        <td className="px-4 py-3">
          <span className="font-mono text-sm text-fg">{record.name}</span>
        </td>
        <td className="px-4 py-3">
          <span className="font-mono text-sm text-fg truncate max-w-[200px] block" title={record.content}>
            {record.content}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className="text-sm text-muted">{record.ttl === 1 ? 'Otomatis' : `${record.ttl}s`}</span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-right">
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openEditModal(record as DnsRecord)}
              aria-label="Edit record"
            >
              <Edit2 className="w-4 h-4 text-muted" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openDeleteModal(record as DnsRecord)}
              aria-label="Hapus record"
            >
              <Trash2 className="w-4 h-4 text-negative" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg">Manajemen DNS</h1>
          <p className="text-muted mt-1">Kelola catatan DNS untuk subdomain Anda.</p>
        </div>
        
        {subdomains.length > 0 && (
          <Button 
            variant="primary" 
            onClick={() => {
              setCurrentRecord({ type: "A", name: "", content: "", ttl: 1, proxied: false });
              setIsAddModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Record
          </Button>
        )}
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
          description="Klaim subdomain terlebih dahulu untuk mengelola DNS."
        />
      ) : (
        <div className="space-y-4">
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

          <Table
            columns={columns}
            data={records}
            loading={recordsLoading}
            emptyMessage="Belum ada catatan DNS untuk subdomain ini."
            renderRow={renderRow}
          />
        </div>
      )}

      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah DNS Record"
      >
        <form onSubmit={handleCreateRecord} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Tipe</label>
              <select
                value={currentRecord.type}
                onChange={(e) => setCurrentRecord({...currentRecord, type: e.target.value})}
                className="block w-full rounded-4 border border-border py-1.5 pl-3 pr-10 text-fg bg-surface focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm sm:leading-6"
              >
                <option value="A">A</option>
                <option value="AAAA">AAAA</option>
                <option value="CNAME">CNAME</option>
                <option value="TXT">TXT</option>
                <option value="MX">MX</option>
                <option value="NS">NS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Nama</label>
              <Input
                value={currentRecord.name}
                onChange={(e) => setCurrentRecord({...currentRecord, name: e.target.value})}
                placeholder="@ atau subdomain"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Konten / Nilai</label>
            <Input
              value={currentRecord.content}
              onChange={(e) => setCurrentRecord({...currentRecord, content: e.target.value})}
              placeholder="contoh: 192.0.2.1"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">TTL</label>
              <select
                value={currentRecord.ttl}
                onChange={(e) => setCurrentRecord({...currentRecord, ttl: parseInt(e.target.value)})}
                className="block w-full rounded-4 border border-border py-1.5 pl-3 pr-10 text-fg bg-surface focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm sm:leading-6"
              >
                <option value={1}>Otomatis</option>
                <option value={120}>2 mnt</option>
                <option value={300}>5 mnt</option>
                <option value={600}>10 mnt</option>
                <option value={1800}>30 mnt</option>
                <option value={3600}>1 jam</option>
              </select>
            </div>
            
            {currentRecord.type === 'MX' && (
              <div>
                <label className="block text-sm font-medium text-fg mb-1">Prioritas</label>
                <Input
                  type="number"
                  value={currentRecord.priority || 10}
                  onChange={(e) => setCurrentRecord({...currentRecord, priority: parseInt(e.target.value)})}
                  min={0}
                  max={65535}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              Tambah
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit DNS Record"
      >
        <form onSubmit={handleUpdateRecord} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Tipe</label>
              <select
                value={currentRecord.type}
                onChange={(e) => setCurrentRecord({...currentRecord, type: e.target.value})}
                className="block w-full rounded-4 border border-border py-1.5 pl-3 pr-10 text-fg bg-surface-2 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm sm:leading-6"
              >
                <option value="A">A</option>
                <option value="AAAA">AAAA</option>
                <option value="CNAME">CNAME</option>
                <option value="TXT">TXT</option>
                <option value="MX">MX</option>
                <option value="NS">NS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Nama</label>
              <Input
                value={currentRecord.name}
                onChange={(e) => setCurrentRecord({...currentRecord, name: e.target.value})}
                placeholder="@ atau subdomain"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Konten / Nilai</label>
            <Input
              value={currentRecord.content}
              onChange={(e) => setCurrentRecord({...currentRecord, content: e.target.value})}
              placeholder="contoh: 192.0.2.1"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">TTL</label>
              <select
                value={currentRecord.ttl}
                onChange={(e) => setCurrentRecord({...currentRecord, ttl: parseInt(e.target.value)})}
                className="block w-full rounded-4 border border-border py-1.5 pl-3 pr-10 text-fg bg-surface focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-sm sm:leading-6"
              >
                <option value={1}>Otomatis</option>
                <option value={120}>2 mnt</option>
                <option value={300}>5 mnt</option>
                <option value={600}>10 mnt</option>
                <option value={1800}>30 mnt</option>
                <option value={3600}>1 jam</option>
              </select>
            </div>
            
            {currentRecord.type === 'MX' && (
              <div>
                <label className="block text-sm font-medium text-fg mb-1">Prioritas</label>
                <Input
                  type="number"
                  value={currentRecord.priority || 10}
                  onChange={(e) => setCurrentRecord({...currentRecord, priority: parseInt(e.target.value)})}
                  min={0}
                  max={65535}
                />
              </div>
            )}
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

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus DNS Record"
      >
        <div className="space-y-4">
          <p className="text-fg-2 text-sm">
            Yakin ingin menghapus record <strong className="text-fg">{currentRecord.type}</strong> untuk <strong className="text-fg">{currentRecord.name}</strong>?
            Tindakan ini tidak dapat dibatalkan dan dapat memengaruhi fungsi subdomain Anda.
          </p>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Batal
            </Button>
            <Button type="button" variant="danger" loading={formLoading} onClick={handleDeleteRecord}>
              Hapus Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
