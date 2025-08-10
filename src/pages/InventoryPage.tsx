import './InventoryPage.scss';
import { useMemo, useState } from 'react';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import ShopInput from '../components/ShopInput';
import ShopTables, { type ShopTableProps } from '../components/ShopTables';
import ShopButton from '../components/ShopButton';
import { initialProducts, type Product } from '../data/products';
import EditButton from '../components/EditButton';

const InventoryPage = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const [serialInput, setSerialInput] = useState('');
  const [productInput, setProductInput] = useState('');
  const [rateInput, setRateInput] = useState(''); // Inventory rate
  const [billingRateInput, setBillingRateInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const tableColumns: ShopTableProps['tableColumns'] = [
    { key: 'serial', header: 'INDEX', width: '10%', alignment: 'left' },
    { key: 'product', header: 'PRODUCT', width: '40%', alignment: 'left' },
    { key: 'rate', header: 'INVENTORY RATE', width: '15%', alignment: 'right' },
    { key: 'billingRate', header: 'BILLING RATE', width: '15%', alignment: 'right' },
    { key: 'quantity', header: 'QUANTITY', width: '15%', alignment: 'right' },
    { key: 'action', header: '', width: '05%', alignment: 'center' },
  ];

  const serialOptions = useMemo(() => {
    return serialInput
      ? products
          .filter((p) =>
            p.serialNumber.toLowerCase().includes(serialInput.toLowerCase())
          )
          .sort((a, b) => a.serialNumber.localeCompare(b.serialNumber))
          .map((p) => ({ value: p.serialNumber, label: p.serialNumber }))
      : [];
  }, [products, serialInput]);

  const productOptions = useMemo(() => {
    return productInput
      ? products
          .filter((p) =>
            p.productName.toLowerCase().includes(productInput.toLowerCase())
          )
          .sort((a, b) => a.productName.localeCompare(b.productName))
          .map((p) => ({ value: p.productName, label: p.productName }))
      : [];
  }, [products, productInput]);

  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSerialInput(value);
    const found = products.find(
      (p) => p.serialNumber.toLowerCase() === value.toLowerCase()
    );
    if (found) {
      setProductInput(found.productName);
      setRateInput(String(found.rate));
      setBillingRateInput(String(found.billingRate));
      setQuantityInput('10');
    } else {
      // Default quantity to 10 for new (unknown) items, without overwriting user-entered value
      setQuantityInput((prev) => (prev === '' ? '10' : prev));
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductInput(value);
    const found = products.find(
      (p) => p.productName.toLowerCase() === value.toLowerCase()
    );
    if (found) {
      setSerialInput(found.serialNumber);
      setRateInput(String(found.rate));
      setBillingRateInput(String(found.billingRate));
      setQuantityInput('10');
    } else {
      // Default quantity to 10 for new (unknown) items, without overwriting user-entered value
      setQuantityInput((prev) => (prev === '' ? '10' : prev));
    }
  };

  const resetForm = () => {
    setSerialInput('');
    setProductInput('');
    setRateInput('');
    setQuantityInput('');
    setBillingRateInput('');
    setEditingIndex(null);
  };

  const handleAddOrUpdate = () => {
    if (!serialInput || !productInput || !rateInput) {
      alert('Please fill Index, Product and Rates.');
      return;
    }

    const rate = Number(rateInput);
    const billingRate = Number(billingRateInput);
    const quantity = Number(quantityInput === '' ? '10' : quantityInput);
    if (Number.isNaN(rate) || Number.isNaN(billingRate) || Number.isNaN(quantity)) {
      alert('Rates and Quantity must be valid numbers.');
      return;
    }

    // On add: prevent duplicate serial numbers
    if (editingIndex === null) {
      if (products.some((p) => p.serialNumber === serialInput)) {
        alert('A product with this SKUN already exists.');
        return;
      }
      const newProduct: Product = {
        serialNumber: serialInput,
        productName: productInput,
        rate,
        billingRate,
        quantity,
      };
      setProducts((prev) => [newProduct, ...prev]);
      resetForm();
      return;
    }

    // Update; delete if quantity set to 0
    if (editingIndex !== null) {
      if (quantity === 0) {
        setProducts((prev) => prev.filter((_, idx) => idx !== editingIndex));
        resetForm();
        return;
      }
      setProducts((prev) =>
        prev.map((p, idx) =>
          idx === editingIndex
            ? {
                serialNumber: serialInput,
                productName: productInput,
                rate,
                billingRate,
                quantity,
              }
            : p
        )
      );
      resetForm();
      return;
    }
  };

  const handleEdit = (serialNumber: string) => {
    const index = products.findIndex((p) => p.serialNumber === serialNumber);
    if (index === -1) return;
    const p = products[index];
    setSerialInput(p.serialNumber);
    setProductInput(p.productName);
    setRateInput(String(p.rate));
    setBillingRateInput(String(p.billingRate));
    setQuantityInput(String(p.quantity));
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const confirmed = confirm('Delete this product?');
    if (!confirmed) return;
    setProducts((prev) => prev.filter((_, idx) => idx !== index));
    if (editingIndex === index) {
      resetForm();
    }
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) =>
      a.productName.localeCompare(b.productName, undefined, { sensitivity: 'base' })
    );
  }, [products]);

  const tableData = useMemo(() => {
    return sortedProducts.map((p) => ({
      serial: p.serialNumber,
      product: p.productName,
      rate: p.rate,
      billingRate: p.billingRate,
      quantity: p.quantity,
      action: <EditButton onClick={() => handleEdit(p.serialNumber)} />,
    }));
  }, [sortedProducts]);

  return (
    <div>
      <Header />
      <LeftPanel />
      <div className='inventoryPage'>
        <div className='inventoryPage__title'>Inventory</div>
        <div className='inventoryPage__form-grid'>
          <ShopInput
            elementType={'dropdown'}
            labelText={'Product Name'}
            value={productInput}
            onChange={handleProductChange}
            dropdownOptions={productOptions}
            dataType={'dropdown'}
            disabled={false}
          />
          <ShopInput
            elementType={'dropdown'}
            labelText={'Product Index'}
            value={serialInput}
            onChange={handleSerialChange}
            dropdownOptions={serialOptions}
            dataType={'dropdown'}
            disabled={false}
          />
          <ShopInput
            elementType={'quantity'}
            labelText={'Inventory Rate'}
            value={rateInput}
            onChange={(e) => setRateInput(e.target.value)}
          />
          <ShopInput
            elementType={'quantity'}
            labelText={'Billing Rate'}
            value={billingRateInput}
            onChange={(e) => setBillingRateInput(e.target.value)}
          />
          <ShopInput
            elementType={'quantity'}
            labelText={'Quantity'}
            value={quantityInput}
            onChange={(e) => setQuantityInput(e.target.value)}
          />
          <div className='inventoryPage__actions'>
            {editingIndex !== null && (
              <ShopButton text={'Cancel'} onClick={resetForm} />
            )}
            <ShopButton
              text={editingIndex === null ? 'Add' : 'Update'}
              disabled={false}
              onClick={handleAddOrUpdate}
            />
          </div>
        </div>
        <div className='inventoryPage__table'>
          <ShopTables
            tableColumns={tableColumns}
            tableData={tableData}
            fixedRowCount={12}
            containerHeight={'416px'}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;


