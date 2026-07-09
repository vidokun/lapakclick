import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/helpers";
import { Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

async function getStats() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: subdomains } = await supabase
    .from('subdomains')
    .select('id, status, name')
    .eq('user_id', user.id);

  const totalSubdomains = subdomains?.length || 0;
  const activeSubdomains = subdomains?.filter(s => s.status === 'active').length || 0;

  return {
    totalSubdomains,
    activeSubdomains,
    remainingClaims: 3 - totalSubdomains,
    subdomains: subdomains || []
  };
}

async function getActivity() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return data || [];
}

export default async function OverviewPage() {
  const [stats, activity] = await Promise.all([
    getStats(),
    getActivity()
  ]);

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Subdomain" 
          value={stats.totalSubdomains} 
        />
        <StatCard 
          label="Aktif" 
          value={stats.activeSubdomains} 
          trend={stats.totalSubdomains > 0 ? { value: 100, positive: true } : undefined}
        />
        <div className="relative group">
          <StatCard 
            label="Pengunjung (30 hari)" 
            value="—" 
            className="opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs bg-surface-2 border border-border px-2 py-1 rounded">Segera hadir</span>
          </div>
        </div>
        <StatCard 
          label="Sisa Klaim" 
          value={`${stats.remainingClaims} dari 3`} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg">Aktivitas Terbaru</h2>
            <Link href="#" className="text-accent hover:text-accent-gl text-sm">Lihat Semua</Link>
          </div>

          {activity.length > 0 ? (
            <div className="flex flex-col gap-2">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-4 bg-surface border border-border rounded-lg">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-accent/10 text-accent">
                    <Activity size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.action}</div>
                    {item.details?.target && (
                      <div className="text-xs text-muted mt-0.5">Target: {item.details.target}</div>
                    )}
                  </div>
                  <div className="text-xs text-muted whitespace-nowrap">
                    {formatRelativeTime(item.created_at)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface border border-border rounded-lg">
              <p className="text-sm text-muted">Belum ada aktivitas.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg">Subdomain</h2>
            <Link href="/dashboard/subdomain" className="text-accent hover:text-accent-gl text-sm">Kelola</Link>
          </div>

          {stats.subdomains.length > 0 ? (
            <div className="flex flex-col gap-2">
              {stats.subdomains.slice(0, 5).map((sub) => (
                <div key={sub.id} className="flex flex-col gap-2 p-4 bg-surface border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-medium">{sub.name}.lapak.click</span>
                    <Badge variant={sub.status === 'active' ? 'success' : sub.status === 'pending' ? 'warning' : 'error'}>
                      {sub.status === 'active' ? 'Aktif' : sub.status === 'pending' ? 'Pending' : 'Nonaktif'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface border border-border rounded-lg flex flex-col items-center justify-center gap-4">
              <p className="text-sm text-muted max-w-[200px]">Belum ada subdomain. Klaim sekarang!</p>
              <Link href="/dashboard/subdomain/claim" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-accent text-bg hover:bg-accent-gl h-9 px-4 py-2">
                Klaim Subdomain
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
