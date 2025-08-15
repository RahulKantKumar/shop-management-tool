import './InventoryPage.scss';
import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import ShopInput from '../components/ShopInput';
import ShopTables, { type ShopTableProps } from '../components/ShopTables';
import ShopButton from '../components/ShopButton';
import { type Product } from '../data/products';
import { createProduct, updateProduct, deleteProduct, getProducts, type ServerProduct, updateProductByIndex, deleteProductByIndex } from '../api/products';
import EditButton from '../components/EditButton';

const InventoryPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const loadFromServer = async () => {
      setIsLoading(true);
      try {
        const serverProducts = await getProducts();
        const mapped: Product[] = serverProducts.map((sp: ServerProduct) => ({
          id: String(sp._id ?? sp.id ?? ''),
          productName: sp.name ?? '',
          rate: typeof sp.inventoryRate === 'number' ? sp.inventoryRate : 0,
          billingRate: typeof sp.billingRate === 'number' ? sp.billingRate : 0,
          quantity: typeof sp.stock === 'number' ? sp.stock : 0,
          category: sp.category ?? 'General',
          isActive: sp.isActive ?? true,
        })).filter(p => p.id && p.productName);
        setProducts(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    void loadFromServer();
  }, []);

  const [idInput, setIdInput] = useState('');
  const [productInput, setProductInput] = useState('');
  const [rateInput, setRateInput] = useState(''); // Inventory rate
  const [billingRateInput, setBillingRateInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Duplicate Id check (case-insensitive). While editing, ignore the current row.
  const isIdConflict = useMemo(() => {
    const normalized = idInput.trim().toLowerCase();
    if (!normalized) return false;
    return products.some((p, i) => {
      const same = p.id.trim().toLowerCase() === normalized;
      if (editingIndex === null) return same;
      return same && i !== editingIndex;
    });
  }, [products, idInput, editingIndex]);

  const tableColumns: ShopTableProps['tableColumns'] = [
    { key: 'serial', header: 'ID', width: '10%', alignment: 'left' },
    { key: 'product', header: 'PRODUCT', width: '40%', alignment: 'left' },
    { key: 'rate', header: 'INVENTORY RATE', width: '15%', alignment: 'right' },
    { key: 'billingRate', header: 'BILLING RATE', width: '15%', alignment: 'right' },
    { key: 'quantity', header: 'QUANTITY', width: '15%', alignment: 'right' },
    { key: 'action', header: '', width: '05%', alignment: 'center' },
  ];

  const idOptions = useMemo(() => {
    return idInput
      ? products
          .filter((p) =>
            p.id.toLowerCase().includes(idInput.toLowerCase())
          )
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((p) => ({ value: p.id, label: p.id }))
      : [];
  }, [products, idInput]);

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

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdInput(value);
    const found = products.find(
      (p) => p.id.toLowerCase() === value.toLowerCase()
    );
    if (found) {
      setProductInput(found.productName);
      setRateInput(String(found.rate));
      setBillingRateInput(String(found.billingRate));
      setQuantityInput('10');
    } else {
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
      setIdInput(found.id);
      setRateInput(String(found.rate));
      setBillingRateInput(String(found.billingRate));
      setQuantityInput('10');
    } else {
      setQuantityInput((prev) => (prev === '' ? '10' : prev));
    }
  };

  const resetForm = () => {
    setIdInput('');
    setProductInput('');
    setRateInput('');
    setQuantityInput('');
    setBillingRateInput('');
    setEditingIndex(null);
  };

  // Add product function
  const handleAddProduct = async () => {
    if (!idInput || !productInput || !rateInput) {
      alert('Please fill Id, Product and Rates.');
      return;
    }
    const rate = Number(rateInput);
    const billingRate = Number(billingRateInput);
    const quantity = Number(quantityInput === '' ? '10' : quantityInput);
    if (Number.isNaN(rate) || Number.isNaN(billingRate) || Number.isNaN(quantity)) {
      alert('Rates and Quantity must be valid numbers.');
      return;
    }
    const normalizedId = idInput.trim();
    if (
      products.some(
        (p) => p.id.trim().toLowerCase() === normalizedId.toLowerCase()
      )
    ) {
      alert('A product with this Id already exists. Please choose a unique Id.');
      return;
    }
    try {
      const created = await createProduct({
        _id: normalizedId,
        name: productInput,
        category: 'General',
        stock: quantity,
        inventoryRate: rate,
        billingRate: billingRate,
        isActive: true,
      });
      const newProduct: Product = {
        id: normalizedId,
        productName: productInput,
        rate,
        billingRate,
        quantity,
        category: 'General',
        isActive: true,
      };
      setProducts((prev) => [newProduct, ...prev]);
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Failed to create on server. No changes made.');
    }
  };

  // Update product function
  const handleUpdateProduct = async () => {
    if (!idInput || !productInput || !rateInput) {
      alert('Please fill Id, Product and Rates.');
      return;
    }
    const rate = Number(rateInput);
    const billingRate = Number(billingRateInput);
    const quantity = Number(quantityInput === '' ? '10' : quantityInput);
    if (Number.isNaN(rate) || Number.isNaN(billingRate) || Number.isNaN(quantity)) {
      alert('Rates and Quantity must be valid numbers.');
      return;
    }
    const existing = products[editingIndex!];
    const normalizedId = idInput.trim().toLowerCase();
    const conflict = products.some((p, i) => i !== editingIndex && p.id.trim().toLowerCase() === normalizedId);
    if (conflict) {
      alert('A product with this Id already exists. Please choose a unique Id.');
      return;
    }
    if (quantity === 0) {
      if (existing?.id) {
        try {
          await deleteProductByIndex(String(existing.id));
          setProducts((prev) => prev.filter((_, idx) => idx !== editingIndex));
          resetForm();
        } catch (err) {
          console.error(err);
          alert('Failed to delete on server. No changes made.');
        }
      } else {
        alert('Cannot delete on server: missing id.');
      }
      return;
    }
    const payload = {
      _id: idInput,
      name: productInput,
      category: 'General',
      stock: quantity,
      inventoryRate: rate,
      billingRate: billingRate,
      isActive: true,
    } as const;
    if (existing?.id) {
      try {
        await updateProductByIndex(String(existing.id), payload);
        setProducts((prev) =>
          prev.map((p, idx) =>
            idx === editingIndex
              ? {
                  id: idInput,
                  productName: productInput,
                  rate,
                  billingRate,
                  quantity,
                  category: 'General',
                  isActive: true,
                }
              : p
          )
        );
        resetForm();
      } catch (err) {
        console.error(err);
        alert('Failed to update on server. No changes made.');
      }
    } else {
      alert('Cannot update on server: missing id.');
    }
  };

  const handleEdit = (id: string) => {
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const p = products[idx];
    setIdInput(String(p.id));
    setProductInput(p.productName);
    setRateInput(String(p.rate));
    setBillingRateInput(String(p.billingRate));
    setQuantityInput(String(p.quantity));
    setEditingIndex(idx);
  };

  const handleDelete = async (index: number) => {
    const confirmed = confirm('Delete this product?');
    if (!confirmed) return;
    const p = products[index];
    if (!p) return;
    if (p.id) {
      try {
        await deleteProductByIndex(String(p.id));
        setProducts((prev) => prev.filter((_, idx) => idx !== index));
        if (editingIndex === index) {
          resetForm();
        }
      } catch (err) {
        console.error(err);
        alert('Failed to delete on server. No changes made.');
      }
    } else {
      alert('Cannot delete on server: missing id.');
    }
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) =>
      a.productName.localeCompare(b.productName, undefined, { sensitivity: 'base' })
    );
  }, [products]);

  const tableData = useMemo(() => {
    return sortedProducts.map((p) => ({
      serial: p.id,
      product: p.productName,
      rate: p.rate,
      billingRate: p.billingRate,
      quantity: p.quantity,
      action: <EditButton onClick={() => handleEdit(String(p.id))} />,
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
            labelText={'Product Id'}
            value={idInput}
            onChange={handleIdChange}
            dropdownOptions={idOptions}
            dataType={'dropdown'}
            disabled={false}
            placeholder={isIdConflict ? 'Id already exists' : ''}
          />
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
              onClick={() => {
                if (editingIndex === null) {
                  void handleAddProduct();
                } else {
                  void handleUpdateProduct();
                }
              }}
            />
          </div>
        </div>
        <div className='inventoryPage__table'>
          {isLoading ? (
            <div className='inventoryPage__table-skeleton shop-table-container'>
              <table className='shop-table'>
                <thead>
                  <tr>
                    {tableColumns.map((col) => (
                      <th
                        key={col.key}
                        className={`col-${col.key}`}
                        style={{ width: col.width, textAlign: col.alignment }}
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='shop-table-body'>
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <tr key={idx} className='itemRow'>
                      {tableColumns.map((col) => (
                        <td
                          key={col.key}
                          className={`col-${col.key}`}
                          data-label={col.header}
                          style={{ textAlign: col.alignment }}
                        >
                          <div className='skeleton-line' data-size={col.key}></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ShopTables
              tableColumns={tableColumns}
              tableData={tableData}
              fixedRowCount={12}
              containerHeight={'416px'}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;


