-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create cron job to run setoran merge daily at 9:00 PM
SELECT cron.schedule(
  'daily-setoran-merge',
  '0 21 * * *', -- 9:00 PM every day
  $$
  SELECT
    net.http_post(
        url:='https://uszycbjecrbinezzecda.supabase.co/functions/v1/merge-daily-setoran',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzenljYmplY3JiaW5lenplY2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDMzNjUsImV4cCI6MjA2MjM3OTM2NX0.RlUVPTEuuu6oDQJYGLi0KH4Sci2iJTqNGB6TxFec1tg"}'::jsonb,
        body:='{"trigger": "cron"}'::jsonb
    ) as request_id;
  $$
);