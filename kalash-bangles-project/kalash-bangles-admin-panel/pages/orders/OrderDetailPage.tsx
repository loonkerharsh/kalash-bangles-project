
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus } from '../../services/api';
import { Order, ORDER_STATUSES } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = Number(id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status'] | ''>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  const fetchOrder = useCallback(async () => {
    if (isNaN(orderId)) {
        setError("Invalid Order ID.");
        setLoading(false);
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
      setNewStatus(data.status); // Initialize select with current status
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch order details.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    if (!order || !newStatus || newStatus === order.status) return;
    setIsUpdatingStatus(true);
    setError(null);
    try {
      const updatedOrder = await updateOrderStatus(order.id!, newStatus as Order['status']);
      setOrder(updatedOrder);
      setNewStatus(updatedOrder.status);
      // Optionally show a success message
    } catch (err) {
      setError((err as Error).message || 'Failed to update order status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4 bg-red-100 rounded-md">Error: {error} <Button onClick={fetchOrder} variant="secondary" size="sm">Retry</Button></div>;
  if (!order) return <div className="text-gray-500">Order not found.</div>;

  const statusOptions = ORDER_STATUSES.map(s => ({ value: s, label: s }));

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Order #{order.id}</h1>
        <Button onClick={() => navigate('/orders')} variant="secondary" icon="fas fa-arrow-left">
            Back to Orders
        </Button>
      </div>

      {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Order Items</h2>
          {order.items && order.items.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {order.items.map(item => (
                <li key={item.id || `${item.bangleId}-${item.colorVariantId}-${item.selectedSize}`} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{item.bangleName} ({item.selectedSize})</p>
                    {item.colorName && <p className="text-sm text-gray-500">Color: {item.colorName}</p>}
                    <p className="text-sm text-gray-500">Qty: {item.quantity} @ ₹{item.priceAtPurchase.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold text-gray-700">₹{(item.quantity * item.priceAtPurchase).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500">No items in this order.</p>}
           <div className="text-right font-bold text-xl text-gray-800 pt-3 border-t">
              Total: ₹{order.totalAmount.toFixed(2)}
           </div>
        </div>

        <div className="space-y-4 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Order Details</h2>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Select
                options={statusOptions}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                containerClassName="my-1"
            />
            <Button onClick={handleStatusUpdate} isLoading={isUpdatingStatus} disabled={isUpdatingStatus || newStatus === order.status} icon="fas fa-save" className="w-full mt-2">
                Update Status
            </Button>
          </div>
          <div>
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="text-gray-800">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Customer Name</p>
            <p className="text-gray-800">{order.customerDetails?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="text-gray-800">{order.customerDetails?.contact || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Shipping Address</p>
            <p className="text-gray-800">{order.customerDetails?.address || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
