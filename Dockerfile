FROM node:10.18.0
ENV NODE_ENV=production1
ENV TZ="Asia/Jerusalem"
RUN apt update && apt install -y ffmpeg
WORKDIR /rtsp-15-min
 
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
 
EXPOSE 9898

CMD [ "npm", "start" ]





 
