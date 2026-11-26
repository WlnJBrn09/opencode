import { stat } from "node:fs/promises"
import open from "open"

export function openUrl(input: string) {
  const url = URL.canParse(input) ? new URL(input) : undefined
  if (!url || (url.protocol !== "http:" && url.protocol !== "https:"))
    return Promise.reject(new Error(`Only http and https links can be opened in the browser: ${input}`))
  return open(url.href)
}

// Reveal-only: opens the directory in the system file manager (xdg-open on
// Linux). This never returns a selection — closing the file manager does not
// pick a folder. Callers that need a chosen path must use an explicit
// directory picker instead.
export async function openPath(path: string) {
  let info
  try {
    info = await stat(path)
  } catch {
    return Promise.reject(new Error(`Directory does not exist: ${path}`))
  }
  if (!info.isDirectory()) return Promise.reject(new Error(`Not a directory: ${path}`))
  return open(path)
}
