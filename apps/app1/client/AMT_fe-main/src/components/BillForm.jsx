import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import toast from 'react-hot-toast';
import Header from './Header';
import Sidebar from './Sidebar';

const BillForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGST, setCustomerGST] = useState(''); // Optional GST field
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0, a_id: '' }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const companyName = sessionStorage.getItem('company_name');

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateTotalAmount(); // Recalculate total amount whenever items change
  }, [items]);

  const fetchData = async () => {
    try {
      const res = await AxiosService.get(ApiRoutes.ASSETS.path, {
        authenticate: ApiRoutes.ASSETS.authenticate,
      });
      if (res.status === 200) {
        const filteredAssets = res.data.assets.filter(
          (asset) => asset.company_name === companyName
        );
        setData(filteredAssets); 
      }
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleRequestError = (error) => {
    toast.error(error.response?.data?.message || error.message);
    if (error.response?.status === 402) {
      logout();
    }
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0, a_id: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'name') {
      const selectedItem = data.find((item) => item.a_name === value);
      if (selectedItem) {
        newItems[index].price = selectedItem.without_GST;
        newItems[index].a_id = selectedItem.a_id;
      } else {
        newItems[index].price = 0;
      }
    }

    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const calculateTotalAmount = () => {
    const total = items.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);
    setTotalAmount(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !customerAddress) {
      setError('Customer name and address are required.');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].name || items[i].quantity <= 0 || items[i].price < 0) {
        setError('Each item must have a valid name, quantity, and price.');
        return;
      }
    }

    const billData = {
      customer: {
        customerName,
        customerAddress,
        customerGST: customerGST || undefined, // Optional GST field
      },
      company_name:companyName,
      items: items,
      totalAmount: totalAmount,
    };

    try {
      const res = await AxiosService.post(ApiRoutes.Billform.path, billData, {
        authenticate: ApiRoutes.Billform.authenticate,
        responseType: 'blob',  // Add this to handle binary data
      });

      if (res.status === 200) {
        // Reset form fields
        setCustomerName('');
        setCustomerAddress('');
        setCustomerGST(''); 
        setItems([{ name: '', quantity: 1, price: 0, a_id: '' }]);
        setError('');
        setTotalAmount(0);
        toast.success('Bill generated successfully!');

        // Automatically download the PDF
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${Date.now()}.pdf`); // Set the filename
        document.body.appendChild(link);
        link.click(); // Trigger the download
        link.parentNode.removeChild(link); // Clean up the DOM
      }
    } catch (error) {
      handleRequestError(error);
    }
  };

  return (
    <>
    <div className='grid-container'>
    <Header OpenSidebar={toggleSidebar} /> 

      <Sidebar openSidebarToggle={openSidebarToggle} />
    <div className="bill-form-container">
      <h2>Generate Bill</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="customerName">
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            required
          />
        </Form.Group>

        <Form.Group controlId="customerAddress">
          <Form.Label>Customer Address</Form.Label>
          <Form.Control
            type="text"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            placeholder="Enter customer address"
            required
          />
        </Form.Group>

        <Form.Group controlId="customerGST">
          <Form.Label>Customer GST (Optional)</Form.Label>
          <Form.Control
            type="text"
            value={customerGST}
            onChange={(e) => setCustomerGST(e.target.value)}
            placeholder="Enter customer GST"
          />
        </Form.Group>

        <h4>Items</h4>
        {items.map((item, index) => (
          <Card key={index} className="item-card mb-3">
            <Card.Body>
              <Row>
                <Col>
                  <Form.Group controlId={`itemName-${index}`}>
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                      type="text"
                      list="item-options"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder="Enter item name"
                      required
                    />
                    <datalist id="item-options">
                      {data.map((asset) => (
                        <option key={asset.a_id} value={asset.a_name} />
                      ))}
                    </datalist>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group controlId={`itemQuantity-${index}`}>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      placeholder="Enter quantity"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group controlId={`itemPrice-${index}`}>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                      placeholder="Enter price"
                    />
                  </Form.Group>
                </Col>

                <Col className="d-flex align-items-center">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveItem(index)}
                    className="ml-2"
                    style={{ height: '100%' }}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}

        <Button variant="secondary" onClick={handleAddItem} className="mb-3">
          Add Item
        </Button>

        <Form.Group>
          <Form.Label>Total Amount</Form.Label>
          <Form.Control
            type="text"
            value={`$${totalAmount.toFixed(2)}`}
            readOnly
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Generate Bill
        </Button>
      </Form>
    </div>
    </div>
    </>
  );
};

export default BillForm;
