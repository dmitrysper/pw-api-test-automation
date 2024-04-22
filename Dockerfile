FROM ubuntu:22.04

RUN apt-get update && apt-get -y install libnss3\ 
        libatk-bridge2.0-0\
        libdrm-dev\
        libxkbcommon-dev\ 
        libgbm-dev\ 
        libasound-dev\ 
        libatspi2.0-0\ 
        libxshmfence-dev\ 
        libcups2\ 
        libxcomposite1\ 
        libxdamage1\ 
        libxfixes3\ 
        libxrandr2\
        libpango-1.0-0\
        libcairo2\
        curl\ 
        ca-certificates\
        gnupg\
        xvfb\
        && apt-get autoremove -y \
        && rm -rf /var/lib/apt/lists/* \
        && rm -rf /etc/apt/sources.list.d/* \
        && apt-get clean  

ENV TERM=xterm
ENV NODE_MAJOR=18

#Install NodeJS 18.x
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get -y install nodejs\
        && apt-get autoremove -y \
        && rm -rf /var/lib/apt/lists/* \
        && rm -rf /etc/apt/sources.list.d/* \
        && apt-get clean

#Copy project files to tests folder
WORKDIR /tests
COPY . /tests

# Install project packages and browsers
RUN npm install
# command to be executed when image is run
ENTRYPOINT npm run test -- --tags="$TAG"