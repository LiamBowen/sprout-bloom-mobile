
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const InvestHeader = () => {
  return (
    <div className="flex items-center space-x-4 pl-4">
      <h2 className="text-2xl font-bold">Invest</h2>
      <div className="ml-auto">
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Investment
        </Button>
      </div>
    </div>
  );
};

export default InvestHeader;
