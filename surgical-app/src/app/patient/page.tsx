import { StatusTable } from '@/components/StatusTable';
import React from 'react';

const StatusPage = () => {
  return (
    <div className="text-center pt-[120px] pb-[80px] flex flex-col items-center justify-center">
      <h1 className="text-3xl">PATIENT STATUS LIST</h1>
      <div className="mt-4 flex flex-col items-center justify-center w-full px-4">
        <StatusTable />
      </div>
    </div>
  );
};

export default StatusPage;
