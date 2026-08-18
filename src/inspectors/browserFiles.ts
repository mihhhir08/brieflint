import type { Artifact } from "../types.ts";

const TEXT_EXTENSIONS = new Set([
  "c", "cpp", "css", "csv", "go", "html", "java", "js", "json", "jsx", "log", "md", "py", "rb", "rs", "sh", "sql", "svg", "toml", "ts", "tsx", "txt", "xml", "yaml", "yml",
]);
const MAX_TEXT_BYTES = 2 * 1024 * 1024;

function fileExtension(name: string): string {
  return name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
}

export async function inspectFiles(files: File[]): Promise<Artifact[]> {
  return Promise.all(files.map(async (file, index): Promise<Artifact> => {
    const artifact: Artifact = {
      id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
    };

    if (!TEXT_EXTENSIONS.has(fileExtension(file.name)) && !file.type.startsWith("text/")) return artifact;
    if (file.size > MAX_TEXT_BYTES) {
      artifact.readError = "Text extraction is limited to 2 MB per file.";
      return artifact;
    }

    try {
      artifact.text = await file.text();
    } catch {
      artifact.readError = "The browser could not read this file as text.";
    }
    return artifact;
  }));
}
