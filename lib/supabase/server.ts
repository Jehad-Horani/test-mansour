import { createClient as createAuthServerClient } from "./auth-server"

export function createClient() {
  return createAuthServerClient()
}
