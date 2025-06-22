
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getBangles, deleteBangle, getCategories } from '../../services/api';
import { Bangle, Category } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const BangleListPage: React.FC = () => {
  const [bangles, setBangles] = useState<Bangle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [bangleToDelete, setBangleToDelete] = useState<Bangle | null>(null);

  const fetchBanglesAndCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [banglesData, categoriesData] = await Promise.all([
        getBangles(selectedCategoryId || undefined),
        getCategories()
      ]);
      setBangles(banglesData);
      setCategories(categoriesData);
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    fetchBanglesAndCategories();
  }, [fetchBanglesAndCategories]);

  const handleDeleteClick = (bangle: Bangle) => {
    setBangleToDelete(bangle);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bangleToDelete) return;
    try {
      await deleteBangle(bangleToDelete.id);
      setBangles(prev => prev.filter(b => b.id !== bangleToDelete.id));
      setShowDeleteModal(false);
      setBangleToDelete(null);
    } catch (err) {
      setError((err as Error).message || 'Failed to delete bangle.');
      console.error(err);
    }
  };
  
  const categoryOptions = [{ value: '', label: 'All Categories' }, ...categories.map(c => ({ value: c.id, label: c.name }))];

  if (loading && bangles.length === 0) return <LoadingSpinner />; // Initial load spinner
  if (error) return <div className="text-red-500 p-4 bg-red-100 rounded-md">Error: {error} <Button onClick={fetchBanglesAndCategories} variant="secondary" size="sm">Retry</Button></div>;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Bangles</h1>
        <div className="flex items-center gap-4">
          <Select
            options={categoryOptions}
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            containerClassName="mb-0 w-48"
          />
          <Button as={Link} to="/bangles/new" variant="primary" icon="fas fa-plus">
            Add Bangle
          </Button>
        </div>
      </div>
      
      {loading && <LoadingSpinner size="sm"/>}
      {!loading && bangles.length === 0 ? (
        <p className="text-gray-500">No bangles found for the selected criteria. <Link to="/bangles/new" className="text-pink-600 hover:underline">Add one now!</Link></p>
      ) : !loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bangles.map((bangle) => (
                <tr key={bangle.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bangle.baseImageUrl && typeof bangle.baseImageUrl === 'string' && (
                        <img src={bangle.baseImageUrl} alt={bangle.name} className="h-10 w-10 rounded-md object-cover"/>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bangle.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bangle.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categories.find(c => c.id === bangle.categoryId)?.name || bangle.categoryId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{bangle.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button as={Link} to={`/bangles/edit/${bangle.id}`} variant="secondary" size="sm" icon="fas fa-edit" title="Edit"/>
                    <Button onClick={() => handleDeleteClick(bangle)} variant="danger" size="sm" icon="fas fa-trash" title="Delete"/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && bangleToDelete && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Bangle"
          onConfirm={confirmDelete}
          confirmText="Delete"
        >
          <p>Are you sure you want to delete the bangle "<strong>{bangleToDelete.name}</strong>"? This action cannot be undone and will also remove its color variants.</p>
        </Modal>
      )}
    </div>
  );
};

export default BangleListPage;
