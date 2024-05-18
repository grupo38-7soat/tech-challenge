FROM postgres:latest

ENV POSTGRES_DB=techchallengedb
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=tech_challenge_123

COPY *.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
