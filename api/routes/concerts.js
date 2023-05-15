var express = require('express');
var router = express.Router();
var connection = require('../db');
var hal = require('../hal')

/* GET /concerts */
router.get('/concerts', function (req, res, next) {

  // #swagger.summary = "Liste des concerts"

  connection.query('SELECT * FROM Concert;', (error, rows, fields) => {

    if (error) {
      console.error('Error connecting: ' + error.stack);
      return;
    }
    //Fabriquer Ressource Object Concerts en respectant la spec HAL
    const concertsResourceObject = {
      "_links": [],
      "_embedded": {
        "concerts": (rows.map(row => hal.mapConcertoResourceObject(row, req.protocol + '://' + req.get('host'))))
      }
    }

    res.set('Content-Type', 'application/hal+json');
    res.status(200);
    res.json(concertsResourceObject);
  })
})

/* GET /concerts/{id} */
router.get('/concerts/:id', function (req, res, next) {

  //:id : identifiant primaire en base. Ici, on devra rajouter sur la regex 'que des caractères numériques'

  //Attention aux injections SQL !
  console.log(req.params.id)

  connection.query('SELECT * FROM Concert WHERE id = ?;', [req.params.id], (error, rows, fields) => {
    if (error) {
      console.error('Error connecting: ' + error.stack);
      return;
    }

    const resourceObject = {
      "_links": [],
      "_embedded": {
        "concert": (hal.mapConcertoResourceObject(rows[0], req.protocol + '://' + req.get('host')))
      }
    }
    // res.status(200).set('Content-Type', 'text/html').send('GET /concerts/{id}')
    res.set('Content-Type', 'application/hal+json');
    res.status(200);
    res.json(resourceObject);
  })
})

router.post('/foobar', function (req, res, next) {

  /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Some description...',
                schema: {
                    $name: 'John Doe',
                    $age: 29,
                    about: ''
                }
        } */

  console.log(req.body)
  res.status(200).set('Content-Type', 'text/html').send('POST /concerts/{id}')
})

