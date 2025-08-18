import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import toast from 'react-hot-toast';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';

function AddAssets() {
  const navigate = useNavigate();

  const handleChangeAdd = async (e) => {
    e.preventDefault();
    try {
      const company_name = sessionStorage.getItem('company_name'); // Get company name from session storage

    if (!company_name) {
      toast.error("Company name is required");
      return;
    }
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      data.company_name = company_name;

      if (data.a_id) {
        const res = await AxiosService.post(ApiRoutes.AddAsset.path, data, {
          authenticate: ApiRoutes.AddAsset.authenticate
        });

        if (res.status === 201) {
          toast.success("Asset added successfully");
          navigate('/inventory');
          return; 
        }
      }

      toast.error("Failed to add asset");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='loginWrapper'>
      <div className='loginHeader'>
        <h2>New Asset</h2>
      </div>
      <Form onSubmit={handleChangeAdd}>
        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Asset Name" name='a_name' />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Brand Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Brand Name" name='b_name' />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Asset ID</Form.Label>
          <Form.Control type="number" placeholder="Enter Asset ID" name='a_id' />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Purchase Price </Form.Label>
          <Form.Control type="number" placeholder="Enter Purchase Price" name='purchase_price' />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Selling Price</Form.Label>
          <Form.Control type="number" placeholder="Enter Selling Price" name='selling_price' />
        </Form.Group>

        

        <Form.Group className="mb-3">
          <Form.Label>Available Asset</Form.Label>
          <Form.Control type="number" placeholder="Enter Available Asset Quantity" name='a_stock' />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Asset Position</Form.Label>
          <Form.Control type="number" placeholder="Enter Asset Position" name='a_position' />
        </Form.Group>

        

        <Button className='button' variant="primary" type="submit">
          Add Asset
        </Button>
      </Form>
    </div>
  );
}

export default AddAssets;
