# Stdio bridge for Glama health checks / local clients.
# Hosted Streamable HTTP (preferred): https://api.ody.co/v1/mcp
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY bridge ./bridge
RUN npm install --omit=dev --ignore-scripts --no-audit --no-fund \
  && chown -R node:node /app
USER node
ENV NODE_ENV=production
# Optional for live tools: -e ODY_API_KEY=ody_test_…
ENTRYPOINT ["node", "bridge/index.js"]
