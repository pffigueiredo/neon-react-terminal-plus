'use client';

import { useState } from 'react';
import { ReactTerminal, TerminalContextProvider } from 'react-terminal-plus';

type TableData = Record<string, any>[];

const Table = ({ data }: { data: TableData }) => {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'left',
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td
                key={header}
                style={{ border: '1px solid #ddd', padding: '8px' }}
              >
                {row[header] !== null ? row[header].toString() : 'NULL'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function ClientComponent() {
  const commands = {
    ['\\dt']: () =>
      defaultHandler(
        `SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';`,
        ''
      ),
  };

  const defaultHandler = async (command: string, args: string) => {
    try {
      const fullCommand = `${command} ${args}`;
      const response = await fetch(`/api/data?query=${fullCommand}`);
      const result = await response.json();

      if (Array.isArray(result)) {
        return <Table data={result} />;
      } else {
        return <>${JSON.stringify(result, null, 4)}</>;
      }
    } catch (error) {
      return <>An error occurred while executing the query.</>;
    }
  };

  return (
    <div>
      <h1>SQL Query Terminal</h1>
      <TerminalContextProvider>
        <ReactTerminal
          commands={commands}
          defaultHandler={defaultHandler}
          prompt="sql>"
        />
      </TerminalContextProvider>
    </div>
  );
}