/**
* Créer une reservation pour le concert
* POST /concerts/:name/reservation
*/
router.post('/concerts/:id/reservation', function (req, res, next) {

    /* #swagger.parameters['pseudo'] = {
          in: 'formData',
          description: 'Le pseudo de l\'utilisateur qui effectue la réservation',
          required: 'true',
          type: 'string',
          format: 'application/x-www-form-urlencoded',
  } */
  
    //1. On doit récupérer la représentation du client: le pseudo de l'utilisateur qui reserve
    if (!req.body.pseudo) {
      res.status(400).set('Content-Type', 'application/hal+json').send('{ "reponse": "Requête invalide, veuiller fournir le pseudo de l\'utilisateur"}')
    }
  
    //2. Identification : 
    connection.query('SELECT id, pseudo FROM user WHERE pseudo = ?;', [req.body.pseudo], (error, rows, fields) => {
      if (error) {
        console.error('Error connecting: ' + error.stack);
        return;
      }
  
      //Si l'identification échoue
      if (rows.length === 0) {
        res.status(400).set('Content-Type', 'application/hal+json').send('{ "reponse": "Requête invalide, l\'utilisateur n\'existe pas"}')
        return
      }
      
      const userId = rows[0].id;
  
      
      //3. Vérifier qu'il n'y pas déjà de reservation pour ce concert et cet utilisateur
      connection.query('SELECT COUNT(*) as nbReservation FROM Reservation r INNER JOIN user u ON r.user_id = u.id INNER JOIN Concert c ON c.id = r.concert_id WHERE pseudo = ? AND c.id = ?;', [req.body.pseudo, req.params.id], (error, rows, fields) => {
        if (error) {
          console.log(error);
          res.status(500).send('An error occurred');
          return;
        }
      
        if (rows && rows.length > 0) {
          const nbReservations = rows[0].nbReservation;
      
          if (nbReservations > 0) {
            res.status(400).set('Content-Type', 'application/hal+json').send(`{ "reponse": "Requête valide: l'utilisateur ${req.body.pseudo} a déjà une reservation pour ce concert"}`);
            return;
          }
        }
  
        // 4. Check if there are available seats
        connection.query('SELECT (SELECT nb_places FROM Concert WHERE id = ?) - (SELECT COUNT(*) FROM Reservation WHERE statut != "annulée" AND concert_id = ?) AS nb_places_dispo;', [req.params.id, req.params.id], (error, rows, fields) => {
          if (error) {
            console.error(error);
            res.sendStatus(500);
            return;
          }

          const nbPlacesDispo = rows[0].nb_places_dispo;

          if (nbPlacesDispo === 0) {
            res.status(400).json({ response: "Requête valide: Plus de places disponibles" });
            return;
          }

        });
        //5. Création d'une reservation
        const reservation = {
            user_id: userId,
            concert_id: req.params.id,
            statut: 'à confirmer',
            date_reservation: new Date() 
        };
  
        connection.query('INSERT INTO Reservation SET ?', reservation, (error, rows, fields) => {
            if (error) {
                console.error('Error connecting: ' + error.stack);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
        })
        const resourceObject = {
          "_links": [],
          "_embedded": {
            "reservation": (hal.mapReservationtoResourceObject(rows[0], req.protocol + '://' + req.get('host')))
          }
        }
        res.set('Content-Type', 'application/hal+json');
        res.status(200);
        res.json(resourceObject);
      })
  })
})

/**
 * Annuler une réservation pour le concert
 * DELETE /concerts/:id/reservation
 */
router.delete('/concerts/:id/reservation', function (req, res, next) {
  /* #swagger.parameters['pseudo'] = {
        in: 'formData',
        description: 'Le pseudo de l\'utilisateur dont la réservation doit être annulée',
        required: 'true',
        type: 'string',
        format: 'application/x-www-form-urlencoded',
  } */

  // Vérifier si le pseudo est fourni
  if (!req.body.pseudo) {
    res.status(400).set('Content-Type', 'application/hal+json').send('{ "reponse": "Requête invalide, veuillez fournir le pseudo de l\'utilisateur"}')
    return;
  }

  // Identification de l'utilisateur
  connection.query('SELECT id FROM user WHERE pseudo = ?;', [req.body.pseudo], (error, rows, fields) => {
    if (error) {
      console.error('Error connecting: ' + error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Vérifier si l'utilisateur existe
    if (rows.length === 0) {
      res.status(400).set('Content-Type', 'application/hal+json').send('{ "reponse": "Requête invalide, l\'utilisateur n\'existe pas"}')
      return;
    }

    const userId = rows[0].id;

    // Annuler la réservation
    connection.query('UPDATE Reservation SET statut = "annulée" WHERE user_id = ? AND concert_id = ?;', [userId, req.params.id], (error, rows, fields) => {
      if (error) {
        console.error('Error connecting: ' + error.stack);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (rows.affectedRows === 0) {
        res.status(400).set('Content-Type', 'application/hal+json').send(`{ "reponse": "Requête valide: l'utilisateur ${req.body.pseudo} n'a pas de réservation pour ce concert"}`);
        return;
      }

      res.status(200).json({ response: "Réservation annulée avec succès" });
    });
  });
});


/**
 * Confirmer une réservation pour le concert
 * PUT /concerts/:id/reservation
 */
router.put('/concerts/:id/reservation', function (req, res, next) {
  /* #swagger.parameters['pseudo'] = {
        in: 'formData',
        description: 'Le pseudo de l\'utilisateur dont la réservation doit être confirmée',
        required: 'true',
        type: 'string',
        format: 'application/x-www-form-urlencoded',
  } */

  // Vérifier si le pseudo est fourni
  if (!req.body.pseudo) {
    res.status(400).set('Content-Type', 'application/hal+json').send('{ "reponse": "Requête invalide, veuillez fournir le pseudo de l\'utilisateur"}')
    return;
  }

  // Identification de l'utilisateur
  connection.query('SELECT id FROM user WHERE pseudo = ?;', [req.body.pseudo], (error, rows, fields) => {
    if (error) {
      console.error('Error connecting: ' + error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Vérifier si l'utilisateur existe
    if (rows.length === 0) {
      res.status(400).set('Content-Type', 'application/hal+json').send('{ "reponse": "Requête invalide, l\'utilisateur n\'existe pas"}')
      return;
    }

    const userId = rows[0].id;

    // Confirmer la réservation
    connection.query('UPDATE Reservation SET statut = "confirmé" WHERE user_id = ? AND concert_id = ?;', [userId, req.params.id], (error, rows, fields) => {
      if (error) {
        console.error('Error connecting: ' + error.stack);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (rows.affectedRows === 0) {
        res.status(400).set('Content-Type', 'application/hal+json').send(`{ "reponse": "Requête valide: l'utilisateur ${req.body.pseudo} n'a pas de réservation à confirmer pour ce concert"}`);
        return;
      }

      res.status(200).json({ response: "Réservation confirmée avec succès" });
    });
  });
});


/**
 * Obtenir la liste des réservations confirmées pour un concert
 * GET /concerts/:id/reservations
 */
router.get('/concerts/:id/reservation', function (req, res, next) {

  // Liste des réservations confirmées
  connection.query('SELECT * FROM reservation WHERE concert_id = ? AND statut = "confirmé";', [req.params.id], (error, rows, fields) => {
    if (error) {
      console.error('Error connecting: ' + error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (rows.length === 0) {
      res.status(200).json([]);
      return;
    }

    res.status(200).json(rows);
  });
});


module.exports = router;