import { createBrowserClient } from '@supabase/ssr'
import { isRecoverableSessionError } from '@/lib/supabase/auth'

let browserClient: ReturnType<typeof createBrowserClient> | undefined
let recoveryChecked = false

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  if (!recoveryChecked && typeof window !== 'undefined') {
    recoveryChecked = true

    void browserClient.auth.getSession().catch(async (error: unknown) => {
      if (isRecoverableSessionError(error)) {
        await browserClient?.auth.signOut({ scope: 'local' })
      } else {
        throw error
      }
    })
  }

  return browserClient
}
