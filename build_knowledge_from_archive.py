#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_knowledge_from_archive.py
--------------------------------
Gera arquivos Markdown (CODEMAP.md, COMPONENTS_OVERVIEW.md, API_REFERENCE.md)
a partir de um projeto compactado (.rar ou .zip) para subir no Knowledge do Sub-GPT.

Uso:
  python build_knowledge_from_archive.py --archive "C:\caminho\projeto.zip"
  python build_knowledge_from_archive.py --archive "C:\caminho\projeto.rar" --max-lines 600
"""
import os
import re
import argparse
import shutil
import tempfile
from pathlib import Path
from datetime import datetime

SKIP_DIRS = {
    ".git", "node_modules", "dist", "build", ".next", ".cache", ".venv", "venv",
    ".pytest_cache", "coverage", "out"
}
TEXT_EXTS = {".md", ".txt", ".json", ".yml", ".yaml", ".toml", ".env", ".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".sass", ".mjs", ".cjs"}

def extract_archive(archive_path: Path, workdir: Path) -> Path:
    dest = workdir / "extracted"
    dest.mkdir(parents=True, exist_ok=True)
    lower = archive_path.suffix.lower()
    if lower == ".zip":
        import zipfile
        with zipfile.ZipFile(archive_path, 'r') as zf:
            zf.extractall(dest)
        return dest
    if lower == ".rar":
        try:
            import rarfile  # type: ignore
        except Exception as e:
            raise RuntimeError("Para .rar, instale 'rarfile' (pip install rarfile) e o utilitário 'unrar' no sistema.") from e
        with rarfile.RarFile(archive_path) as rf:  # type: ignore
            rf.extractall(dest)
        return dest
    raise ValueError(f"Formato de arquivo não suportado: {archive_path}")

def walk_repo(root: Path, max_depth: int = 8):
    for dirpath, dirnames, filenames in os.walk(root):
        rel = Path(dirpath).relative_to(root)
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        if len(rel.parts) > max_depth:
            dirnames[:] = []
            continue
        for fn in filenames:
            yield Path(dirpath) / fn

def summarize_file(path: Path, max_lines: int = 400) -> str:
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""
    if path.suffix.lower() in {".ts", ".tsx", ".js", ".jsx"}:
        region = "\n".join(text.splitlines()[:max_lines])
        out = []
        for rx in [r"export\s+default\s+function\s+([A-Z]\w*)",
                   r"export\s+function\s+([A-Z]\w*)",
                   r"const\s+([A-Z]\w*)\s*=\s*\("]:
            out += [f"- Componente: `{m.group(1)}`" for m in re.finditer(rx, region)]
        out += [f"- Interface: `{m.group(1)}`" for m in re.finditer(r"export\s+interface\s+(\w+)", region)]
        out += [f"- Type: `{m.group(1)}`" for m in re.finditer(r"export\s+type\s+(\w+)", region)]
        out += [f"- GROQ Query: `{m.group(1)}`" for m in re.finditer(r"export\s+const\s+(\w+)\s*=\s*groq`", text)]
        return "\n".join(sorted(set(out)))
    if path.suffix.lower() in {".ts", ".js"} and ("schema" in [p.lower() for p in path.parts]):
        names = re.findall(r"name\s*:\s*['\"]([\w-]+)['\"]", text)
        fields = re.findall(r"defineField\(\s*{\s*name\s*:\s*['\"]([\w-]+)['\"]", text)
        out = []
        if names:
            out.append(f"- Schema(s): {', '.join(sorted(set(names)))}")
        if fields:
            out.append(f"- Fields: {', '.join(sorted(set(fields)))}")
        return "\n".join(out)
    return ""

def generate_codemap(root: Path, outdir: Path):
    out = outdir / "CODEMAP.md"
    with out.open("w", encoding="utf-8") as f:
        f.write("# CODEMAP\n\n")
        f.write(f"_Gerado em {datetime.now().isoformat()}_\n\n")
        for fp in walk_repo(root):
            rel = fp.relative_to(root)
            if any(p in SKIP_DIRS for p in rel.parts):
                continue
            if len(rel.parts) > 10:
                continue
            try:
                size_bytes = fp.stat().st_size
            except Exception:
                size_bytes = 0
            try:
                line_count = sum(1 for _ in fp.open("r", encoding="utf-8", errors="ignore"))
            except Exception:
                line_count = 0
            f.write(f"- `{rel.as_posix()}` — {line_count} linhas, {size_bytes} bytes\n")
    return out

def generate_components_overview(root: Path, outdir: Path, max_lines:int=400):
    out = outdir / "COMPONENTS_OVERVIEW.md"
    with out.open("w", encoding="utf-8") as f:
        f.write("# COMPONENTS_OVERVIEW\n\n")
        f.write("Resumo de componentes React, interfaces/tipos e queries GROQ detectadas.\n\n")
        for fp in walk_repo(root):
            if fp.suffix.lower() not in {".ts", ".tsx", ".js", ".jsx"}:
                continue
            rel = fp.relative_to(root).as_posix()
            summary = summarize_file(fp, max_lines=max_lines)
            if summary.strip():
                f.write(f"## `{rel}`\n{summary}\n\n")
    return out

def generate_api_reference(root: Path, outdir: Path, max_lines:int=400):
    out = outdir / "API_REFERENCE.md"
    with out.open("w", encoding="utf-8") as f:
        f.write("# API_REFERENCE\n\n")
        f.write("Sanity Schemas detectados, queries GROQ e tipos exportados relevantes.\n\n")
        f.write("## Sanity Schemas\n\n")
        for fp in walk_repo(root):
            if fp.suffix.lower() not in {".ts", ".js"}:
                continue
            if "sanity" in fp.parts and "schema" in fp.parts:
                rel = fp.relative_to(root).as_posix()
                summary = summarize_file(fp, max_lines=max_lines)
                if summary.strip():
                    f.write(f"### `{rel}`\n{summary}\n\n")
        f.write("## GROQ Queries\n\n")
        for fp in walk_repo(root):
            if fp.name.endswith("queries.ts"):
                rel = fp.relative_to(root).as_posix()
                text = fp.read_text(encoding="utf-8", errors="ignore")
                f.write(f"### `{rel}`\n")
                for m in re.finditer(r"export\s+const\s+(\w+)\s*=\s*groq`([^`]+)`", text, flags=re.DOTALL):
                    name = m.group(1)
                    body = m.group(2).strip()
                    snippet = "\n".join(body.splitlines()[:40])
                    f.write(f"- **{name}**\n\n```groq\n{snippet}\n```\n\n")
        f.write("## Tipos Globais Exportados\n\n")
        for fp in walk_repo(root):
            if fp.suffix.lower() not in {".ts", ".tsx"}:
                continue
            text = fp.read_text(encoding="utf-8", errors="ignore")
            found = []
            for m in re.finditer(r"export\s+type\s+(\w+)\s*=\s*{", text):
                found.append(m.group(1))
            for m in re.finditer(r"export\s+interface\s+(\w+)\s*{", text):
                found.append(m.group(1))
            if found:
                rel = fp.relative_to(root).as_posix()
                f.write(f"### `{rel}`\n- " + ", ".join(sorted(set(found))) + "\n\n")
    return out

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--archive", required=True, help="Caminho para o .rar ou .zip do projeto")
    parser.add_argument("--max-lines", type=int, default=400, help="Máximo de linhas lidas por arquivo (heurística)")
    parser.add_argument("--output", default="knowledge_pack", help="Pasta de saída (padrão: knowledge_pack)")
    args = parser.parse_args()

    archive_path = Path(args.archive).expanduser().resolve()
    outdir = Path(args.output).resolve()
    if outdir.exists():
        shutil.rmtree(outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    workdir = Path(tempfile.mkdtemp(prefix="repo_extract_"))
    try:
        root = extract_archive(archive_path, workdir)

        # Se houver pasta de topo única contendo package.json, usar como raiz do projeto
        entries = [p for p in root.iterdir() if p.is_dir()]
        project_root = root
        if len(entries) == 1 and (entries[0] / "package.json").exists():
            project_root = entries[0]

        codemap = generate_codemap(project_root, outdir)
        compovw = generate_components_overview(project_root, outdir, max_lines=args.max_lines)
        api = generate_api_reference(project_root, outdir, max_lines=args.max_lines)

        index = outdir / "README.md"
        with index.open("w", encoding="utf-8") as f:
            f.write("# Knowledge Pack\n\n")
            f.write(f"- Gerado em: {datetime.now().isoformat()}\n")
            f.write(f"- Origem: `{archive_path.name}`\n\n")
            f.write("Arquivos gerados:\n\n")
            for p in [codemap, compovw, api]:
                f.write(f"- `{p.name}`\n")

        print("✅ Concluído. Arquivos gerados em:", outdir)
    finally:
        shutil.rmtree(workdir, ignore_errors=True)

if __name__ == "__main__":
    main()
