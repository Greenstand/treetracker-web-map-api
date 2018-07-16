FROM nginx:1.15.0

ENV HTML_DIR /usr/share/nginx/html
COPY css $HTML_DIR/css
COPY fonts $HTML_DIR/fonts
COPY img $HTML_DIR/img
COPY favicon.ico index.html icon_style.css \
  icons-reference.html $HTML_DIR/