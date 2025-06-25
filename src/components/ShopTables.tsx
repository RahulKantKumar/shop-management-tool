import React from "react";
import "./ShopTables.scss";

type ShopTableProps = {
  tableColumns: { key: string; header: string; width: string }[];
};

const ShopTable: React.FC<ShopTableProps> = ({ tableColumns }) => {
  return (
    <div className="shop-table-container">
      <table className="shop-table">
        <thead>
          <tr>
            {tableColumns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(8)].map((_, idx) => (
            <tr key={idx} className="empty-row">
              {tableColumns.map((col) => (
                <td key={col.key} data-label={col.header}>
                  {/* Empty cell for styling and spacing */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShopTable;
