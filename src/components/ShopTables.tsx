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
  fixedRowCount?: number; // if provided, pads rows to this count
  containerHeight?: string | number; // height of scroll container
  wrapInContainer?: boolean; // if false, renders only the table
};

const ShopTable: React.FC<ShopTableProps> = ({
  tableColumns,
  tableData,
  fixedRowCount = 8,
  containerHeight,
  wrapInContainer = true,
}) => {
  const displayRows = [...tableData];
  if (typeof fixedRowCount === 'number') {
    while (displayRows.length < fixedRowCount) {
      displayRows.push({});
    }
  }

  const tableElement = (
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
        {displayRows.map((row, idx) => (
          <tr key={idx} className={`itemRow ${idx >= tableData.length ? 'emptyRow' : ''}`}>
            {tableColumns.map((col) => (
              <td
                key={col.key}
                className={`col-${col.key}`}
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
  );

  if (!wrapInContainer) return tableElement;

  return (
    <div className='shop-table-container' style={containerHeight ? { height: containerHeight } : undefined}>
      {tableElement}
    </div>
  );
};

export default ShopTable;
