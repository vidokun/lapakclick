import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@lapak.click',
    password: 'password123',
  })

  if (error) {
    console.error('Login Failed:', error.message)
  } else {
    console.log('Login Success! User ID:', data.user.id)
  }
}

testLogin()
