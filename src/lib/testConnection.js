import { loginEmployee } from './supabase'

export async function testLogin() {
  try {
    const user = await loginEmployee('your_test_username', 'your_test_password')
    console.log('Login success:', user)
  } catch (err) {
    console.log('Login failed:', err.message)
  }
}