# Static frontend served by nginx
FROM nginx:1.27-alpine

# Remove default nginx site config
RUN rm /etc/nginx/conf.d/default.conf

# Add our config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets
COPY . /usr/share/nginx/html

EXPOSE 80
