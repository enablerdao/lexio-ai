FROM node:20-slim AS frontend-builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.10-slim

WORKDIR /app

# Copy Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the built Next.js app
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/package*.json ./
COPY --from=frontend-builder /app/node_modules ./node_modules

# Copy the FastAPI backend
COPY main.py .

# Expose ports for both services
EXPOSE 3000 8000

# Create a startup script
RUN echo '#!/bin/bash\n\
python main.py &\n\
npm start\n' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]