const pool = require('../config/database');

class Print {
  static async getAll() {
    const result = await pool.query('SELECT * FROM prints ORDER BY created_at DESC');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM prints WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(printData) {
    const { name, description, price, image, quantity } = printData;

    const query = `
      INSERT INTO prints (name, description, price, image, quantity)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const params = [name, description, price, image, quantity];
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async update(id, printData) {
    const { name, description, price, image, quantity } = printData;

    const query = `
      UPDATE prints 
      SET name = $1, description = $2, price = $3, image = $4, quantity = $5,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    
    const params = [name, description, price, image, quantity, id];
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM prints WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async bulkDelete(ids) {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
    const query = `DELETE FROM prints WHERE id IN (${placeholders}) RETURNING *`;
    const result = await pool.query(query, ids);
    return result.rows;
  }
}

module.exports = Print;
