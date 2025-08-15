import './BillingPage.scss';
import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import ShopInput from '../components/ShopInput';
import ShopTables, { type ShopTableProps } from '../components/ShopTables';
import ShopButton from '../components/ShopButton';
import EditButton from '../components/EditButton';
import { getProducts } from '../api/products';
import type { Product } from '../data/products';

const API_BASE_URL = 'http://localhost:3000';

const BillingPage = () => {
  const tableColumns: ShopTableProps['tableColumns'] = [
    { key: 'sno', header: 'S. NO.', width: '10%', alignment: 'left' },
    { key: 'product', header: 'ITEMS', width: '40%', alignment: 'left' },
    { key: 'rate', header: 'RATE', width: '15%', alignment: 'right' },
    { key: 'quantity', header: 'QTY.', width: '10%', alignment: 'right' },
    { key: 'total', header: 'AMOUNT', width: '20%', alignment: 'right' },
    { key: 'action', header: '', width: '05%', alignment: 'center' },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const serverProducts = await getProducts();
        const mapped: Product[] = serverProducts.map((sp: any) => ({
          id: String(sp._id ?? sp.id ?? ''),
          productName: sp.name ?? '',
          rate: typeof sp.billingRate === 'number' ? sp.billingRate : 0,
          billingRate: typeof sp.billingRate === 'number' ? sp.billingRate : 0,
          quantity: typeof sp.stock === 'number' ? sp.stock : 0,
          category: sp.category ?? 'General',
          isActive: sp.isActive ?? true,
        })).filter(p => p.id && p.productName);
        setProducts(mapped);
      } catch (err) {
        setProducts([]);
      }
    };
    void loadProducts();
  }, []);

  const [productInput, setProductInput] = useState('');
  const [idInput, setIdInput] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [tableRowData, setTableRowData] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showClearButton, setShowClearButton] = useState(false);
  const [discount, setDiscount] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const debounceTimeout = useRef<number | null>(null);
  const grandTotal = tableRowData.reduce(
    (sum, row) => sum + (typeof row.total === 'number' ? row.total : 0),
    0
  );
  const discountValue = parseFloat(discount) || 0;
  const discountedTotal = grandTotal - (grandTotal * discountValue / 100);

  const clearAll = () => {
    setCustomerName('');
    setMobileNumber('');
    setIdInput('');
    setProductInput('');
    setProductQuantity('');
    setTableRowData([]);
    setEditingIndex(null);
    setDiscount('');
  };

  const handlePrint = () => {
    window.print();
    setShowClearButton(true);
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductInput(value);
    setIdInput('');

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.length < 3) {
      setSearchResults([]);
      return;
    }

    debounceTimeout.current = window.setTimeout(() => {
      fetch(`${API_BASE_URL}/api/products/search?q=${encodeURIComponent(value)}`)
        .then((response) => response.ok ? response.json() : [])
        .then((results) => {
          const mapped: Product[] = Array.isArray(results)
            ? results.map((d: any) => ({
                id: String(d.id ?? d._id ?? ''),
                productName: d.name ?? '',
                rate: typeof d.billingRate === 'number' ? d.billingRate : 0,
                billingRate: typeof d.billingRate === 'number' ? d.billingRate : 0,
                quantity: typeof d.stock === 'number' ? d.stock : 0,
                category: d.category ?? 'General',
                isActive: d.isActive ?? true,
              })).filter(p => p.id && p.productName)
            : [];
          setSearchResults(mapped);
        })
        .catch(() => setSearchResults([]));
    }, 300);
  };

  const handleProductDropdownSelect = (selectedName: string) => {
    setProductInput(selectedName);
    const found = searchResults.find(p => p.productName === selectedName);
    if (found) {
      setIdInput(found.id);
      setProductQuantity('1');
    }
  };

  const handleIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdInput(value);
    setProductInput('');

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.length < 3) {
      setSearchResults([]);
      return;
    }

    debounceTimeout.current = window.setTimeout(() => {
      fetch(`${API_BASE_URL}/api/products/search?q=${encodeURIComponent(value)}`)
        .then((response) => response.ok ? response.json() : [])
        .then((results) => {
          const mapped: Product[] = Array.isArray(results)
            ? results.map((d: any) => ({
                id: String(d.id ?? d._id ?? ''),
                productName: d.name ?? '',
                rate: typeof d.billingRate === 'number' ? d.billingRate : 0,
                billingRate: typeof d.billingRate === 'number' ? d.billingRate : 0,
                quantity: typeof d.stock === 'number' ? d.stock : 0,
                category: d.category ?? 'General',
                isActive: d.isActive ?? true,
              })).filter(p => p.id && p.productName)
            : [];
          setSearchResults(mapped);
        })
        .catch(() => setSearchResults([]));
    }, 300);
  };

  const handleIdDropdownSelect = (selectedId: string) => {
    setIdInput(selectedId);
    const found = searchResults.find(p => p.id === selectedId);
    if (found) {
      setProductInput(found.productName);
      setProductQuantity('1');
    }
  };

  const filteredProducts = productInput.length >= 3
    ? searchResults.map((p) => ({ value: p.productName, label: p.productName }))
    : [];

  const filteredId = idInput.length >= 3
    ? searchResults.map((p) => ({ value: p.id, label: p.id }))
    : [];

  const handleAddBtnClick = () => {
    const selectedProduct = products.find(
      (p) => p.id === idInput && p.productName === productInput
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
      serial: selectedProduct.id,
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
    setIdInput('');
    setProductQuantity('');
  };

  const handleEditRow = (idx: number) => {
    const row = tableRowData[idx];
    if (!row) return;
    setEditingIndex(idx);
    setCustomerName(row.customerName || '');
    setMobileNumber(row.mobileNumber || '');
    setIdInput(row.serial || '');
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
            onDropdownSelect={handleProductDropdownSelect}         // Autopopulate other field on select
          />
          <ShopInput
            elementType={'dropdown'}
            labelText={'Product Id'}
            value={idInput}
            onChange={handleIdInputChange}
            dropdownOptions={filteredId}
            dataType={'dropdown'}
            disabled={false}
            onDropdownSelect={handleIdDropdownSelect}            // Autopopulate other field on select
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
