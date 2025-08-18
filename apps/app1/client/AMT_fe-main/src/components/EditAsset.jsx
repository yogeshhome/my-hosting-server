import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import toast from 'react-hot-toast';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';

function EditAsset() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assetData, setAssetData] = useState({
    a_name: '',
    b_name: '',
    a_id: '',
    purchase_price: '',
    selling_price: '',
    a_stock: '',
    a_position: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssetData();
  }, []);

  const fetchAssetData = async () => {
    setLoading(true);
    try {
      const res = await AxiosService.get(`${ApiRoutes.GetAssetById.path.replace(':id', id)}`, {
        authenticate: ApiRoutes.GetAssetById.authenticate
      });

      if (res.status === 200) {
        const data = res.data;
        const defaultAssetData = {
          a_name: data.asset.a_name,
          b_name: data.asset.b_name,
          a_id: data.asset.a_id,
          purchase_price: data.asset.purchase_price,
          selling_price: data.asset.selling_price,
          a_stock: data.asset.a_stock,
          a_position: data.asset.a_position
        };
        setAssetData(defaultAssetData);
      }
    } catch (error) {
      console.error("Failed to fetch asset data:", error);
      toast.error("Failed to fetch asset data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAsset = async (e) => {
    e.preventDefault();

    if (!assetData.a_name || !assetData.b_name || !assetData.purchase_price || !assetData.selling_price || !assetData.a_stock || !assetData.a_position) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      const res = await AxiosService.put(`${ApiRoutes.EditAsset.path.replace(':id', id)}`, data, {
        authenticate: ApiRoutes.EditAsset.authenticate
      });

      if (res.status >= 200 && res.status < 300) {
        toast.success("Asset edited successfully");
        navigate('/inventory');
      } else {
        toast.error("Failed to edit asset");
      }
    } catch (error) {
      console.error("Edit request failed:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading asset data...</div>;

  return (
    <div className='loginWrapper'>
      <div className='loginHeader'>
        <h2>Edit Asset</h2>
      </div>
      <Form onSubmit={handleEditAsset}>
        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Asset Name" name='a_name' value={assetData.a_name} onChange={(e) => setAssetData({ ...assetData, a_name: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Brand Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Brand Name" name='b_name' value={assetData.b_name} onChange={(e) => setAssetData({ ...assetData, b_name: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Asset ID</Form.Label>
          <Form.Control type="number" placeholder="Enter Asset ID" name='a_id' value={assetData.a_id} readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Purchase Price</Form.Label>
          <Form.Control type="number" placeholder="Enter Purchase Price" name='purchase_price' value={assetData.purchase_price} onChange={(e) => setAssetData({ ...assetData, purchase_price: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Selling Price</Form.Label>
          <Form.Control type="number" placeholder="Enter Selling Price" name='selling_price' value={assetData.selling_price} onChange={(e) => setAssetData({ ...assetData, selling_price: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Available Asset</Form.Label>
          <Form.Control type="number" placeholder="Enter Available Asset Quantity" name='a_stock' value={assetData.a_stock} onChange={(e) => setAssetData({ ...assetData, a_stock: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Asset Position</Form.Label>
          <Form.Control type="number" placeholder="Enter Asset Position" name='a_position' value={assetData.a_position} onChange={(e) => setAssetData({ ...assetData, a_position: e.target.value })} />
        </Form.Group>

        <Button className='button' variant="primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </div>
  );
}

export default EditAsset;
