#!/bin/bash
set -e

VAULT_DIR="${VAULT_DIR:-../ObsidianVault}"
CONTENT_DIR="${CONTENT_DIR:-content}"

echo "Syncing vault content from $VAULT_DIR to $CONTENT_DIR..."

# Remove existing content directory
rm -rf "$CONTENT_DIR"
mkdir -p "$CONTENT_DIR"

# Copy published directories (add new directories here)
for dir in concepts entities comparisons queries skills navigation presentations; do
  if [ -d "$VAULT_DIR/$dir" ]; then
    echo "  Copying $dir/"
    cp -R "$VAULT_DIR/$dir" "$CONTENT_DIR/"
  fi
done

# Copy published files (exclude internal files: SCHEMA.md, log.md, AGENTS.md, LINT-RULES.md)
for file in index.md; do
  if [ -f "$VAULT_DIR/$file" ]; then
    echo "  Copying $file"
    cp "$VAULT_DIR/$file" "$CONTENT_DIR/"
  fi
done

# Clean up files that should not be published (defense in depth with quartz.config.yaml ignorePatterns)
find "$CONTENT_DIR" -name ".obsidian" -type d -exec rm -rf {} + 2>/dev/null || true
find "$CONTENT_DIR" -name ".DS_Store" -delete 2>/dev/null || true

echo "Sync complete!"
echo "Content summary:"
find "$CONTENT_DIR" -type f -name "*.md" | wc -l | xargs echo "  Markdown files:"
find "$CONTENT_DIR" -type f ! -name "*.md" | wc -l | xargs echo "  Non-markdown files:"
find "$CONTENT_DIR" -type d | wc -l | xargs echo "  Directories:"
