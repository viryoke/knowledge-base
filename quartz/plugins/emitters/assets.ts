import { FilePath, joinSegments, slugifyFilePath } from "../../util/path"
import { QuartzEmitterPlugin, QuartzPageTypePluginInstance } from "../types"
import path from "path"
import fs from "fs"
import { glob } from "../../util/glob"
import { Argv, BuildCtx } from "../../util/ctx"
import { QuartzConfig } from "../../cfg"

function getPageTypeExtensions(ctx: BuildCtx): Set<string> {
  const extensions = new Set<string>()
  const pageTypes = (ctx.cfg.plugins.pageTypes ?? []) as unknown as QuartzPageTypePluginInstance[]
  for (const pt of pageTypes) {
    if (pt.fileExtensions) {
      for (const ext of pt.fileExtensions) {
        extensions.add(ext)
      }
    }
  }
  return extensions
}

const filesToCopy = async (argv: Argv, cfg: QuartzConfig, excludeExtensions: Set<string>) => {
  const excludePatterns = ["**/*.md", ...cfg.configuration.ignorePatterns]
  for (const ext of excludeExtensions) {
    excludePatterns.push(`**/*${ext}`)
  }
  return await glob("**", argv.directory, excludePatterns)
}

const copyFile = async (argv: Argv, fp: FilePath) => {
  const src = joinSegments(argv.directory, fp) as FilePath

  // 保留演示文稿类文件的扩展名（HTML、PDF 等）
  const ext = path.extname(fp).toLowerCase()
  const preserveExtensions = ['.html', '.htm', '.pdf', '.pptx', '.ppt', '.key']
  
  let name: string
  if (preserveExtensions.includes(ext)) {
    // 保留扩展名：slugify 后加回扩展名（但避免重复添加）
    const slugified = slugifyFilePath(fp)
    if (slugified.toLowerCase().endsWith(ext)) {
      name = slugified as FilePath
    } else {
      name = (slugified + ext) as FilePath
    }
  } else {
    // 其他资源文件：保持原有行为
    name = slugifyFilePath(fp)
  }
  
  const dest = joinSegments(argv.output, name) as FilePath

  const dir = path.dirname(dest) as FilePath
  await fs.promises.mkdir(dir, { recursive: true })

  await fs.promises.copyFile(src, dest)
  return dest
}

export const Assets: QuartzEmitterPlugin = () => {
  return {
    name: "Assets",
    async *emit(ctx) {
      const excludeExtensions = getPageTypeExtensions(ctx)
      const fps = await filesToCopy(ctx.argv, ctx.cfg, excludeExtensions)
      for (const fp of fps) {
        yield copyFile(ctx.argv, fp)
      }
    },
    async *partialEmit(ctx, _content, _resources, changeEvents) {
      const excludeExtensions = getPageTypeExtensions(ctx)
      for (const changeEvent of changeEvents) {
        const ext = path.extname(changeEvent.path)
        if (ext === ".md" || excludeExtensions.has(ext)) continue

        if (changeEvent.type === "add" || changeEvent.type === "change") {
          yield copyFile(ctx.argv, changeEvent.path)
        } else if (changeEvent.type === "delete") {
          const name = slugifyFilePath(changeEvent.path)
          const dest = joinSegments(ctx.argv.output, name) as FilePath
          await fs.promises.unlink(dest)
        }
      }
    },
  }
}
