# Node.js imagen
FROM node:19

# Directorio de trabajo
WORKDIR /app

# Copiar
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copy de nuevoo
COPY . .

# Exponer puerto
EXPOSE 3000

# Correr la app
CMD ["npm", "run", "dev"]
