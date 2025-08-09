// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Replace with your own keys
const supabaseUrl = 'https://godiycdktrsjlbcbyanl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZGl5Y2RrdHJzamxiY2J5YW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjY4MzEsImV4cCI6MjA3MDM0MjgzMX0.xt8Jc1J_-z63lza6xPQefYkupD3Cet_uT3Z-fUuoYqc'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)