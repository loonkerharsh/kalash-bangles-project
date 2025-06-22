
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategoryById, createCategory, updateCategory } from '../../services/api';
import { Category, CategoryFormData } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import FileUploadInput from '../../components/ui/FileUploadInput';

const CategoryFormPage: React.FC = () => {
  const { id: categoryId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(categoryId);

  const [category, setCategory] = useState<CategoryFormData>({
    id: '',
    name: '',
    description: '',
    imageUrl: undefined,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);


  const fetchCategory = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const data = await getCategoryById(categoryId);
      setCategory({
        id: data.id,
        name: data.name,
        description: data.description || '',
        // imageUrl is handled by FileUploadInput's currentImageUrl
      });
      setCurrentImageUrl(typeof data.imageUrl === 'string' ? data.imageUrl : undefined);
    } catch (err) {
      setFormError((err as Error).message || 'Failed to fetch category details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, [isEditing, fetchCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const dataToSubmit: CategoryFormData = {
      ...category,
      imageUrl: imageFile || (isEditing ? currentImageUrl : undefined), // Pass File or existing URL
    };
    
    // Validate ID for new categories
    if (!isEditing && !dataToSubmit.id.trim()) {
        setFormError("Category ID is required for new categories.");
        setLoading(false);
        return;
    }
     if (!dataToSubmit.name.trim()) {
        setFormError("Category Name is required.");
        setLoading(false);
        return;
    }


    try {
      if (isEditing && categoryId) {
        // For update, don't send ID in body if it's not meant to be changed.
        // The API service for updateCategory might need to be adjusted based on backend expectation.
        // Here, we send all fields. ID is in URL.
        const { id, ...updateData } = dataToSubmit; 
        await updateCategory(categoryId, updateData);
      } else {
        await createCategory(dataToSubmit);
      }
      navigate('/categories');
    } catch (err) {
      setFormError((err as Error).message || `Failed to ${isEditing ? 'update' : 'create'} category.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing && !category.name) return <LoadingSpinner />; // Show spinner on initial load for edit

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">{isEditing ? 'Edit Category' : 'Add New Category'}</h1>
      {formError && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{formError}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Category ID"
          id="id"
          name="id"
          value={category.id}
          onChange={handleChange}
          required
          disabled={isEditing} // ID usually not editable after creation
          placeholder="e.g., kundan, crystal"
        />
        <Input
          label="Category Name"
          id="name"
          name="name"
          value={category.name}
          onChange={handleChange}
          required
          placeholder="e.g., Kundan Bangles"
        />
        <Textarea
          label="Description"
          id="description"
          name="description"
          value={category.description || ''}
          onChange={handleChange}
          placeholder="Brief description of the category"
        />
        <FileUploadInput
          id="imageUrl"
          label="Category Image"
          onChange={handleImageChange}
          currentImageUrl={currentImageUrl}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/categories')} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading} disabled={loading}>
            {isEditing ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryFormPage;
