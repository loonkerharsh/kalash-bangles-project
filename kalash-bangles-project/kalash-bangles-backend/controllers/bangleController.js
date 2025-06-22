
const pool = require('../db');
const { mapBangleToResponse } = require('../utils/urlHelpers');
const fs = require('fs');
const path = require('path');

// Helper to delete image file
const deleteImageFile = (filePath) => {
  if (filePath) {
    const fullPath = path.join(__dirname, '..', filePath.startsWith('public') ? filePath : `public${filePath}`);
    fs.unlink(fullPath, (err) => {
      if (err) console.error(`Failed to delete image: ${fullPath}`, err);
      else console.log(`Deleted image: ${fullPath}`);
    });
  }
};

const getBangleWithVariants = async (bangleId) => {
  const [bangleRows] = await pool.query('SELECT * FROM bangles WHERE id = ?', [bangleId]);
  if (bangleRows.length === 0) return null;

  const bangle = bangleRows[0];
  if (bangle.availableSizes && typeof bangle.availableSizes === 'string') {
    try {
      bangle.availableSizes = JSON.parse(bangle.availableSizes);
    } catch (e) {
      console.error('Failed to parse availableSizes JSON for bangleId:', bangleId, e);
      bangle.availableSizes = []; // Default to empty array on parse error
    }
  } else if (!bangle.availableSizes) {
    bangle.availableSizes = [];
  }


  const [variantRows] = await pool.query('SELECT * FROM bangle_color_variants WHERE bangleId = ? ORDER BY createdAt ASC', [bangleId]);
  bangle.colorVariants = variantRows;
  return mapBangleToResponse(bangle);
};

exports.getAllBangles = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    let query = 'SELECT * FROM bangles';
    const queryParams = [];

    if (categoryId) {
      query += ' WHERE categoryId = ?';
      queryParams.push(categoryId);
    }
    query += ' ORDER BY name ASC';

    const [bangles] = await pool.query(query, queryParams);

    const detailedBangles = await Promise.all(
      bangles.map(bangle => getBangleWithVariants(bangle.id))
    );
    res.json(detailedBangles.filter(b => b !== null));
  } catch (err) {
    next(err);
  }
};

exports.getBangleById = async (req, res, next) => {
  try {
    const { bangleId } = req.params;
    const bangle = await getBangleWithVariants(bangleId);
    if (!bangle) {
      return res.status(404).json({ error: 'Bangle not found' });
    }
    res.json(bangle);
  } catch (err) {
    next(err);
  }
};

// Helper function to process uploaded files from req.files (from upload.any())
const getFileByFieldName = (files, fieldName) => {
  return files.find(f => f.fieldname === fieldName);
};

// Helper to clean up all uploaded files in case of error during create/update
const cleanupUploadedFilesOnError = (files) => {
  if (files && Array.isArray(files)) {
    files.forEach(file => deleteImageFile(file.path));
  }
};

