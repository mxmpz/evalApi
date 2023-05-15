/**
 * Export des fonctions utils hal
 */

const connection = require('./db')

/**
 * Retourne un Link Object
 * @param {*} url
 * @param {*} type
 * @param {*} name
 * @param {*} templated
 * @param {*} deprecation
 * @returns
 */
function halLinkObject (url, type = '', name = '', templated = false, deprecation = false) {
  return {
    href: url,
    templated,
    ...(type && { type }),
    ...(name && { name }),
    ...(deprecation && { deprecation })
  }
}

/**
 * Retourne une représentation Ressource Object (HAL) d'un concert
 * @param {*} concertData Données brutes d'un concert
 * @returns un Ressource Object Concert (spec HAL)
 */
function mapConcertoResourceObject (concertData, baseURL) {
  /**
     * A faire: requêter le nombre de reservations pour calculer le nombre de places disponibles
     * Attention a l'async
     */
  const reservations = 0

  const resourceObject = {
    _links: [{
      self: halLinkObject(baseURL + '/concerts' + '/' + concertData.id, 'string', 'Les informations d\'un concert'),
      reservation: halLinkObject(baseURL + '/concerts' + '/' + concertData.id + '/reservation', 'string')
    }],
    _embedded: {
      id: concertData.id,
      date: concertData.date_debut,
      nb_places: concertData.nb_places,
      nb_places_disponibles: concertData.nb_places - reservations.length,
      lieu: concertData.lieu,
      description: concertData.description
    }
  }

  return resourceObject
}

/**
 * Retourne un Resource Object d'un utilisateur
 * @param {*} userData
 * @param {*} baseURL
 * @returns
 */
function mapUtilisateurtoResourceObject (userData, baseURL) {
  return {
    _links: [{
      self: halLinkObject(baseURL + '/utilisateurs' + '/' + userData.pseudo, 'string')
    }],
    _embedded: {
      pseudo: userData.pseudo
    }
  }
}

/**
 * Retourne une représentation Ressource Object (HAL) d'une réservation
 * @param {*} concertData Données brutes d'un concert
 * @returns un Ressource Object Reservation (spec HAL)
 */
function mapReservationtoResourceObject (concertData, baseURL) {
  const resourceObject = {
    _links: [{
      self: halLinkObject(baseURL + '/concerts' + '/' + concertData.id + '/reservation', 'string'),
      confirm: halLinkObject(baseURL + '/concerts' + '/' + concertData.id + '/reservation' + '/confirm', 'string'),
      cancel: halLinkObject(baseURL + '/concerts' + '/' + concertData.id + '/reservation' + '/cancel', 'string')
    }],
    _embedded: {
      reservation: {
        user_id: concertData.user_id,
        concert_id: concertData.concert_id,
        status: concertData.status,
        date_reservation: concertData.date_reservation
      }
    }
  }

  return resourceObject
}

module.exports = { halLinkObject, mapConcertoResourceObject, mapUtilisateurtoResourceObject, mapReservationtoResourceObject }
