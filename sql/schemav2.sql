-- Script de création du schéma de la base de données du SI de réservation
-- de places de concerts (DDL: Data Definition Language)
-- Créer le schéma en batchmode avec la commande mysql -uroot -proot -h127.0.0.1 -P5002 < ../schema.sql

USE mydb

CREATE TABLE IF NOT EXISTS Concert(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    artiste VARCHAR(120) NOT NULL,
    date_debut DATETIME NOT NULL,
    nb_places INT NOT NULL,
    lieu TEXT NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT ck_nb_salles CHECK (nb_places > 0)
);


CREATE TABLE IF NOT EXISTS Utilisateur(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    pseudo VARCHAR(36) NOT NULL,
    CONSTRAINT un_pseudo UNIQUE(pseudo)
);

CREATE TABLE IF NOT EXISTS Reservation(
    id_concert INTEGER,
    id_utilisateur INTEGER,
    statut ENUM('a_confirme','confirme','annule'),
    date_reservation DATETIME NOT NULL,
    CONSTRAINT pk_reservation PRIMARY KEY(id_concert, id_utilisateur),
    CONSTRAINT fk_concert FOREIGN KEY (id_concert) REFERENCES Concert(id),
    CONSTRAINT fk_utilisateur FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id)
);

