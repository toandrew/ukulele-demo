FROM ubuntu
MAINTAINER titushuang "jianmin.jim@gmail.com"
ENV REFRESHED_AT 2016-6-8

RUN apt-get update \
    && apt-get install -y python python-pip apt-utils

RUN apt-get install -y python-dev
RUN apt-get -y -q install nginx
RUN pip install flask 
RUN pip install -U flask-cors
RUN apt-get -y -q install curl

RUN mkdir -p /home/toptopic /home/toptopic/web

COPY init.sh /home/toptopic/init.sh
COPY www /home/toptopic/www

COPY nginx/global.conf /etc/nginx/conf.d/
COPY nginx/nginx.conf /etc/nginx/nginx.conf

RUN ln -s /home/toptopic/www /usr/share/nginx/html

RUN chmod +x /home/toptopic/init.sh 
RUN chmod -R 755 /home/toptopic/www

EXPOSE 2223 5000

CMD ["/home/toptopic/init.sh"]
