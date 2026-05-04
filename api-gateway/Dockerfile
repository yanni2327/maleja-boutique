FROM nginx:alpine

# Eliminar config por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuración del gateway
COPY nginx.gateway.conf /etc/nginx/conf.d/gateway.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