exports.createBangle = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { 
      id, name, categoryId, price, description, material, rating, reviews
    } = req.body;
    let { availableSizes, colorVariants } = req.body; // colorVariants will be JSON strings

    if (!id || !name || !categoryId || price === undefined) {
      cleanupUploadedFilesOnError(req.files);
      return res.status(400).json({ error: 'Bangle ID, Name, Category ID, and Price are required.' });
    }

    const [existingIdRows] = await connection.query('SELECT id FROM bangles WHERE id = ?', [id]);
    if (existingIdRows.length > 0) {
        cleanupUploadedFilesOnError(req.files);
        return res.status(409).json({ error: `Bangle with ID '${id}' already exists.` });
    }

    let baseImageUrl = null;
    const baseImageFile = getFileByFieldName(req.files, 'baseImageFile');
    if (baseImageFile) {
      baseImageUrl = baseImageFile.path.substring(baseImageFile.path.indexOf('public') + 'public'.length).replace(/\\\\/g, '/');
    }

    if (typeof availableSizes === 'string') { // Frontend sends JSON stringified array
        try {
            availableSizes = JSON.parse(availableSizes);
        } catch(e) {
            console.warn("Failed to parse availableSizes for new bangle:", e);
            availableSizes = []; // default or handle error
        }
    } else if (!Array.isArray(availableSizes)) {
        availableSizes = [];
    }


    await connection.query(
      'INSERT INTO bangles (id, name, categoryId, price, baseImageUrl, description, availableSizes, material, rating, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, categoryId, parseFloat(price), baseImageUrl, description, JSON.stringify(availableSizes), material, rating ? parseFloat(rating) : null, reviews ? parseInt(reviews) : null]
    );

    // Process color variants
    // Frontend sends colorVariants as an array of objects (stringified by FormData).
    // We need to reconstruct this array.
    // Example: colorVariants[0][id], colorVariants[0][colorName], colorVariants[0][imageFile]
    
    const submittedVariants = [];
    let i = 0;
    while(req.body[`colorVariants[${i}][id]`]) {
        const variantId = req.body[`colorVariants[${i}][id]`];
        const variantColorName = req.body[`colorVariants[${i}][colorName]`];
        const variantHexColor = req.body[`colorVariants[${i}][hexColor]`];
        
        let variantImageUrl = req.body[`colorVariants[${i}][imageUrl]`] || null; // Existing URL if sent
        const variantImageFile = getFileByFieldName(req.files, `colorVariants[${i}][imageFile]`);

        if (variantImageFile) {
            variantImageUrl = variantImageFile.path.substring(variantImageFile.path.indexOf('public') + 'public'.length).replace(/\\\\/g, '/');
        }
        
        if (!variantId || !variantColorName ) { //imageUrl is not strictly required if variantImageFile is uploaded
             // If imageUrl is also null AND no file, then it might be an issue depending on requirements
            // For now, ID and ColorName are key for a variant.
            console.warn(`Skipping variant index ${i} due to missing ID or ColorName.`);
            i++;
            continue;
        }

        submittedVariants.push({
            id: variantId,
            bangleId: id, // Link to the main bangle
            colorName: variantColorName,
            hexColor: variantHexColor,
            imageUrl: variantImageUrl
        });
        i++;
    }


    for (const variant of submittedVariants) {
      const [existingVariantIdRows] = await connection.query('SELECT id FROM bangle_color_variants WHERE id = ?', [variant.id]);
      if (existingVariantIdRows.length > 0) {
          cleanupUploadedFilesOnError(req.files);
          //This is a problem if variant IDs are not globally unique.
          //Assuming variant IDs are unique like 'k001-red' and are checked for existence.
          return res.status(409).json({ error: `Bangle color variant with ID '${variant.id}' already exists.` });
      }

      await connection.query(
        'INSERT INTO bangle_color_variants (id, bangleId, colorName, hexColor, imageUrl) VALUES (?, ?, ?, ?, ?)',
        [variant.id, variant.bangleId, variant.colorName, variant.hexColor, variant.imageUrl]
      );
    }

    await connection.commit();
    const newBangle = await getBangleWithVariants(id);
    res.status(201).json(newBangle);

  } catch (err) {
    await connection.rollback();
    cleanupUploadedFilesOnError(req.files); // Clean up any files uploaded during the failed transaction
    next(err);
  } finally {
    connection.release();
  }
};

