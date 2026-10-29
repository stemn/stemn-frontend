import { waitForBackend } from './fixtures/backend'

export default async function globalSetup() {
  await waitForBackend()
}
