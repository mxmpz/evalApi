# Starter pack: *RESTful* web API avec node.js et Express

Un *starter pack* dockerisé d'une application web node.js pour développer une web API RESTful. L'API vient avec un service de base de données relationnelles (MySQL) et un client graphique (Adminer).

- [Starter pack: *RESTful* web API avec node.js et Express](#starter-pack-restful-web-api-avec-nodejs-et-express)
  - [Prérequis](#prérequis)
  - [Lancer le projet avec Compose](#lancer-le-projet-avec-compose)
  - [Tester](#tester)
    - [API](#api)
    - [Base de données](#base-de-données)
    - [Client graphique Adminer pour la base de données MySQL](#client-graphique-adminer-pour-la-base-de-données-mysql)
  - [Base de données](#base-de-données-1)
    - [ORM](#orm)
  - [Documentation de l'API avec Swagger](#documentation-de-lapi-avec-swagger)
  - [Installer et servir de nouvelles dépendances](#installer-et-servir-de-nouvelles-dépendances)
  - [Arrêter le projet](#arrêter-le-projet)
  - [Libs notables](#libs-notables)
  - [Autorisation avec JWT](#autorisation-avec-jwt)
  - [Ressources](#ressources)
    - [Docker](#docker)
    - [Express](#express)
    - [Swagger](#swagger)
    - [SGBDR](#sgbdr)


## Prérequis

- installer [node.js](https://nodejs.org/en)
- installer [Docker](https://www.docker.com/get-started/) et [Compose](https://docs.docker.com/compose/)
- clôner le dépôt et se placer à la racine du projet

>N'oubliez pas de supprimer le dossier `.git` si vous désirez créer votre propre dépôt à partir des sources

~~~
rm -R .git
git init
~~~

## Lancer le projet avec Compose

Dupliquer le fichier `.env.dist`

~~~
cp .env.dist .env
~~~

> Vous pouvez modifier les variables d'environnement si vous le souhaitez (des valeurs par défaut sont fournies)

Démarrer le projet

~~~
docker-compose up -d
~~~

## Tester

### API

Se rendre à l'URL [localhost:5001](http://localhost:5001), ou tester (avec [curl](https://curl.se/))

~~~
# Web humain (HTML)
curl --include localhost:5001
# API (JSON)
curl --include localhost:5001/users
~~~

### Base de données

Avec le client mysql

~~~
mysql -uroot -proot -Dmydb -h127.0.0.1 -P5002
~~~

Pour éxecuter un script SQL en *Batch mode*

~~~
mysql -uroot -proot -Dmydb -h127.0.0.1 -P5002 < script.sql
~~~

>Penser à modifier la valeur du port si vous l'avez changé dans le `.env`

### Client graphique Adminer pour la base de données MySQL

Se rendre à l'url [http://localhost:5003](http://localhost:5003) et se connecter avec les credentials *root* (login *root* et mot de passe *root* par défaut)

## Base de données

L'`host` de la base de données est le nom du service sur le réseau du projet crée par Docker, soit `db`.

### ORM

Pour interagir avec la base de données SQL, nous pouvons utiliser l'ORM [Sequelize](https://sequelize.org)

## Documentation de l'API avec Swagger

Générer automatiquement la documentation de vos routes avec le module Swagger

~~~
node swagger.js
~~~

ou

~~~
npm run swagger-autogen
~~~

Se rendre à l'URL `/doc` pour accéder à l'UI de Swagger

## Installer et servir de nouvelles dépendances

A la racine de l'application, installer les dépendances désirées *via* `npm`

~~~
pushd api
npm install <votre paquet>
popd
~~~

## Arrêter le projet

~~~
docker-compose down
~~~

## Libs notables

- [bodyParser](https://www.npmjs.com/package/body-parser), un parser du corps de requête pour les applications node. On s'en sert pour parser les représentations envoyées par le client dans nos contrôleurs avec l'instruction `app.use(bodyParser.urlencoded({ extended: true }));`
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), une implémentation javascript du standard JSON Web Token, voir [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519)
- [cors](https://www.npmjs.com/package/cors), un module middleware pour gérer la politique CORS (*Cross Origin Resource Sharing*)

## Autorisation avec JWT

>JSON Web Token (JWT) is a compact, URL-safe means of *representing claims to be transferred between two parties* (Source: RFC7519)

Pour **autoriser** (et donc authentifier) l'utilisateur à interagir avec les ressources, on utilise un JSON Web Token. Implémentée dans le projet avec le package [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

## Ressources

### Docker

- [Image Docker Node](https://hub.docker.com/_/node)
- [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)
- [Nodemon](https://www.npmjs.com/package/nodemon), outil de développement d'applications node.js pour redémarrer le process du serveur web automatiquement lorsque les sources changent

### Express

- [Générateur d’applications Express](https://expressjs.com/fr/starter/generator.html), générer un projet pour démarrer
- [Routage](https://expressjs.com/fr/guide/routing.html), la documentation sur le routage d'Express
- [Pug](https://pugjs.org/api/getting-started.html), moteur de templates javascript installé par défaut avec Express
- [API JSON Web Token Authentication (JWT) sur Express.js](https://etienner.github.io/api-json-web-token-authentication-jwt-sur-express-js/), un bon tutoriel pour mettre en place des routes protégées par Json Web Token


### Swagger

- [Swagger UI](https://github.com/swagger-api/swagger-ui), documenter une web API RESTful (même si elle devrait être *par définition* auto-documentée et *auto-descriptive*)
- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express), module node.js pour générer la documentation de l'API avec Express
- [Swagger auto-gen](https://www.npmjs.com/package/swagger-autogen), module de génération *automatique* de la documentation de l'API dans une application node.js/Express. Voir notamment la documentation pour documenter automatiquement les endpoints (résumé, description, paramètres)
- [Swagger auto-gen: décrire des paramètres de formulaire POST](https://www.npmjs.com/package/swagger-autogen#parameters)
- [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification), un standard de description d'une web API comptabile avec REST

### SGBDR

- [MySQL Docker Image, quick reference](https://hub.docker.com/_/mysql/)
- [mysql js](https://www.npmjs.com/package/mysql), le driver node.js pour les SGBDR MySQL
- [mysql js, escaping output !](https://www.npmjs.com/package/mysql#escaping-query-values)
- [Sequelize, Getting Started](https://sequelize.org/docs/v6/getting-started/), Sequelize, un ORM pour node.js


