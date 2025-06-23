
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yvxfioewwfufcaonzhwy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eGZpb2V3d2Z1ZmNhb256aHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTM2OTIsImV4cCI6MjA2NjI2OTY5Mn0.VlDhdjprcj5uC7uE5HuW17nT2x-dgkx0Co9lpGDIaAc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
