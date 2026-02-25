import oracledb from 'oracledb';
import fs from 'fs';
import path from 'path';

// Initialize Oracle client
oracledb.initOracleClient({ libDir: process.env.ORACLE_LIB_DIR });

// Wallet configuration
process.env.TNS_ADMIN = '/opt/apex/wallet';

export async function getConnection() {
    return await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectionString: process.env.DB_CONNECTION_STRING
    });
}

// Example query function
export async function query(sql, params = []) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
          }
