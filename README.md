# ShopApp Developer Guide

## Overview

ShopApp is a modern React + TypeScript single-page application for managing shop billing and inventory. It features a clean UI, modular component structure, and responsive design. The app is designed for easy extensibility and maintainability.

---

## Folder Structure

```
shopApp/
│
├── public/                  # Static assets
├── src/
│   ├── assets/              # Static images, SVGs, etc.
│   ├── components/          # Reusable UI components
│   │   ├── EditButton.tsx
│   │   ├── EditButton.scss
│   │   ├── Header.tsx
│   │   ├── Header.scss
│   │   ├── LeftPanel.tsx
│   │   ├── LeftPanel.scss
│   │   ├── ShopButton.tsx
│   │   ├── ShopButton.scss
│   │   ├── ShopInput.tsx
│   │   ├── ShopInput.scss
│   │   ├── ShopTables.tsx
│   │   └── ShopTables.scss
│   ├── data/                # Static data (e.g. products)
│   │   └── products.ts
│   ├── pages/               # Main app pages
│   │   ├── BillingPage.tsx
│   │   ├── BillingPage.scss
│   │   ├── HomePage.tsx
│   │   ├── HomePage.scss
│   │   ├── InventoryPage.tsx
│   │   └── InventoryPage.scss
│   ├── App.tsx              # App root
│   ├── main.tsx             # Entry point
│   └── global.scss          # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md                # This file
```

---

## Setup & Installation

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the app locally:**
   ```sh
   npm run dev
   ```
3. **Build for production:**
   ```sh
   npm run build
   ```

---

## Components

### `ShopButton`
Reusable button component.
- **Props:**
  - `text` (string, required): Button label
  - `onClick` (function, optional): Click handler
  - `disabled` (boolean, optional): Disabled state
- **Usage:**
  ```tsx
  <ShopButton text="Add" onClick={handleAdd} disabled={isLoading} />
  ```
- **Styling:** See `ShopButton.scss` for button appearance and states.

---

### `ShopInput`
Flexible input supporting text, number, mobile, and dropdown.
- **Props:**
  - `labelText` (string, required): Label for the input
  - `elementType` (string, optional): 'input', 'quantity', or 'dropdown'
  - `dataType` (string, optional): 'mobile', etc.
  - `placeholder` (string, optional)
  - `value` (string, optional): Controlled value
  - `onChange` (function, optional): Change handler
  - `dropdownOptions` (array, optional): For dropdowns
  - `disabled` (boolean, optional)
  - `maxLength` (number, optional)
- **Usage:**
  ```tsx
  <ShopInput labelText="Customer Name" value={name} onChange={handleNameChange} />
  <ShopInput labelText="Product" elementType="dropdown" dropdownOptions={productOptions} />
  ```
- **Styling:** See `ShopInput.scss` for input and dropdown styles.

---

### `LeftPanel`
Sidebar navigation with icons for Home, Billing, and Inventory.
- **Icons:** Custom SVGs, styled for color and hover feedback.
- **Usage:** Used at the app root for navigation.
- **Styling:** See `LeftPanel.scss` for layout, icon, and label styles.

---

### `Header`
Top bar/header for the application.
- **Usage:** Used at the top of all main pages.
- **Styling:** See `Header.scss`.

---

### `ShopTables`
Table component for displaying lists (e.g. products in a bill).
- **Props:**
  - `tableColumns`: Array of column definitions
  - `tableData`: Array of row data
- **Usage:**
  ```tsx
  <ShopTables tableColumns={columns} tableData={rows} />
  ```
- **Styling:** See `ShopTables.scss`.

---

## Pages

### `BillingPage`
- Allows entry of customer and product details, adding products to a bill, editing, clearing, and printing.
- Uses `ShopInput`, `ShopButton`, and `ShopTables`.
- Product selection is assisted by dropdowns.

### `InventoryPage`
- For managing product inventory (add, edit, remove products).
- Uses `ShopInput` and `ShopButton`.

### `HomePage`
- Landing page for the app.

---

## Data

- Product data is defined in `src/data/products.ts` as an array of objects with fields like `serialNumber`, `productName`, `rate`, etc.
- Used for populating dropdowns and tables in billing and inventory pages.

---

## Extending the App

- To add a new page, create a new file in `src/pages/` and add a route in your router setup.
- To add a new component, place it in `src/components/` and import as needed.
- Follow the existing SCSS structure for consistent styling.

---