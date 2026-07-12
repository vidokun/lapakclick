import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@lapak.click',
    password: 'password123',
    email_confirm: true
  })

  if (error) {
    console.error('Error creating user:', error)
  } else {
    console.log('User created successfully:', data.user.email)
  }
}

createAdmin()
