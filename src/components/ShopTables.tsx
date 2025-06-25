import React from "react";
import "./ShopTables.scss";

export type ShopTableProps = {
  tableColumns: { 
    key: string; 
    header: string; 
    width: string; 
    alignment?: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
  }[];
};

const ShopTable: React.FC<ShopTableProps> = ({ tableColumns }) => {
  return (
    <div className="shop-table-container">
      <table className="shop-table">
        <thead>
          <tr>
            {tableColumns.map((col) => (
              <th key={col.key} style={{ width: col.width, textAlign: col.alignment}}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(8)].map((_, idx) => (
            <tr key={idx} className="itemRow">
              {tableColumns.map((col) => (
                <td key={col.key} data-label={col.header} style={{textAlign: col.alignment}}>
                  Testing the item 
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
