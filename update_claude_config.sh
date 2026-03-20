#!/bin/bash

# Script to help update Claude Code configuration
CONFIG_FILE="$HOME/.claude/settings.json"

echo "Updating Claude Code configuration..."

# Create backup of existing config
if [ -f "$CONFIG_FILE" ]; then
    echo "Creating backup of existing config..."
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Process the existing config to comment out old values and add new ones
    TEMP_CONFIG=$(mktemp)
    
    # Read existing config and add comments to old env vars
    jq '
    if .env then
      .env |= with_entries(
        if (.key | test("ANTHROPIC_AUTH_TOKEN|ANTHROPIC_MODEL")) then
          (.value |= {"_commented_value": ., "_comment": "Previous configuration - keeping for reference"}) |
          (.key |= "_comment_" + .)
        else
          .
        end
      ) |
      .env.ANTHROPIC_AUTH_TOKEN = "your_actual_api_key_here" |
      .env.ANTHROPIC_BASE_URL = "https://ark.cn-beijing.volces.com/api/coding" |
      .env.API_TIMEOUT_MS = "3000000" |
      .env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = 1 |
      .env.ANTHROPIC_MODEL = "doubao-seed-code-preview-latest"
    else
      .env = {
        "ANTHROPIC_AUTH_TOKEN": "your_actual_api_key_here",
        "ANTHROPIC_BASE_URL": "https://ark.cn-beijing.volces.com/api/coding",
        "API_TIMEOUT_MS": "3000000",
        "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1,
        "ANTHROPIC_MODEL": "doubao-seed-code-preview-latest"
      }
    end
    ' "$CONFIG_FILE" > "$TEMP_CONFIG" && mv "$TEMP_CONFIG" "$CONFIG_FILE"
else
    # Create new config if it doesn't exist
    mkdir -p "$(dirname "$CONFIG_FILE")"
    cat > "$CONFIG_FILE" << 'EOF'
{
    "env": {
        "ANTHROPIC_AUTH_TOKEN": "your_actual_api_key_here", // Replace with your actual API key
        "ANTHROPIC_BASE_URL": "https://ark.cn-beijing.volces.com/api/coding",
        "API_TIMEOUT_MS": "3000000",
        "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1,
        "ANTHROPIC_MODEL": "doubao-seed-code-preview-latest"
    }
}
EOF
fi

echo "Configuration updated successfully!"
echo "Please remember to replace 'your_actual_api_key_here' with your actual API key."
echo "Config file location: $CONFIG_FILE"