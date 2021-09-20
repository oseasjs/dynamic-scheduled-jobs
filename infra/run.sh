printf '\n### Docker build of dynamic-scheduled-jobs started...\n'
cd ../
docker build . -t dynamic-scheduled-jobs
printf '\n### Docker build of dynamic-scheduled-jobs ended...\n'

printf '\n### Starting docker-compose to install services...\n'
pwd
cd ./infra
docker-compose up

# Command to run docker-compose with 3 POC instances
# docker-compose up --scale app-instance=3

printf '\n### All services were successfully started!'