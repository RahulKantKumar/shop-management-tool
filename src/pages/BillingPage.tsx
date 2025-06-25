import "./BillingPage.scss";
import { useState } from "react";
import Header from "../components/Header";
import LeftPanel from "../components/LeftPanel";
import ShopInput from "../components/ShopInput";
import ShopTables from "../components/ShopTables";
import ShopButton from "../assets/ShopButton";

const dummyProducts = [
  { serialNumber: "SN-1001", productName: "Quantum Laptop Pro", quantity: 100, rate: 500 },
  { serialNumber: "SN-1002", productName: "Quantum Laptop Air", quantity: 100, rate: 450 },
  { serialNumber: "SN-2001", productName: "Nebula Smartphone X", quantity: 100, rate: 300 },
  { serialNumber: "SN-2002", productName: "Nebula Smartphone Y", quantity: 100, rate: 280 },
  { serialNumber: "SN-3001", productName: "Galaxy Tablet 10", quantity: 100, rate: 250 },
  { serialNumber: "SN-3002", productName: "Galaxy Tablet 8", quantity: 100, rate: 220 },
  { serialNumber: "SN-4001", productName: "Pulse Wireless Earbuds", quantity: 100, rate: 50 },
  { serialNumber: "SN-4002", productName: "Pulse Wireless Headphones", quantity: 100, rate: 70 },
  { serialNumber: "SN-5001", productName: "Aurora Smart Watch", quantity: 100, rate: 120 },
  { serialNumber: "SN-5002", productName: "Aurora Fitness Tracker", quantity: 100, rate: 90 }
];


const BillingPage = () => {
  const [productInput, setProductInput] = useState("");

  const tableColumns = [
    { key: 'product', header: 'Product', width: '40%' },
    { key: 'quantity', header: 'Qty', width: '15%' },
    { key: 'rate', header: 'Rate', width: '20%' },
    { key: 'total', header: 'Total', width: '25%' }
  ]


  // Filter and sort products based on input
  const filteredProducts = productInput
    ? dummyProducts
        .filter((product) =>
          product.serialNumber
            .toLowerCase()
            .includes(productInput.toLowerCase())
        )
        .sort((a, b) => a.serialNumber.localeCompare(b.serialNumber))
        .map((p) => ({
          value: p.serialNumber,
          label: p.serialNumber,
        }))
    : [];

  return (
    <div>
      <Header />
      <LeftPanel />
      <div className="billingPage">
        <div className="billingPage__title">Customer Billing</div>
        <div className="billingPage__form-grid">
          <ShopInput
            elementType={"input"}
            labelText={"Customer Name"}
          />
          <ShopInput
            elementType={"input"}
            labelText={"Mobile Number"}
            dataType={"number"}
          />
          <ShopInput
            elementType={"dropdown"}
            labelText={"Product Name"}
            value={productInput}
            onChange={(e) => setProductInput(e.target.value)}
            dropdownOptions={filteredProducts}
            dataType={"dropdown"}
            disabled={false}
          />
          <ShopInput
            elementType={"dropdown"}
            labelText={"Product Number"}
            value={productInput}
            onChange={(e) => setProductInput(e.target.value)}
            dropdownOptions={filteredProducts}
            dataType={"dropdown"}
            disabled={false}
          />
          <ShopInput
            elementType={"quantity"}
            labelText={"Product Quantity"}
          />
          <ShopButton 
            text={"Add"}
            disabled={false}
            onClick={() => alert('Added!')}
          />
        </div>
        <div className="billingPage__table">
          <ShopTables
            tableColumns={tableColumns}
          />
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
