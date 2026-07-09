export class CloudflareClient {
  private apiToken: string;
  private zoneId: string;
  private baseUrl: string = "https://api.cloudflare.com/client/v4";

  constructor() {
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN || "";
    this.zoneId = process.env.CLOUDFLARE_ZONE_ID || "";
  }

  private async fetchApi(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Cloudflare API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Cloudflare API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async listDnsRecords() {
    const data = await this.fetchApi(`/zones/${this.zoneId}/dns_records`);
    return data.result;
  }

  async createDnsRecord(record: { type: string; name: string; content: string; ttl?: number; priority?: number }) {
    const data = await this.fetchApi(`/zones/${this.zoneId}/dns_records`, {
      method: "POST",
      body: JSON.stringify(record),
    });
    return data.result;
  }

  async updateDnsRecord(recordId: string, record: { type?: string; name?: string; content?: string; ttl?: number; priority?: number }) {
    const data = await this.fetchApi(`/zones/${this.zoneId}/dns_records/${recordId}`, {
      method: "PATCH",
      body: JSON.stringify(record),
    });
    return data.result;
  }

  async deleteDnsRecord(recordId: string) {
    await this.fetchApi(`/zones/${this.zoneId}/dns_records/${recordId}`, {
      method: "DELETE",
    });
    return true;
  }
}
