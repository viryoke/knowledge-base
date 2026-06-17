#!/bin/bash
# Sync content from ObsidianVault to Quartz content directory
# Usage: ./sync-content.sh

VAULT_DIR="../ObsidianVault"
CONTENT_DIR="content"

if [ ! -d "$VAULT_DIR" ]; then
  echo "Error: Vault directory not found at $VAULT_DIR"
  exit 1
fi

echo "Syncing content from $VAULT_DIR to $CONTENT_DIR..."

rm -rf "$CONTENT_DIR"
mkdir -p "$CONTENT_DIR"

for dir in concepts entities comparisons queries skills navigation; do
  if [ -d "$VAULT_DIR/$dir" ]; then
    cp -R "$VAULT_DIR/$dir" "$CONTENT_DIR/"
    echo "  Copied $dir/"
  fi
done

for file in index.md SCHEMA.md; do
  if [ -f "$VAULT_DIR/$file" ]; then
    cp "$VAULT_DIR/$file" "$CONTENT_DIR/"
    echo "  Copied $file"
  fi
done

echo "Done! Run 'npx quartz build' to build the site."
