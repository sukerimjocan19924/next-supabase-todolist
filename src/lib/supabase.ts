import { createBrowserClient } from '@supabase/ssr'

export type Todo = {
  id: string
  title: string
  is_complete: boolean
  created_at: string
}

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
