import './BillingPage.scss';
import { useState } from 'react';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import ShopInput from '../components/ShopInput';
import ShopTables, { type ShopTableProps } from '../components/ShopTables';
import ShopButton from '../assets/ShopButton';

const dummyProducts = [
  { serialNumber: 'SN-1001', productName: 'Quantum Laptop Pro', quantity: 100, rate: 500 },
  { serialNumber: 'SN-1002', productName: 'Quantum Laptop Air', quantity: 100, rate: 450 },
  { serialNumber: 'SN-2001', productName: 'Nebula Smartphone X', quantity: 100, rate: 300 },
  { serialNumber: 'SN-2002', productName: 'Nebula Smartphone Y', quantity: 100, rate: 280 },
  { serialNumber: 'SN-3001', productName: 'Galaxy Tablet 10', quantity: 100, rate: 250 },
  { serialNumber: 'SN-3002', productName: 'Galaxy Tablet 8', quantity: 100, rate: 220 },
  { serialNumber: 'SN-4001', productName: 'Pulse Wireless Earbuds', quantity: 100, rate: 50 },
  { serialNumber: 'SN-4002', productName: 'Pulse Wireless Headphones', quantity: 100, rate: 70 },
  { serialNumber: 'SN-5001', productName: 'Aurora Smart Watch', quantity: 100, rate: 120 },
  { serialNumber: 'SN-5002', productName: 'Aurora Fitness Tracker', quantity: 100, rate: 90 }
];

const BillingPage = () => {
  const tableColumns: ShopTableProps['tableColumns'] = [
    { key: 'action', header: '', width: '05%', alignment: 'center' },
    { key: 'serial', header: 'SKUN', width: '10%', alignment: 'left' },
    { key: 'product', header: 'Product', width: '45%', alignment: 'left' },
    { key: 'rate', header: 'Rate', width: '10%', alignment: 'right' },
    { key: 'quantity', header: 'Quantity', width: '10%', alignment: 'right' },
    { key: 'total', header: 'Value', width: '20%', alignment: 'right' },
  ];

  const [productInput, setProductInput] = useState('');
  const [indexInput, setIndexInput] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [tableRowData, setTableRowData] = useState<any[]>([]);

  // Filter and sort index based on input
  const filteredIndex = indexInput
    ? dummyProducts
        .filter((product) =>
          product.serialNumber.toLowerCase().includes(indexInput.toLowerCase())
        )
        .sort((a, b) => a.serialNumber.localeCompare(b.serialNumber))
        .map((p) => ({
          value: p.serialNumber,
          label: p.serialNumber,
        }))
    : [];

  const filteredProducts = productInput
    ? dummyProducts
        .filter((product) =>
          product.productName.toLowerCase().includes(productInput.toLowerCase())
        )
        .sort((a, b) => a.productName.localeCompare(b.productName))
        .map((p) => ({
          value: p.productName,
          label: p.productName,
        }))
    : [];

  const handleIndexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIndexInput(value);

    // Find product by serial number and set the other i.e. product name
    const found = dummyProducts.find(
      (product) => product.serialNumber.toLowerCase() === value.toLowerCase()
    );
    setProductInput(found ? found.productName : '');
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductInput(value);

    // Find product by name and set the other i.e. serial number
    const found = dummyProducts.find(
      (product) => product.productName.toLowerCase() === value.toLowerCase()
    );
    setIndexInput(found ? found.serialNumber : '');
  };

  const handleAddBtnClick = () => {
    const selectedProduct = dummyProducts.find(
      (p) => p.serialNumber === indexInput && p.productName === productInput
    );
    if (!selectedProduct) {
      alert('Please select a valid product.');
      return;
    }
    if (!customerName || !mobileNumber || !productQuantity) {
      alert('Please fill all fields.');
      return;
    }
    const newRow = {
      customerName,
      mobileNumber,
      serial: selectedProduct.serialNumber,
      product: selectedProduct.productName,
      rate: selectedProduct.rate,
      quantity: Number(productQuantity),
      total: selectedProduct.rate * Number(productQuantity),
    };
    setTableRowData((prev) => [...prev, newRow]);
    setProductInput('');
    setIndexInput('');
    setProductQuantity('');
  };

  return (
    <div>
      <Header />
      <LeftPanel />
      <div className='billingPage'>
        <div className='billingPage__title'>Customer Billing</div>
        <div className='billingPage__form-grid'>
          <ShopInput
            elementType={'input'}
            labelText={'Customer Name'}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <ShopInput
            elementType={'quantity'}
            labelText={'Mobile Number'}
            dataType={'mobile'}
            placeholder={'Enter mobile number'}
            maxLength={10}
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <ShopInput
            elementType={'dropdown'}
            labelText={'Product Index'}
            value={indexInput}
            onChange={handleIndexInputChange}
            dropdownOptions={filteredIndex}
            dataType={'dropdown'}
            disabled={false}
          />
          <ShopInput
            elementType={'dropdown'}
            labelText={'Product Name'}
            value={productInput}
            onChange={handleProductInputChange}
            dropdownOptions={filteredProducts}
            dataType={'dropdown'}
            disabled={false}
          />
          <ShopInput
            elementType={'quantity'}
            labelText={'Product Quantity'}
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
          />
          <ShopButton
            text={'Add'}
            disabled={false}
            onClick={handleAddBtnClick}
          />
        </div>
        <div className='billingPage__table'>
          <ShopTables tableColumns={tableColumns} tableData={tableRowData} />
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
