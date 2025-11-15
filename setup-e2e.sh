#!/bin/bash

# Setup script for monorepo with yarn workspaces
set -e

echo "🔧 Setting up monorepo with yarn workspaces..."

# Install all workspace dependencies
echo "📥 Installing workspace dependencies..."
yarn install

# Build the plugin
echo "📦 Building plugin..."
yarn workspace tailwind-typescript-plugin build

echo "✅ Setup complete! The plugin is now linked to e2e via yarn workspaces."
echo ""
echo "To test the plugin:"
echo "  cd packages/e2e"
echo "  yarn test"
