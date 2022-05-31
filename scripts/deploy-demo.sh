cd src/client

# Update package.json for demo deploy
cat package.json | jq --arg homepage "https://$GITHUB_USER.github.io/$GITHUB_REPO" '. + {homepage: $homepage}' > package.json.demo
cp package.json package.json.save
cp package.json.demo package.json

# Build and deploy
npm run build
npx gh-pages -d build 

# Clean up
cp package.json.save package.json
rm package.json.save
rm package.json.demo

cd -;