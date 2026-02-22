import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kdlrgjypobqzdmturgay.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkbHJnanlwb2JxemRtdHVyZ2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NDc5MDcsImV4cCI6MjA4NzMyMzkwN30.wIM3pHif3LLlb_Atu3xBOl8mV-1jJmyepcRLxe8lnpE";

export const supabase = createClient(supabaseUrl, supabaseKey);