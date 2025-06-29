import React from 'react';
import './ShopTables.scss';

export type ShopTableProps = {
  tableColumns: {
    key: string;
    header: string;
    width: string;
    alignment?: 'left' | 'right' | 'center' | 'justify' | 'start' | 'end';
  }[];
  tableData: any[];
};

const ShopTable: React.FC<ShopTableProps> = ({ tableColumns, tableData }) => {
  // Always show exactly 8 rows, either filled with data or empty
  const displayRows = [...tableData];
  while (displayRows.length < 8) {
    displayRows.push({});
  }

  return (
    <div className='shop-table-container'>
      <table className='shop-table'>
        <thead>
          <tr>
            {tableColumns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width, textAlign: col.alignment }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='shop-table-body'>
          {displayRows.slice(0, 8).map((row, idx) => (
            <tr
              key={idx}
              className={`itemRow ${idx >= tableData.length ? 'emptyRow' : ''}`}
            >
              {tableColumns.map((col) => (
                <td
                  key={col.key}
                  data-label={col.header}
                  style={{ textAlign: col.alignment }}
                >
                  {row[col.key] !== undefined ? row[col.key] : ''}
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
