import { Request, Response } from 'express';
import { poolPromise } from '../database/db'
import sql from 'mssql';

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  const { name, price } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('price', sql.Float, price)
      .query('INSERT INTO products (name, price) OUTPUT inserted.id VALUES (@name, @price)');
    res.status(201).json({ id: result.recordset[0].id, name, price });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Search Products by Name
export const searchProducts = async (req: Request, res: Response) => {
  const { name } = req.query;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVarChar, `%${name}%`)
      .query('SELECT * FROM products WHERE name LIKE @name');
    res.json(result.recordset);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

// Get Paginated Products
export const getPaginatedProducts = async (req: Request, res: Response) => {
  const { page = 1, limit = 5 } = req.query;
  try {
    const pool = await poolPromise;
    const offset = (Number(page) - 1) * Number(limit);
    const result = await pool.request()
      .input('limit', sql.Int, Number(limit))
      .input('offset', sql.Int, offset)
      .query('SELECT * FROM products ORDER BY id OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY');
    res.json(result.recordset);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

// Filter Products by Price Range and Name
export const filterProducts = async (req: Request, res: Response) => {
  const { minPrice = 0, maxPrice = Infinity, name = '' } = req.query;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('minPrice', sql.Float, Number(minPrice))
      .input('maxPrice', sql.Float, Number(maxPrice))
      .input('name', sql.NVarChar, `%${name}%`)
      .query('SELECT * FROM products WHERE price BETWEEN @minPrice AND @maxPrice AND name LIKE @name');
    res.json(result.recordset);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
