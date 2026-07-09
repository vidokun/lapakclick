import { SupabaseClient } from '@supabase/supabase-js';

export async function getUserSubdomains(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('subdomains')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getDnsRecords(supabase: SupabaseClient, subdomainId: string) {
  const { data, error } = await supabase
    .from('dns_records')
    .select('*')
    .eq('subdomain_id', subdomainId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function logActivity(
  supabase: SupabaseClient,
  userId: string,
  action: string,
  details: Record<string, any> = {}
) {
  const { error } = await supabase
    .from('activity_logs')
    .insert({
      user_id: userId,
      action,
      details,
    });

  if (error) {
    console.error('Error logging activity:', error);
  }
}

export async function checkSubdomainLimit(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('subdomains')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  
  return (count || 0) < 3;
}

export async function getUserStats(supabase: SupabaseClient, userId: string) {
  const { data: subdomains, error: subError } = await supabase
    .from('subdomains')
    .select('id, status')
    .eq('user_id', userId);

  if (subError) throw subError;

  const totalSubdomains = subdomains?.length || 0;
  const activeSubdomains = subdomains?.filter(s => s.status === 'active').length || 0;

  let totalDnsRecords = 0;
  
  if (totalSubdomains > 0) {
    const subdomainIds = subdomains.map(s => s.id);
    const { count, error: dnsError } = await supabase
      .from('dns_records')
      .select('*', { count: 'exact', head: true })
      .in('subdomain_id', subdomainIds);
      
    if (dnsError) throw dnsError;
    totalDnsRecords = count || 0;
  }

  return {
    totalSubdomains,
    activeSubdomains,
    totalDnsRecords,
    limit: 3
  };
}
