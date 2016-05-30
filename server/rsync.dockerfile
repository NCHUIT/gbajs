# vim:syntax=dockerfile

FROM node:5

RUN npm install -g watch-run
RUN apt-get update && apt-get install -y \
    rsync \
&& rm -rf /var/lib/apt/lists/*

RUN mkdir -p /workspace; mkdir -p /usr/src/app;

WORKDIR /workspace

CMD watch-run -p '/workspace/**/*.*' -d 250 -i 'rsync --exclude=node_modules --exclude=.git --exclude=*.swp --exclude=*.swo -urv --delete /workspace/ /usr/src/app'

