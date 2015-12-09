#!/bin/bash
#

echo "=== INSTALLING NPM AND BOWER TO BUILD APK ==="
echo ""
echo ""
bower install --allow-root
npm install --allow-root
npm install -g ionic

echo ""
echo ""
echo "=== STARTING TESTS ==="

gulp test


