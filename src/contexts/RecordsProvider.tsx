import { useEffect, useState } from 'react';
import { getApiData } from '../utils/services';
import { RecordsData } from './dataContexts';
import { RawData } from '../components/datagridLayouts/PageDataGrid';
export const RecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<RawData[]>([]);
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getApiData();
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <RecordsData.Provider value={{ records, setRecords }}>
      {children}
    </RecordsData.Provider>
  );
};
