FROM php:8.2-cli

# Instalar mysqli
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Copiar archivos
COPY . /app/

WORKDIR /app

EXPOSE 80

CMD ["php", "-S", "0.0.0.0:80"]
