#!/bin/bash
# PostToolUse sur Edit|Write : lance ESLint sur le fichier que l'agent vient de modifier.
fichier=$(jq -r '.tool_input.file_path // empty')
case "$fichier" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 1
if ! sortie=$(pnpm exec eslint "$fichier" 2>&1); then
  echo "Lint en échec sur $fichier :" >&2
  echo "$sortie" >&2
  exit 2
fi
exit 0
