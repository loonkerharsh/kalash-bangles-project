
const pool = require('../db');
const { mapCategoryToResponse } = require('../utils/urlHelpers');
const fs = require('fs');
const path = require('path');

// Helper to delete image file
const deleteImageFile = (filePath) => {
  if (filePath) {
    // Construct full path relative to project root
    const fullPath = path.join(__dirname, '..', filePath.startsWith('public') ? filePath : `public${filePath}`);
    fs.unlink(fullPath, (err) => {
      if (err) console.error(`Failed to delete image: ${fullPath}`, err);
      else console.log(`Deleted image: ${fullPath}`);
    });
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows.map(mapCategoryToResponse));
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(mapCategoryToResponse(rows[0]));
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { id, name, description } = req.body;
    let imageUrl = null;

    if (!id || !name) {
      return res.status(400).json({ error: 'Category ID and Name are required.' });
    }

    if (req.file) {
      // Store relative path from 'public' folder
      imageUrl = req.file.path.substring(req.file.path.indexOf('public') + 'public'.length).replace(/\\\\/g, '/');
    }
    
    const [existingIdRows] = await pool.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existingIdRows.length > 0) {
        if(req.file) deleteImageFile(req.file.path); // Clean up uploaded file if ID exists
        return res.status(409).json({ error: `Category with ID '${id}' already exists.` });
    }


    const [result] = await pool.query(
      'INSERT INTO categories (id, name, description, imageUrl) VALUES (?, ?, ?, ?)',
      [id, name, description, imageUrl]
    );
    
    // Fetch the created category to return it
    const [newCategoryRows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    res.status(201).json(mapCategoryToResponse(newCategoryRows[0]));
  } catch (err) {
    if (req.file) deleteImageFile(req.file.path); // Clean up uploaded file on error
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body; // ID is not updatable via body here
    let imageUrlToUpdate = undefined; // undefined means don't update image URL in DB

    const [currentCategoryRows] = await pool.query('SELECT imageUrl FROM categories WHERE id = ?', [categoryId]);
    if (currentCategoryRows.length === 0) {
      if (req.file) deleteImageFile(req.file.path); // Clean up uploaded file
      return res.status(404).json({ error: 'Category not found' });
    }
    const currentImageUrl = currentCategoryRows[0].imageUrl;

    if (req.file) {
      // New file uploaded, replace old one
      imageUrlToUpdate = req.file.path.substring(req.file.path.indexOf('public') + 'public'.length).replace(/\\\\/g, '/');
      if (currentImageUrl) {
        deleteImageFile(currentImageUrl); // Delete old image
      }
    } 
    // If frontend sends an empty string for imageUrl (and no file), it could mean "remove image"
    // For now, only updating if new file is provided. To remove, FE must send specific signal.

    let query = 'UPDATE categories SET ';
    const queryParams = [];
    if (name !== undefined) { query += 'name = ?, '; queryParams.push(name); }
    if (description !== undefined) { query += 'description = ?, '; queryParams.push(description); }
    if (imageUrlToUpdate !== undefined) { query += 'imageUrl = ?, '; queryParams.push(imageUrlToUpdate); }
    
    if (queryParams.length === 0) {
      return res.status(304).json({ message: "No changes provided." }); // Not Modified
    }

    query = query.slice(0, -2); // Remove trailing comma and space
    query += ' WHERE id = ?';
    queryParams.push(categoryId);

    await pool.query(query, queryParams);
    
    const [updatedCategoryRows] = await pool.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
    res.json(mapCategoryToResponse(updatedCategoryRows[0]));
  } catch (err) {
    if (req.file) deleteImageFile(req.file.path); // Clean up uploaded file on error
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const [categoryRows] = await pool.query('SELECT imageUrl FROM categories WHERE id = ?', [categoryId]);
    if (categoryRows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const imageUrl = categoryRows[0].imageUrl;

    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [categoryId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found or already deleted' });
    }

    if (imageUrl) {
      deleteImageFile(imageUrl);
    }

    res.status(204).send(); // No Content
  } catch (err) {
    next(err);
  }
};
