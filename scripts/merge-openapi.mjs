/**
 * 拉取网关各微服务 OpenAPI 并合并为一份，供 openapi2ts 单次生成（避免多次生成清空 src/api）。
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outPath = join(root, 'openapi', 'merged.json')

const SOURCES = [
  'http://localhost:8100/hl-oj-user/v3/api-docs',
  'http://localhost:8100/hl-oj-question/v3/api-docs',
]

function mergeSchemas(target, source, label) {
  for (const [name, schema] of Object.entries(source)) {
    if (target[name] && JSON.stringify(target[name]) !== JSON.stringify(schema)) {
      throw new Error(`schema 冲突: ${name} (${label})`)
    }
    target[name] = schema
  }
}

async function fetchSpec(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`拉取失败 ${url}: ${res.status}`)
  return res.json()
}

const merged = {
  openapi: '3.1.0',
  info: { title: 'HL OJ Gateway', version: 'merged' },
  paths: {},
  components: { schemas: {} },
}

for (const url of SOURCES) {
  const spec = await fetchSpec(url)
  Object.assign(merged.paths, spec.paths ?? {})
  mergeSchemas(
    merged.components.schemas,
    spec.components?.schemas ?? {},
    url,
  )
}

await mkdir(dirname(outPath), { recursive: true })
await writeFile(outPath, JSON.stringify(merged, null, 2), 'utf8')
console.log(`[merge-openapi] 已写入 ${outPath}，paths: ${Object.keys(merged.paths).length}`)
