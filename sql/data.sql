-- Insertion d'un jeu de données test
-- Insérer les données en batchmode avec la commande mysql -uroot -proot -h127.0.0.1 -P5002 < ../data.sql
-- Format standard de la chaine de caractère d'un datetime 'YYYY-mm-dd hh:mm:ss'
USE mydb;

INSERT INTO
    Concert (artiste, nb_places, lieu, date_debut, description)
VALUES
    ('Metallica', 3000, 'Nantes', '2023-12-24 21:00:00', 'Lore ipsum'),
    ('Jule', 50, 'Maison de Retraite de Ploudalmezeau', '2023-11-12 18:00:00', 'Lore ipsum'),
    ('Lompale', 500, 'Rennes', '2024-01-24 22:00:00', 'Lore ipsum');


INSERT INTO
    Utilisateur (pseudo)
VALUES
    ('John'),
    ('Eve');