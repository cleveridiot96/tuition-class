
import React from "react";
import { Card } from "@/components/ui/card";

interface Master {
  id: string;
  name: string;
  phone: string;
  address: string;
}

interface MastersListProps {
  masters: Master[];
}

export const MastersList: React.FC<MastersListProps> = ({ masters }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {masters.length === 0 ? (
        <p className="text-gray-500">No masters saved yet.</p>
      ) : (
        masters.map((m) => (
          <div 
            key={m.id} 
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">{m.name}</h3>
            <p className="text-gray-600">{m.phone}</p>
            <p className="text-gray-500">{m.address}</p>
          </div>
        ))
      )}
    </div>
  );
};
