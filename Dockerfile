# Utiliser Node.js 14 comme base
FROM node:14-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer Angular CLI 14
RUN npm install -g @angular/cli@14.2.7

# Installer les dépendances du projet
RUN npm install --legacy-peer-deps

# Copier le code source
COPY . .

# Construire l'application Angular pour production
RUN ng build --configuration=production

# Exposer le port (ng serve par défaut 4200)
EXPOSE 4200

# Lancer l'application Angular
CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
