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
          serialNumber: (sp as any).index ?? sp.serialNumber ?? '',
          productName: sp.name ?? '',
          rate: typeof sp.inventoryRate === 'number' ? sp.inventoryRate : (typeof sp.price === 'number' ? sp.price : 0),
          billingRate: typeof sp.billingRate === 'number' ? sp.billingRate : (typeof sp.price === 'number' ? sp.price : 0),
          quantity: typeof sp.stock === 'number' ? sp.stock : 0,
          id: sp.id,
        })).filter(p => p.serialNumber && p.productName);
        setProducts(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    void loadFromServer();
  }, []);

  const [serialInput, setSerialInput] = useState('');
  const [productInput, setProductInput] = useState('');
  const [rateInput, setRateInput] = useState(''); // Inventory rate
  const [billingRateInput, setBillingRateInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

	// Duplicate Index check (case-insensitive). While editing, ignore the current row.
	const isIndexConflict = useMemo(() => {
		const normalized = serialInput.trim().toLowerCase();
		if (!normalized) return false;
		return products.some((p, i) => {
			const same = p.serialNumber.trim().toLowerCase() === normalized;
			if (editingIndex === null) return same;
			return same && i !== editingIndex;
		});
	}, [products, serialInput, editingIndex]);

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

  const handleAddOrUpdate = async () => {
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

		// On add: prevent duplicate Index (serialNumber) values
    if (editingIndex === null) {
      const normalizedIndex = serialInput.trim();
      if (
				products.some(
					(p) => p.serialNumber.trim().toLowerCase() === normalizedIndex.toLowerCase()
				)
      ) {
        alert('A product with this Index already exists. Please choose a unique Index.');
        return;
      }
      try {
        const created = await createProduct({
          index: normalizedIndex,
          name: productInput,
          description: `Serial: ${serialInput}`,
          price: billingRate,
          category: 'General',
          stock: quantity,
          inventoryRate: rate,
          billingRate: billingRate,
          isActive: true,
        });
        const newProduct: Product = {
          serialNumber: normalizedIndex,
          productName: productInput,
          rate,
          billingRate,
          quantity,
          id: created.id,
        };
        setProducts((prev) => [newProduct, ...prev]);
        resetForm();
      } catch (err) {
        console.error(err);
        alert('Failed to create on server. No changes made.');
      }
      return;
    }

		// Update; delete if quantity set to 0
    if (editingIndex !== null) {
      const existing = products[editingIndex];
			// Prevent duplicate Index when changing Index during edit
			const normalizedIndex = serialInput.trim().toLowerCase();
			const conflict = products.some((p, i) => i !== editingIndex && p.serialNumber.trim().toLowerCase() === normalizedIndex);
			if (conflict) {
				alert('A product with this Index already exists. Please choose a unique Index.');
				return;
			}
      if (quantity === 0) {
        // Prefer delete by id, fallback to index; only update UI on success
        let deleted = false;
        if (existing?.id !== undefined) {
          try {
            await deleteProduct(existing.id);
            deleted = true;
          } catch (err) {
            console.error(err);
            // fallback to index-based
            if (existing?.serialNumber) {
              try {
                await deleteProductByIndex(existing.serialNumber);
                deleted = true;
              } catch (e2) {
                console.error(e2);
              }
            }
            if (!deleted) alert('Failed to delete on server. No changes made.');
          }
        } else if (existing?.serialNumber) {
          try {
            await deleteProductByIndex(existing.serialNumber);
            deleted = true;
          } catch (err) {
            console.error(err);
            alert('Failed to delete on server. No changes made.');
          }
        } else {
          alert('Cannot delete on server: missing identifiers.');
        }
        if (!deleted) return;
        setProducts((prev) => prev.filter((_, idx) => idx !== editingIndex));
        resetForm();
        return;
      }
      // Prefer backend update by id; fallback to index; only show one error if both fail
      let updated = false;
      const payload = {
        index: serialInput,
        name: productInput,
        description: `Serial: ${serialInput}`,
        price: billingRate,
        category: 'General',
        stock: quantity,
        inventoryRate: rate,
        billingRate: billingRate,
        isActive: true,
      } as const;

      if (existing?.id !== undefined) {
        try {
          await updateProduct(existing.id, payload);
          updated = true;
        } catch (err) {
          console.error(err);
          if (existing?.serialNumber) {
            try {
              await updateProductByIndex(existing.serialNumber, payload);
              updated = true;
            } catch (err) {
              console.error(err);
            }
          }
        }
      }

      if (!updated) {
        alert('Failed to update on server. No changes made.');
        return;
      }
      if (!updated) return;
      setProducts((prev) =>
        prev.map((p, idx) =>
          idx === editingIndex
            ? {
                serialNumber: serialInput,
                productName: productInput,
                rate,
                billingRate,
                quantity,
                id: p.id,
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

  const handleDelete = async (index: number) => {
    const confirmed = confirm('Delete this product?');
    if (!confirmed) return;
    const p = products[index];
    if (!p) return;
    let deleted = false;
    if (p.serialNumber) {
      try {
        await deleteProductByIndex(p.serialNumber);
        deleted = true;
      } catch (err) {
        console.error(err);
        if (p.id !== undefined) {
          try {
            await deleteProduct(p.id);
            deleted = true;
          } catch (e2) {
            console.error(e2);
          }
        }
      }
    } else if (p.id !== undefined) {
      try {
        await deleteProduct(p.id);
        deleted = true;
      } catch (err) {
        console.error(err);
      }
    }
    if (!deleted) {
      alert('Failed to delete on server. No changes made.');
      return;
    }
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
            labelText={'Product Index'}
            value={serialInput}
            onChange={handleSerialChange}
            dropdownOptions={serialOptions}
            dataType={'dropdown'}
            disabled={false}
            // Show inline duplicate warning by leveraging placeholder color
            placeholder={isIndexConflict ? 'Index already exists' : ''}
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
              onClick={() => { void handleAddOrUpdate(); }}
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


