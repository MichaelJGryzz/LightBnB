const { Pool } = require('pg');

const pool = new Pool({
  user: 'development',
  password: 'development',
  host: 'localhost',
  database: 'lightbnb',
  port: 5432
});

const properties = require("./json/properties.json");
const users = require("./json/users.json");

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email.toLowerCase()])
    .then((result) => {
      if(result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [id])
    .then((result) => {
      if(result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const { name, email, password} = user;
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [name, email.toLowerCase(), password])
    .then((result) => {
      return result.rows[0]; // Return the newly inserted user
    })
    .catch((err) => {
      console.log(err.message);
    });
};
/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(`
      SELECT properties.*,
       reservations.*,
       avg(property_reviews.rating) AS average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id 
      ORDER BY reservations.start_date
      LIMIT $2;
    `, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1- Setup an array to hold any parameters that may be available for the query
  const queryParams = [];
  // 2 - Start the query with all information that comes before the WHERE clause
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  `;

  // Array to store conditions for the WHERE clause
  const whereFilters = [];
  const havingFilters = [];

  // 3 FILTERS
  // Filter by city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    whereFilters.push(`city LIKE $${queryParams.length}`);
  }

   // Filter by owner_id
   if (options.owner_id) {
    queryParams.push(options.owner_id);
    whereFilters.push(`owner_id = $${queryParams.length}`);
  }

  // Filter by minimum price per night
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100); // Convert dollars to cents
    whereFilters.push(`cost_per_night >= $${queryParams.length}`);
  }

  // Filter by maximum price per night
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100); // Convert dollars to cents
    whereFilters.push(`cost_per_night <= $${queryParams.length}`);
  }

  // Add WHERE clause if there are any filters present in whereFilters array
  if (whereFilters.length > 0) {
    queryString += `WHERE ${whereFilters.join(' AND ')} `;
  }

  // Add GROUP BY clause
  queryString += `GROUP BY properties.id `;

  // Filter by minimum rating (using HAVING clause)
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating)
    havingFilters.push(`avg(property_reviews.rating) >= $${queryParams.length}`);
  }

  // Add HAVING clause if there are any filters present in havingFilters array
  if (havingFilters.length > 0) {
    queryString += `HAVING ${havingFilters.join(' AND ')} `;
  }

  // 4 - Add any query that comes after the HAVING clause
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5 - Run the query
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  return pool
    .query(`
      INSERT INTO properties (
        owner_id, 
        title, 
        description, 
        thumbnail_photo_url, 
        cover_photo_url, 
        cost_per_night, 
        parking_spaces,
        number_of_bathrooms, 
        number_of_bedrooms,
        country,
        street, 
        city, 
        province, 
        post_code 
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )
      RETURNING *;
    `, [
      property.owner_id,
      property.title,
      property.description,
      property.thumbnail_photo_url,
      property.cover_photo_url,
      property.cost_per_night,
      property.parking_spaces,
      property.number_of_bathrooms,
      property.number_of_bedrooms,
      property.country,
      property.street,
      property.city,
      property.province,
      property.post_code
    ])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};

