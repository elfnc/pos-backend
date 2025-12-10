# Gunakan image Node.js versi LTS yang ringan (Alpine Linux)
FROM node:22-alpine

# Set folder kerja di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json terlebih dahulu (untuk caching layer)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh source code ke dalam container
COPY . .

# Generate Prisma Client (wajib dilakukan karena Prisma butuh binary sesuai OS container)
RUN npx prisma generate

# Expose port aplikasi
EXPOSE 5000

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]