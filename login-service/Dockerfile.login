FROM php:8.2-apache

# Instalar mysqli
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Configurar Apache MPM
RUN a2dismod mpm_event mpm_worker 2>/dev/null; a2enmod mpm_prefork

# Copiar archivos del proyecto
COPY . /var/www/html/

# Dar permisos
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
