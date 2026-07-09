ALTER TABLE subdomains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subdomains"
    ON subdomains FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subdomains"
    ON subdomains FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subdomains"
    ON subdomains FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subdomains"
    ON subdomains FOR DELETE
    USING (auth.uid() = user_id);

ALTER TABLE dns_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dns records"
    ON dns_records FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM subdomains 
            WHERE subdomains.id = dns_records.subdomain_id 
            AND subdomains.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own dns records"
    ON dns_records FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM subdomains 
            WHERE subdomains.id = subdomain_id 
            AND subdomains.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own dns records"
    ON dns_records FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM subdomains 
            WHERE subdomains.id = dns_records.subdomain_id 
            AND subdomains.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM subdomains 
            WHERE subdomains.id = subdomain_id 
            AND subdomains.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own dns records"
    ON dns_records FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM subdomains 
            WHERE subdomains.id = dns_records.subdomain_id 
            AND subdomains.user_id = auth.uid()
        )
    );

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity logs"
    ON activity_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert activity logs"
    ON activity_logs FOR INSERT
    WITH CHECK (true);
