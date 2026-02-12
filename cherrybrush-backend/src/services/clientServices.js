import { query } from "../db.js";

export const getClients = async() => {
    const {rows} = await query('SELECT * FROM demo_tb');
    return rows;
}

export const createClients = async(clientData) => {

    const { name, email, job, rate, isactive } = clientData
    const {rows} = await query
    (
        `INSERT INTO demo_tb (name, email, job, rate, isactive)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
        `,
        [name, email, job, rate, isactive]
    );
    return rows[0];
}