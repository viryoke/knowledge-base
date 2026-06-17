#!/bin/bash
set -e

VAULT_DIR="../ObsidianVault"
CONTENT_DIR="content"

echo "Syncing vault content from $VAULT_DIR to $CONTENT_DIR..."

# Remove existing content directory
rm -rf "$CONTENT_DIR"
mkdir -p "$CONTENT_DIR"

# Copy published directories
for dir in concepts entities comparisons queries skills navigation; do
  if [ -d "$VAULT_DIR/$dir" ]; then
    echo "  Copying $dir/"
    cp -R "$VAULT_DIR/$dir" "$CONTENT_DIR/"
  fi
done

# Copy published files
for file in index.md SCHEMA.md; do
  if [ -f "$VAULT_DIR/$file" ]; then
    echo "  Copying $file"
    cp "$VAULT_DIR/$file" "$CONTENT_DIR/"
  fi
done

echo "Sync complete!"
echo "Content summary:"
find "$CONTENT_DIR" -type f -name "*.md" | wc -l | xargs echo "  Markdown files:"
find "$CONTENT_DIR" -type d | wc -l | xargs echo "  Directories:"
