CREATE TABLE IF NOT EXISTS rate_counters (
  bucket_key text PRIMARY KEY,
  count integer NOT NULL DEFAULT 0,
  reset_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS used_tickets (
  ticket_id text PRIMARY KEY,
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS used_tickets_expires_at_idx
  ON used_tickets (expires_at);
