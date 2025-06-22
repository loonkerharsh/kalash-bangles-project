
// utils/urlHelpers.js
const getFullImageUrl = (relativePath) => {
  if (!relativePath || typeof relativePath !== 'string') {
    return null;
  }
  // Ensure relativePath starts with a slash if it's meant to be from the root of public/images
  // Or handle if it already includes /images/
  let path = relativePath;
  if (path.startsWith('public/')) { // if path was stored like public/images/...
    path = path.substring('public/'.length);
  } else if (path.startsWith('/public/')) {
     path = path.substring('/public/'.length);
  }
  
  if (!path.startsWith('/images') && !path.startsWith('images/')) {
    path = `/images/${path}`; // Default to /images if not specified
  } else if (path.startsWith('images/')) {
    path = `/${path}`;
  }


  return `${process.env.API_URL}${path}`;
};

const mapCategoryToResponse = (category) => {
  if (category.imageUrl) {
    category.imageUrl = getFullImageUrl(category.imageUrl);
  }
  return category;
};

const mapBangleToResponse = (bangle) => {
  if (bangle.baseImageUrl) {
    bangle.baseImageUrl = getFullImageUrl(bangle.baseImageUrl);
  }
  if (bangle.colorVariants && Array.isArray(bangle.colorVariants)) {
    bangle.colorVariants = bangle.colorVariants.map(variant => {
      if (variant.imageUrl) {
        variant.imageUrl = getFullImageUrl(variant.imageUrl);
      }
      return variant;
    });
  }
  return bangle;
};


module.exports = { getFullImageUrl, mapCategoryToResponse, mapBangleToResponse };
