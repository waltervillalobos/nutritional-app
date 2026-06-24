#!/bin/sh
# Enforces the rule: src/domain/ must never import from data/, store/, or app/.
# Violations break the layer isolation that keeps domain rules testable in isolation.

DOMAIN_DIR="src/domain"

if [ ! -d "$DOMAIN_DIR" ]; then
  exit 0
fi

VIOLATIONS=$(grep -rn \
  --include="*.ts" --include="*.tsx" \
  -E "from ['\"](\.\./)*\.\./?(data|store|app)/|from ['\"]@/(data|store|app)/" \
  "$DOMAIN_DIR" 2>/dev/null)

if [ -n "$VIOLATIONS" ]; then
  echo ""
  echo "Domain boundary violation: src/domain/ must not import from data/, store/, or app/"
  echo ""
  echo "$VIOLATIONS"
  echo ""
  exit 1
fi

exit 0
