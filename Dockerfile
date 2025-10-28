FROM node:22.13.1

WORKDIR /app
COPY . .

RUN npm install

RUN cd src && npx prisma generate 

CMD ["npx prisma migrate deploy --schema src/prisma/schema.prisma"]