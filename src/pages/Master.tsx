
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMasters } from "@/services/storageService";
import { MasterForm } from "@/components/master/MasterForm";
import Navigation from "@/components/Navigation";

const Master = () => {
  const [masters, setMasters] = useState(getMasters());
  const [showForm, setShowForm] = useState(false);

  const loadData = () => {
    const data = getMasters();
    setMasters(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <Navigation title="Master Data" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-200 shadow">
          <CardHeader>
            <CardTitle className="text-indigo-800">Master Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowForm(true)} 
              className="mb-4 bg-indigo-600 hover:bg-indigo-700"
            >
              + Add Master
            </Button>

            {showForm && (
              <MasterForm
                onClose={() => setShowForm(false)}
                onSaved={loadData}
              />
            )}

            {masters.length === 0 ? (
              <p className="text-gray-500">No masters saved yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {masters.map((m) => (
                  <div 
                    key={m.id} 
                    className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-indigo-800 mb-2">{m.name}</h3>
                    <p className="text-gray-600">{m.phone}</p>
                    <p className="text-gray-500">{m.address}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Master;
