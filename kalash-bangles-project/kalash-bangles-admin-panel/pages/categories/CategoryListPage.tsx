
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, deleteCategory } from '../../services/api';
import { Category } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import Button from '../../components/ui/Button';

const CategoryListPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch categories.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id);
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err) {
      setError((err as Error).message || 'Failed to delete category.');
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4 bg-red-100 rounded-md">Error: {error} <Button onClick={fetchCategories} variant="secondary" size="sm">Retry</Button></div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
        <Button as={Link} to="/categories/new" variant="primary" icon="fas fa-plus">
          Add Category
        </Button>
      </div>
      
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories found. <Link to="/categories/new" className="text-pink-600 hover:underline">Add one now!</Link></p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.imageUrl && typeof category.imageUrl === 'string' && (
                        <img src={category.imageUrl} alt={category.name} className="h-10 w-10 rounded-md object-cover"/>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{category.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button as={Link} to={`/categories/edit/${category.id}`} variant="secondary" size="sm" icon="fas fa-edit" title="Edit"/>
                    <Button onClick={() => handleDeleteClick(category)} variant="danger" size="sm" icon="fas fa-trash" title="Delete"/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && categoryToDelete && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Category"
          onConfirm={confirmDelete}
          confirmText="Delete"
        >
          <p>Are you sure you want to delete the category "<strong>{categoryToDelete.name}</strong>"? This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
};

export default CategoryListPage;
