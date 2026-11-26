import { describe, expect, test } from "bun:test"
import { mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { openPath, openUrl } from "./open.js"

describe("openUrl", () => {
  test("rejects values that are not URLs", async () => {
    await expect(openUrl("not a url")).rejects.toThrow("Only http and https links")
    await expect(openUrl("")).rejects.toThrow("Only http and https links")
  })

  test("rejects non-http schemes", async () => {
    await expect(openUrl("file:///etc/hosts")).rejects.toThrow("Only http and https links")
    await expect(openUrl("javascript:alert(1)")).rejects.toThrow("Only http and https links")
    await expect(openUrl("ms-msdt:/id PCWDiagnostic")).rejects.toThrow("Only http and https links")
    await expect(openUrl("\\\\server\\share\\file.html")).rejects.toThrow("Only http and https links")
  })
})

describe("openPath", () => {
  test("rejects paths that do not exist", async () => {
    await expect(openPath(join(await mkdtemp(join(tmpdir(), "open-")), "missing"))).rejects.toThrow(
      "Directory does not exist",
    )
  })

  test("rejects paths that are not directories", async () => {
    const directory = await mkdtemp(join(tmpdir(), "open-"))
    const file = join(directory, "file.txt")
    await writeFile(file, "content")
    await expect(openPath(file)).rejects.toThrow("Not a directory")
  })
})
