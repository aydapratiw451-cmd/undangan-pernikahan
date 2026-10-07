import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://hvfhpjusvjuozottxkqx.supabase.co'
const supabaseKey = 'sb_publishable_Qrh-g-CGoJ0VoNvQBTqKCw_e8v3NJ4k'

export const supabase = createClient(
    supabaseUrl,
    supabaseKey
)