exports.updateBangle = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { bangleId } = req.params;

    const currentBangle = await getBangleWithVariants(bangleId); // Fetches with unmapped image URLs
     if (!currentBangle) {
      cleanupUploadedFilesOnError(req.files);
      return res.status(404).json({ error: 'Bangle not found' });
    }
    
    const { name, categoryId, price, description, material, rating, reviews } = req.body;
    let { availableSizes } = req.body;

    // Base Image Update
    let baseImageUrlToUpdate = currentBangle.baseImageUrl ? currentBangle.baseImageUrl.replace(process.env.API_URL, '') : null; // Keep old if no new file
    const baseImageFile = getFileByFieldName(req.files, 'baseImageFile');
    if (baseImageFile) {
      if (baseImageUrlToUpdate) deleteImageFile(baseImageUrlToUpdate); // Delete old base image
      baseImageUrlToUpdate = baseImageFile.path.substring(baseImageFile.path.indexOf('public') + 'public'.length).replace(/\\\\/g, '/');
    }
    // Note: Frontend might send baseImageUrl as a string if it's unchanged.
    // The logic here prioritizes a new file upload. If no file, it assumes the existing URL (or null) is kept.

    if (typeof availableSizes === 'string') {
        try {
            availableSizes = JSON.parse(availableSizes);
        } catch(e) {
            console.warn("Failed to parse availableSizes for updating bangle:", e);
            availableSizes = currentBangle.availableSizes; // keep old
        }
    } else if (!Array.isArray(availableSizes)) {
        availableSizes = currentBangle.availableSizes; // keep old if not array
    }

    await connection.query(
      'UPDATE bangles SET name = ?, categoryId = ?, price = ?, baseImageUrl = ?, description = ?, availableSizes = ?, material = ?, rating = ?, reviews = ? WHERE id = ?',
      [
        name !== undefined ? name : currentBangle.name,
        categoryId !== undefined ? categoryId : currentBangle.categoryId,
        price !== undefined ? parseFloat(price) : currentBangle.price,
        baseImageUrlToUpdate,
        description !== undefined ? description : currentBangle.description,
        JSON.stringify(availableSizes !== undefined ? availableSizes : currentBangle.availableSizes),
        material !== undefined ? material : currentBangle.material,
        rating !== undefined ? parseFloat(rating) : currentBangle.rating,
        reviews !== undefined ? parseInt(reviews) : currentBangle.reviews,
        bangleId
      ]
    );

    // Color Variants Update Strategy: Delete existing and recreate from payload
    const [oldVariants] = await connection.query('SELECT id, imageUrl FROM bangle_color_variants WHERE bangleId = ?', [bangleId]);
    for (const oldVariant of oldVariants) {
      if (oldVariant.imageUrl) deleteImageFile(oldVariant.imageUrl);
    }
    await connection.query('DELETE FROM bangle_color_variants WHERE bangleId = ?', [bangleId]);

    // Reconstruct variants from request (similar to create)
    const submittedVariants = [];
    let i = 0;
    while(req.body[`colorVariants[${i}][id]`]) {
        const variantId = req.body[`colorVariants[${i}][id]`];
        const variantColorName = req.body[`colorVariants[${i}][colorName]`];
        const variantHexColor = req.body[`colorVariants[${i}][hexColor]`];
        
        // Existing URL might be sent as string if image is not changed.
        let variantImageUrl = req.body[`colorVariants[${i}][imageUrl]`] || null; 
        const variantImageFile = getFileByFieldName(req.files, `colorVariants[${i}][imageFile]`);

        if (variantImageFile) {
             // If a file is uploaded for this variant, it takes precedence.
             // We need to check if an old image under a different URL (if variant ID changed but represents same logical item) needs deletion.
             // Given our "delete all then add" strategy, this specific old image is already handled.
            variantImageUrl = variantImageFile.path.substring(variantImageFile.path.indexOf('public') + 'public'.length).replace(/\\\\/g, '/');
        } else if (typeof variantImageUrl === 'string' && variantImageUrl.startsWith(process.env.API_URL)) {
            // If it's a full URL from frontend for an existing image, convert to relative for DB
            variantImageUrl = variantImageUrl.replace(process.env.API_URL, '');
        }
        
        if (!variantId || !variantColorName) {
            console.warn(`Update: Skipping variant index ${i} due to missing ID or ColorName.`);
            i++;
            continue;
        }

        submittedVariants.push({
            id: variantId,
            bangleId: bangleId,
            colorName: variantColorName,
            hexColor: variantHexColor,
            imageUrl: variantImageUrl
        });
        i++;
    }

    for (const variant of submittedVariants) {
      // Since we deleted all, we just insert. We need to ensure the new variant.id isn't conflicting globally if IDs must be unique.
      // For this system, variant IDs like 'k001-red' are unique per bangle or globally; if globally, check before insert.
      // Here, assume they are only unique within a bangle (or frontend ensures global uniqueness if needed).
       const [existingGlobalVariantIdRows] = await connection.query('SELECT id FROM bangle_color_variants WHERE id = ? AND bangleId != ?', [variant.id, bangleId]);
        if (existingGlobalVariantIdRows.length > 0) {
             // This variant ID is used by another bangle. This is an issue.
             // Depending on design, either variant IDs are scoped to bangle or globally unique.
             // Current DB schema has variant.id as PK, implying global uniqueness.
             console.error(`Error: Variant ID ${variant.id} already exists globally for another bangle.`);
             // To simplify, if this happens, the frontend should ensure unique IDs or the DB structure changes.
             // For now, let's assume frontend provides globally unique variant IDs or that this scenario is rare.
             // We could also auto-generate a new ID if a collision occurs on update, but that complicates things.
        }

      await connection.query(
        'INSERT INTO bangle_color_variants (id, bangleId, colorName, hexColor, imageUrl) VALUES (?, ?, ?, ?, ?)',
        [variant.id, variant.bangleId, variant.colorName, variant.hexColor, variant.imageUrl]
      );
    }
    
    await connection.commit();
    const updatedBangle = await getBangleWithVariants(bangleId);
    res.json(updatedBangle);

  } catch (err) {
    await connection.rollback();
    cleanupUploadedFilesOnError(req.files);
    next(err);
  } finally {
    connection.release();
  }
};


exports.deleteBangle = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { bangleId } = req.params;

    const [bangleRows] = await connection.query('SELECT baseImageUrl FROM bangles WHERE id = ?', [bangleId]);
    if (bangleRows.length === 0) {
      return res.status(404).json({ error: 'Bangle not found' });
    }
    const baseImageUrl = bangleRows[0].baseImageUrl;

    const [variantRows] = await connection.query('SELECT imageUrl FROM bangle_color_variants WHERE bangleId = ?', [bangleId]);

    // ON DELETE CASCADE handles deleting variants from DB. We need to delete files.
    await connection.query('DELETE FROM bangles WHERE id = ?', [bangleId]);
    // Cascade should delete from bangle_color_variants

    if (baseImageUrl) deleteImageFile(baseImageUrl);
    for (const variant of variantRows) {
      if (variant.imageUrl) deleteImageFile(variant.imageUrl);
    }

    await connection.commit();
    res.status(204).send();
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
};
