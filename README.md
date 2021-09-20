# Dynamic Schedule Jobs

## Pre-requisites globals

- [Node 16+](https://nodejs.org/en/docs/);
- [NestJS](https://docs.nestjs.com/);
- [Redis](https://redis.io/documentation);
- [Redis Commander](http://joeferner.github.io/redis-commander/);
- [Postgres](https://www.postgresql.org/docs/);
- [PG Admin](https://www.pgadmin.org/);
- [Docker](https://docs.docker.com/);
- [Docker-Compose](https://docs.docker.com/compose/);


This project was bootstrapped with:
- [Configuration](https://docs.nestjs.com/techniques/configuration);
- [TypeORM](https://docs.nestjs.com/techniques/database);
- [Task Scheduling](https://docs.nestjs.com/techniques/task-scheduling);
- [Bull](https://docs.nestjs.com/techniques/queues);


<br/>

## Project Goal

The main goal of this project is validate the scalabity of a nodejs application with dynamic scheduled jobs via api, based on cron, executing each job just once even if exists multiples service instances running;

2 different strategies for dynamic schedule jobs were implemented:

a) Cron: task schedule to reproduce the obstacle related to multiples instances;

b) Bull: to be able to sun multiples instances with a single job execution;

Both strategies will be better described below.

<br/>

## Environment Variables

All environment variables used by this project are defined in `.env` file.

<br/>

## Commands

- `npm install` install all project dependences. 

- `npm run start:dev` builds & run the app in dev mode, rebuilding & refreshing on changes. 

- Default port: `3000`. It can be different in case service is running using docker-compose with `--scale` param, as decribed below;
  
NOTE: To run more than 1 instance, just set the port using env var on command: `PORT=3001 npm run start:dev`

- `npm run start:prod` generate final version. Used on docker image create.

<br/>

## Infra

This project require some services that should be running before services start: postgres, redis and redis-commander. Some docker-compose files are available on `./infra` directory to install those services; To execute them, just run the command: `docker-compose up`

* **Dockerfile**

  The Dockerfile file is on project root. To build project docker image, just run the command: 
  
  `docker build . -t dynamic-scheduled-jobs`.

* **Docker-Compose**

    Docker-compose file to start `Postgres`, `Redis` and `Redis Commander` and the project instance, is available in `./infra`.

    It requires existing project docker image on local docker image repository. Check commented code on docker-compose file related to this project.
    
    Multiples instances can be started using docker compose command with `--scale` param as following: 

    _NOTE: this docker-compose file requires existing project docker image on local docker image repository. To build ptoject docker image, check Docker session above._

* **Bash file (run.sh)**

    To build the project Image and start all services using a single command, was created a bash file that build the image, install all redis, install postgres and start 3 instances of this project.

    The bash file is available in: `./infra/run.sh`. Check commented code there related to `--scale` param.

    To execute this file, go to `./infra` directory and run the command: `./run.sh`

    _NOTE: Before run bash file on the first time, is require grant permitions to the bash file. It can be done running: `chmod +x ./infra/run.sh`

<br/>

## Cron Jobs

- This type of Job work well on a single service instance, but, will allow multiples jobs execution when more than one service instance is running. 

- By Default, when service starts, is being creating 1 Cron Job to be executed. This strategy is to try to reproduce dynamic Jobs creation based on DB data. But, for this project, this Job do not come from DB and we are just mocking the Job on service init. For more details, check: `scr/cron-jobs/cron.job.service.ts` and method `onModuleInit`.

- There are 2 endpoints to allow create and delete this type of Job dynamically. The controller is available on, check: `scr/cron-jobs/cron.job.controller.ts`

- On each job execution, the jobs is logged on DB. For more details, check: `scr/log-jobs/log.job.service.ts` and method `save`.

<br/>

## Bull Jobs

- This type of Job work well on a single or multiples services instances. This is because uses a very popular and stable NodeJS library [Bull](https://github.com/OptimalBits/bull) already integrated with [NestJS](https://docs.nestjs.com/techniques/queues).

- Bull allow create scheduled Jobs based on Queue strategy and uses Redis to manage the Dynamic Scheduled Jobs creation and execution once and in a single instance.

- By Default, when service starts, is being creating 1 Bull Job to be executed. This strategy is to try to reproduce dynamic Jobs creation based on DB data. But, for this projecty, this Job do not come from DB and we are just mocking the Job on service init. For more details, check: `scr/cron-jobs/bull.job.service.ts` and method `onModuleInit`.

- There are 2 endpoints to allow create and delete this type of Job dynamically. There is one more endpoint that allow toogle the Bull Jobs Queues in runtime to enable/disable job executions. The controller is available on, check: `scr/bull-jobs/bull.job.controller.ts`

- On each job execution, the jobs is logged on DB. For more details, check: `scr/log-jobs/log.job.service.ts` and method `save`.

<br/>

## Bull Board

Bull provide a simple dashboard (_running embended with this project_) where we can see the scheduled jobs by state and it is available in: http://localhost:3000/admin/bull/queue

_NOTE: To check the service PORT exposed by Docker, you can run `docker ps` command and see the port exposed of each instance of this service in docker container._

<br/>

## Redis Commander

An alternative of Bull Dashboard to check redis state managed by bull, an Redis Commander is avaliable in docker-compose file
After run redis-commander image, you can access it in: http://localhost:16380/

<br/>

## APIs Cron Examples

### Create new Cron Job to be executed on every 5 seconds

```shell script
curl --request POST \
  --url http://localhost:3000/cron/jobs \
  --header 'Content-Type: application/json' \
  --data '{
    "clientId": 2,
    "jobName": "Cron Job to Process Lowest Price for client 2",
		"jobType": "PROCESS_LOWEST_PRICE",
		"cron": "*/10,15,20,25,30,35,40,45,50,55 * * * * *",
    "expectedFail": false,
    "expectedKillInstance": false
}'
```

_NOTE: To check the service port exposed by Docker, you can run `docker ps` command and see the port exposed of each instance of this service in docker container._

<br/>

### Delete existing Cron Job

```shell script
curl --request DELETE \
  --url http://localhost:3000/cron/jobs/2-PROCESS_LOWEST_PRICE
```

_NOTE: To check the service port exposed by Docker, you can run `docker ps` command and see the port exposed of each instance of this service in docker container._

<br/>

## APIs Bull Examples

### Create new Bull Job to be executed on every second

```shell script
curl --request POST \
  --url http://localhost:3000/bull/jobs \
  --header 'Content-Type: application/json' \
  --data '{
    "clientId": 2,
    "jobName": "Bull Job to Process Lowest Price for client 2",
		"jobType": "PROCESS_LOWEST_PRICE",
		"cron": "*/1 * * * * *",
    "expectedFail": false,
    "expectedKillInstance": false
}'
```

_NOTE: To check the service port exposed by Docker, you can run `docker ps` command and see the port exposed of each instance of this service in docker container._

<br/>

### Delete existing Bull Job

```shell script
curl --request DELETE \
  --url http://localhost:3000/bull/jobs/2-PROCESS_LOWEST_PRICE
```

_NOTE: To check the service port exposed by Docker, you can run `docker ps` command and see the port exposed of each instance of this service in docker container._

<br/>

## Postgres Queries

To help with Jobs execution audit, all job executions are being logged in Postgres DB on table `log_job`.

Following, some example sql queries to audit job executions:

<br/>

### Search Duplicated Jobs Executed

```sql script
select job_id , cron , executed_by , to_char(executed_at, 'yyyy-MM-dd HH:mm:ss') executed_at , count(*) total
from log_job
group by job_id , cron , executed_by , executed_at 
having count(*) > 1
order by 1, 2, 3, 4;
```

<br/>

### Total Jobs executed grouped by who executed (cron or bull)
  
```sql script
select job_id, executed_by, count(*) 
from log_job
group by job_id, executed_by;
```