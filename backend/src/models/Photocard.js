const pool = require('../config/database');

class Photocard {
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM photocards WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Add filters
    if (filters.group) {
      query += ` AND group_name = $${++paramCount}`;
      params.push(filters.group);
    }
    if (filters.rarity) {
      query += ` AND rarity = $${++paramCount}`;
      params.push(filters.rarity);
    }
    if (filters.age) {
      query += ` AND age = $${++paramCount}`;
      params.push(filters.age);
    }

    // Add sorting
    if (filters.sortBy) {
      const validSortFields = ['name', 'price', 'created_at', 'group_name', 'member', 'album'];
      if (validSortFields.includes(filters.sortBy)) {
        query += ` ORDER BY ${filters.sortBy}`;
        if (filters.sortOrder && filters.sortOrder.toLowerCase() === 'desc') {
          query += ' DESC';
        } else {
          query += ' ASC';
        }
      }
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM photocards WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(photocardData) {
    const {
      name, description, price, image, group, member, album, set, age, rarity, category
    } = photocardData;

    const query = `
      INSERT INTO photocards (name, description, price, image, group_name, member, album, set_name, age, rarity, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const params = [name, description, price, image, group, member, album, set, age, rarity, category];
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async update(id, photocardData) {
    const {
      name, description, price, image, group, member, album, set, age, rarity, category
    } = photocardData;

    const query = `
      UPDATE photocards 
      SET name = $1, description = $2, price = $3, image = $4, group_name = $5, 
          member = $6, album = $7, set_name = $8, age = $9, rarity = $10, category = $11,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `;
    
    const params = [name, description, price, image, group, member, album, set, age, rarity, category, id];
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM photocards WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async bulkDelete(ids) {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
    const query = `DELETE FROM photocards WHERE id IN (${placeholders}) RETURNING *`;
    const result = await pool.query(query, ids);
    return result.rows;
  }
}

module.exports = Photocard;
