import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
import Constants from 'expo-constants'

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function loginEmployee(username, password) {
  const { data, error } = await supabase.rpc('login_employee', {
    p_username: username,
    p_password: password,
  })

  if (error) throw error

  if (!data || data.length === 0) {
    throw new Error('Invalid username or password')
  }

  return data[0]  // { id, name, username, role_id, role_name, phone, status }
}