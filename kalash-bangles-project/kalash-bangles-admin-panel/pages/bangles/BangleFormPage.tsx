
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBangleById, createBangle, updateBangle, getCategories } from '../../services/api';
import { BangleFormData, Category, BangleColorVariant } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import FileUploadInput from '../../components/ui/FileUploadInput';

// Helper to generate a temporary unique ID for new variants in the form
const tempId = <T,>() => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as T;


const BangleFormPage: React.FC = () => {
  const { id: bangleIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(bangleIdParam);

  const [bangle, setBangle] = useState<BangleFormData>({
    id: '',
    name: '',
    categoryId: '',
    price: 0,
    description: '',
    availableSizes: [],
    material: '',
    rating: undefined,
    reviews: undefined,
    baseImageUrl: undefined,
    colorVariants: [],
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [baseImageFile, setBaseImageFile] = useState<File | null>(null);
  const [currentBaseImageUrl, setCurrentBaseImageUrl] = useState<string | undefined>(undefined);
  
  // For variants, we need to track files separately
  const [variantImageFiles, setVariantImageFiles] = useState<Record<string, File | null>>({}); // Keyed by variant.id

  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchBangleAndCategories = useCallback(async () => {
    setLoading(true);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      if (bangleIdParam) {
        const data = await getBangleById(bangleIdParam);
        setBangle({
          id: data.id,
          name: data.name,
          categoryId: data.categoryId,
          price: data.price,
          description: data.description || '',
          availableSizes: data.availableSizes || [],
          material: data.material || '',
          rating: data.rating,
          reviews: data.reviews,
          colorVariants: data.colorVariants.map(v => ({...v, imageUrl: typeof v.imageUrl === 'string' ? v.imageUrl : undefined})), // Store only URL string initially
          // baseImageUrl is handled by currentBaseImageUrl
        });
        setCurrentBaseImageUrl(typeof data.baseImageUrl === 'string' ? data.baseImageUrl : undefined);
         // Initialize current image URLs for variants for FileUploadInput
        data.colorVariants.forEach(variant => {
          if (typeof variant.imageUrl === 'string') {
            // This relies on FileUploadInput handling currentImageUrl itself
          }
        });
      } else {
        // Default category if available
        if (categoriesData.length > 0) {
          setBangle(prev => ({ ...prev, categoryId: categoriesData[0].id }));
        }
      }
    } catch (err) {
      setFormError((err as Error).message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }, [bangleIdParam]);

  useEffect(() => {
    fetchBangleAndCategories();
  }, [fetchBangleAndCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "price" || name === "rating" || name === "reviews") {
      setBangle(prev => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
    } else if (name === "availableSizes") {
      setBangle(prev => ({ ...prev, [name]: value.split(',').map(s => s.trim()).filter(s => s) }));
    } else {
      setBangle(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBaseImageChange = (file: File | null) => setBaseImageFile(file);

  const handleVariantChange = (variantId: string, field: keyof BangleColorVariant, value: string | File | undefined) => {
    setBangle(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map(v => 
        v.id === variantId ? { ...v, [field]: value } : v
      )
    }));
  };
  
  const handleVariantImageChange = (variantId: string, file: File | null) => {
    setVariantImageFiles(prev => ({ ...prev, [variantId]: file }));
    // Update the imageUrl on the variant to reflect the new file for submission logic
    // The FileUploadInput component will show its own preview.
    // The BangleColorVariant's imageUrl should be updated to the File object to be sent.
    setBangle(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.map(v => 
        v.id === variantId ? { ...v, imageUrl: file || (v.imageUrl as string) } : v // keep old URL if file is nullified unless it was never a file
      )
    }));
  };


  const addVariant = () => {
    const newVariant: Omit<BangleColorVariant, 'bangleId'| 'createdAt' | 'updatedAt'> = { 
        id: tempId<string>(), // Temporary ID for form key and local management
        colorName: '', 
        hexColor: '#000000', 
        imageUrl: '' // Will be replaced by File or string URL
    };
    setBangle(prev => ({ ...prev, colorVariants: [...prev.colorVariants, newVariant] }));
  };

  const removeVariant = (variantId: string) => {
    setBangle(prev => ({
      ...prev,
      colorVariants: prev.colorVariants.filter(v => v.id !== variantId)
    }));
    setVariantImageFiles(prev => {
      const { [variantId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    if (!bangle.id.trim() && !isEditing) {
      setFormError("Bangle ID is required for new bangles.");
      setLoading(false);
      return;
    }
    if (!bangle.name.trim()) {
      setFormError("Bangle Name is required.");
      setLoading(false);
      return;
    }
     if (!bangle.categoryId) {
      setFormError("Category is required.");
      setLoading(false);
      return;
    }


    const processedVariants = bangle.colorVariants.map(variant => {
      const imageFile = variantImageFiles[variant.id];
      // If there's a new file, use it. Otherwise, use existing imageUrl (which should be a string URL if it exists and wasn't cleared).
      const imageUrl = imageFile || (typeof variant.imageUrl === 'string' ? variant.imageUrl : ''); 
      return { ...variant, imageUrl };
    });

    const dataToSubmit: BangleFormData = {
      ...bangle,
      baseImageUrl: baseImageFile || (isEditing ? currentBaseImageUrl : undefined),
      colorVariants: processedVariants,
    };

    try {
      if (isEditing && bangleIdParam) {
        const { id, ...updateData } = dataToSubmit; // Exclude 'id' from body for PUT
        await updateBangle(bangleIdParam, updateData);
      } else {
        await createBangle(dataToSubmit);
      }
      navigate('/bangles');
    } catch (err) {
      setFormError((err as Error).message || `Failed to ${isEditing ? 'update' : 'create'} bangle.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !bangle.name && isEditing) return <LoadingSpinner />;
  
  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">{isEditing ? 'Edit Bangle' : 'Add New Bangle'}</h1>
      {formError && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{formError}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Bangle ID" id="id" name="id" value={bangle.id} onChange={handleChange} required disabled={isEditing} placeholder="e.g., kundan001"/>
          <Input label="Name" id="name" name="name" value={bangle.name} onChange={handleChange} required placeholder="e.g., Royal Kundan Set"/>
          <Select label="Category" id="categoryId" name="categoryId" value={bangle.categoryId} onChange={handleChange} options={categoryOptions} required placeholder="Select a category"/>
          <Input label="Price" id="price" name="price" type="number" step="0.01" value={bangle.price} onChange={handleChange} required />
          <Input label="Available Sizes (comma-separated)" id="availableSizes" name="availableSizes" value={bangle.availableSizes.join(', ')} onChange={handleChange} placeholder="e.g., 2.2, 2.4, 2.6"/>
          <Input label="Material" id="material" name="material" value={bangle.material || ''} onChange={handleChange} placeholder="e.g., Kundan Stones, Alloy"/>
          <Input label="Rating (0-5)" id="rating" name="rating" type="number" step="0.1" min="0" max="5" value={bangle.rating || ''} onChange={handleChange}/>
          <Input label="Reviews Count" id="reviews" name="reviews" type="number" value={bangle.reviews || ''} onChange={handleChange}/>
        </div>

        <Textarea label="Description" id="description" name="description" value={bangle.description || ''} onChange={handleChange} placeholder="Detailed description of the bangle"/>
        
        <FileUploadInput id="baseImageUrl" label="Base Bangle Image" onChange={handleBaseImageChange} currentImageUrl={currentBaseImageUrl}/>

        <div className="pt-4 border-t mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Color Variants</h2>
          {bangle.colorVariants.map((variant, index) => (
            <div key={variant.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border p-4 rounded-md mb-4 relative">
               <Input label="Variant ID" id={`variant_id_${variant.id}`} name="id" value={variant.id} 
                onChange={(e) => handleVariantChange(variant.id, 'id', e.target.value)} 
                disabled={!variant.id.startsWith('temp_')} /* Allow editing for new, disable for existing from DB */
                placeholder="e.g., k001-red"
                containerClassName="mb-0"
                required
              />
              <Input label="Color Name" id={`variant_colorName_${variant.id}`} name="colorName" value={variant.colorName} 
                onChange={(e) => handleVariantChange(variant.id, 'colorName', e.target.value)} 
                containerClassName="mb-0"
                placeholder="e.g., Ruby Red"
                required
              />
              <Input label="Hex Color" id={`variant_hexColor_${variant.id}`} name="hexColor" type="color" value={variant.hexColor || '#000000'} 
                onChange={(e) => handleVariantChange(variant.id, 'hexColor', e.target.value)} 
                containerClassName="mb-0"
              />
              <FileUploadInput 
                id={`variant_imageUrl_${variant.id}`} 
                label="Variant Image" 
                onChange={(file) => handleVariantImageChange(variant.id, file)} 
                currentImageUrl={typeof variant.imageUrl === 'string' ? variant.imageUrl : undefined}
                containerClassName="md:col-span-3"
              />
              <Button type="button" variant="danger" size="sm" onClick={() => removeVariant(variant.id)} className="absolute top-2 right-2 px-2 py-1">
                <i className="fas fa-times"></i>
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addVariant} icon="fas fa-plus">Add Variant</Button>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button type="button" variant="secondary" onClick={() => navigate('/bangles')} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="primary" isLoading={loading} disabled={loading}>
            {isEditing ? 'Save Changes' : 'Create Bangle'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BangleFormPage;

