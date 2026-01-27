import fs from "fs"
import path from "path"
import type { KBItem } from "./types"

export function getKB(): KBItem[] {
  const dataDir = path.join(process.cwd(), "data")
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"))

  let allItems: KBItem[] = []

  files.forEach((file, i) => {
    const filePath = path.join(dataDir, file)
    const raw = fs.readFileSync(filePath, "utf-8")
    const parsed = JSON.parse(raw) as KBItem[]

    parsed.forEach((d, idx) => {
      allItems.push({
        id: d.id ?? `${file}-${idx + 1}`,
        title: d.title,
        audience: d.audience,
        content: d.content,
        tags: d.tags ?? [],
      })
    })
  })

  return allItems
}
