FROM buildkite/puppeteer
WORKDIR /var/www

COPY ./package*.json /var/www/
RUN npm install



COPY ./src/ /var/www/

CMD ["npm", "start"]

