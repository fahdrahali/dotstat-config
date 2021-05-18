# Config server

To ease configurations management and avoid to spread setup data over all repos, config server centralize all configuration resources used by other services, mainly webapps but also servers.

`config server` is like an internal private http bucket shared by internal services to perform tenant's webapp cutomisations.

2 resources are managed by `config`:

* `assets` : starts by `/assets` and follow below principles. Those resources are accessed only via `proxy` from external requests (unprotected resources)
* `configs`: starts by `/configs`, follow below principles and are only accessed by requests internal (protected resources) to the cluster coming from other servers (`data-explorer`, `sfs`, ...). 

## Resources principles

Resources are splitted in 2 groups `dev` and prod` see below.

`dev` resources are deployed on `staging`, `prod` on `qa`.

We split `dev` from `prod` to allow different setups in time.

Inside each group they must follow the same name's convention: `/${tenant.id}/${appId}/${path}`

* always starts with '/'

* `tenant` object is defined in `/configs/tenants.json` like:

```
{
   "default": {
      id: "default",
      name"My default tenant"
   },
   ...
}
```

* `appId` is an ID defining an app (in the case of `webapp` it's value is defined in `params/default.js`)

It's under client responsability (data-explorer`, `sfs`, ...) to format correctly resource urls.


## Docker Images

gitops pipeline pushes 2 images:

* siscc/dotstatsuite-config-dev: for `development` environnement
* siscc/dotstatsuite-config-prod: for'production` and `qa`


## Architecture

It's mainly composed of a nodeJS server and configuration data.

server responds to GET /configs/<path_to_resource>,  GET /assets/<path_to_resource>, and GET /healthcheck

It's a simple http static files server.

Configuration data are splitted in 2 versions, development and production and stored under `data/dev` and `data/prod`

It's under user responsability to manage content.

At build time, for branch `develop`, `siscc/dotstatsuite-config-dev` image is pushed made with data from `data/dev`, for branch `master, `siscc/dotstatsuite-config-prod` is pushed.


## Gitlab

https://gitlab.com/sis-cc/.stat-suite/dotstatsuite-config/


## Usage


### Config

* `process.env.SERVER_HOST`: service's hostname
* `process.env.SERVER_PORT`: service's port

Change those values manually in `src/params/development.js` or set shell variables:

```
$ SERVER_PORT=9999 yarn start:srv
```


### Use a container

```
$ docker run -d --name config --restart always -p 5007:80 siscc/dotstatsuite-config-dev:latest
```

### Development

Clone repo

```
$ yarn
$ yarn start:srv
```

### Production mode:

```
$ yarn dist
$ yarn dist:run
...
```

### Health checks



```
$ curl http://localhost:5007/healthcheck
{
gitHash: "#develop",
startTime: "2019-03-26T08:10:07.391Z"
}
```


### Test


To execute tests, run:
```
$ yarn test
```

To check coverage:
```
$ yarn test --coverage
```


