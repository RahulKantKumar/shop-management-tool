import { useState } from "react";
import Header from "../components/Header";
import LeftPanel from "../components/LeftPanel";
import ShopInput from "../components/ShopInput";
import "./BillingPage.scss";

const BillingPage = () => {
  const [productInput, setProductInput] = useState("");

  // Dummy product data (could come from API/context later)
const dummyProducts = [
  { serialNumber: "SN-1001", productName: "Quantum Laptop Pro" },
  { serialNumber: "SN-1002", productName: "Quantum Laptop Air" },
  { serialNumber: "SN-2001", productName: "Nebula Smartphone X" },
  { serialNumber: "SN-2002", productName: "Nebula Smartphone Y" },
  { serialNumber: "SN-3001", productName: "Galaxy Tablet 10" },
  { serialNumber: "SN-3002", productName: "Galaxy Tablet 8" },
  { serialNumber: "SN-4001", productName: "Pulse Wireless Earbuds" },
  { serialNumber: "SN-4002", productName: "Pulse Wireless Headphones" },
  { serialNumber: "SN-5001", productName: "Aurora Smart Watch" },
  { serialNumber: "SN-5002", productName: "Aurora Fitness Tracker" }
];

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
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
