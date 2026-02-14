import { query } from "../config/db.js";

export const getUsers = async() => {
    const {rows} = await query('SELECT * FROM users');
    return rows;
}

export const createUser = async(userData) => {

    const { name, email } = userData;
    const {rows} = await query
    (
        `INSERT INTO users (name, email)
        VALUES ($1, $2) RETURNING *
        `,
        [name, email]
    );
    return rows[0];
}

export const updateUser = async(userData, userId) => {

    const { name, email } = userData;
    const {rows} = await query
    (
        `UPDATE users SET name = $1, email = $2
         WHERE id = $3 RETURNING *`,
        [name, email, userId]
    );
    return rows[0];
}

export const deleteUser = async(userId) => {
    const { rowCount } = await query(`DELETE FROM users WHERE id = $1`, [userId]);
    return rowCount > 0;
}

export const searchUser = async(searchTerm) => {
    const { rows } = await query(
        `SELECT * FROM users WHERE name ILIKE $1 OR email ILIKE $1`,
        [`%${searchTerm}%`]
    );
    return rows;
}