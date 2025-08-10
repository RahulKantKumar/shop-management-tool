import './BillingPage.scss';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import ShopInput from '../components/ShopInput';
import ShopTables, { type ShopTableProps } from '../components/ShopTables';
import ShopButton from '../assets/ShopButton';
import EditButton from '../components/EditButton';
import { initialProducts } from '../data/products';

const BillingPage = () => {
  const STORAGE_KEY = 'billingFormState';
  const tableColumns: ShopTableProps['tableColumns'] = [
    { key: 'sno', header: 'S. NO.', width: '10%', alignment: 'left' },
    { key: 'product', header: 'ITEMS', width: '40%', alignment: 'left' },
    { key: 'rate', header: 'RATE', width: '15%', alignment: 'right' },
    { key: 'quantity', header: 'QTY.', width: '10%', alignment: 'right' },
    { key: 'total', header: 'AMOUNT', width: '20%', alignment: 'right' },
    { key: 'action', header: '', width: '05%', alignment: 'center' },
  ];

  const [productInput, setProductInput] = useState('');
  const [indexInput, setIndexInput] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [tableRowData, setTableRowData] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showClearButton, setShowClearButton] = useState(false);
  const [discount, setDiscount] = useState('');
  const grandTotal = tableRowData.reduce(
    (sum, row) => sum + (typeof row.total === 'number' ? row.total : 0),
    0
  );
  const discountValue = parseFloat(discount) || 0;
  const discountedTotal = grandTotal - (grandTotal * discountValue / 100);

  // Load saved form state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setCustomerName(parsed.customerName ?? '');
          setMobileNumber(parsed.mobileNumber ?? '');
          setIndexInput(parsed.indexInput ?? '');
          setProductInput(parsed.productInput ?? '');
          setProductQuantity(parsed.productQuantity ?? '');
          setTableRowData(Array.isArray(parsed.tableRowData) ? parsed.tableRowData : []);
          setEditingIndex(typeof parsed.editingIndex === 'number' ? parsed.editingIndex : null);
        }
      }
    } catch {
      // ignore malformed storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist state on change
  useEffect(() => {
    const payload = {
      customerName,
      mobileNumber,
      indexInput,
      productInput,
      productQuantity,
      tableRowData,
      editingIndex,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore quota issues
    }
  }, [customerName, mobileNumber, indexInput, productInput, productQuantity, tableRowData, editingIndex]);

  const clearAll = () => {
    setCustomerName('');
    setMobileNumber('');
    setIndexInput('');
    setProductInput('');
    setProductQuantity('');
    setTableRowData([]);
    setEditingIndex(null);
    setDiscount('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const handlePrint = () => {
    window.print();
    setShowClearButton(true);
  };

  // Filter and sort index based on input
  const filteredIndex = indexInput
    ? initialProducts
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
    ? initialProducts
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
    const found = initialProducts.find(
      (product) => product.serialNumber.toLowerCase() === value.toLowerCase()
    );
    setProductInput(found ? found.productName : '');
    if (found) {
      setProductQuantity('1');
    }
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductInput(value);

    // Find product by name and set the other i.e. serial number
    const found = initialProducts.find(
      (product) => product.productName.toLowerCase() === value.toLowerCase()
    );
    setIndexInput(found ? found.serialNumber : '');
    if (found) {
      setProductQuantity('1');
    }
  };

  const handleAddBtnClick = () => {
    const selectedProduct = initialProducts.find(
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
    const updatedRow = {
      customerName,
      mobileNumber,
      serial: selectedProduct.serialNumber,
      product: selectedProduct.productName,
      rate: selectedProduct.rate,
      quantity: Number(productQuantity),
      total: selectedProduct.rate * Number(productQuantity),
    };
    if (editingIndex === null) {
      setTableRowData((prev) => [...prev, updatedRow]);
    } else {
      setTableRowData((prev) =>
        prev.map((r, i) => (i === editingIndex ? updatedRow : r))
      );
    }
    setEditingIndex(null);
    setProductInput('');
    setIndexInput('');
    setProductQuantity('');
  };

  const handleEditRow = (idx: number) => {
    const row = tableRowData[idx];
    if (!row) return;
    setEditingIndex(idx);
    setCustomerName(row.customerName || '');
    setMobileNumber(row.mobileNumber || '');
    setIndexInput(row.serial || '');
    setProductInput(row.product || '');
    setProductQuantity(String(row.quantity ?? ''));
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
    if (e.target.value !== '') {
      setShowClearButton(false);
    }
  };

  return (
    <div>
      <Header />
      <LeftPanel />
      <div className='billingPage'>
        <div className='billingPage__title'>Billing</div>
        <div className='billingPage__form-grid'>
          <ShopInput
            elementType={'input'}
            labelText={'Customer Name'}
            value={customerName}
            onChange={handleCustomerNameChange}
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
            labelText={'Product Name'}
            value={productInput}
            onChange={handleProductInputChange}
            dropdownOptions={filteredProducts}
            dataType={'dropdown'}
            disabled={false}
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
            elementType={'quantity'}
            labelText={'Product Quantity'}
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
          />
          <ShopButton
            text={editingIndex === null ? 'Add' : 'Update'}
            disabled={false}
            onClick={handleAddBtnClick}
          />
        </div>
        <div className='billingPage__table'>
          <ShopTables
            tableColumns={tableColumns}
            tableData={tableRowData.map((row, idx) => ({
              ...row,
              sno: idx + 1,
              action: <EditButton onClick={() => handleEditRow(idx)} />,
            }))}
          />
        </div>
        <div className='billingPage__summary'>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label htmlFor='discount-input'>Discount (%):</label>
              <input
                id='discount-input'
                type='number'
                min='0'
                max='100'
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                className='shop-input discount-input'
              />
            </div>
            <div style={{ fontWeight: 600 }}>Total: {discountedTotal}</div>
          </div>
        </div>
        <div className='billingPage__actions' style={{ display: 'flex', gap: 12 }}>
          {showClearButton && (
            <ShopButton text={'Clear'} onClick={clearAll} />
          )}
          <ShopButton text={'Print Bill'} onClick={handlePrint} />
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
