import 'dotenv/config'

export default {
  expo: {
    name: 'StockApp',
    slug: 'stock-app',
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
}