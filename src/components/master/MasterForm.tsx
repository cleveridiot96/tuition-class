
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addMaster } from "@/services/storageService";

interface MasterFormProps {
  onClose: () => void;
  onSaved: () => void;
}

export const MasterForm: React.FC<MasterFormProps> = ({ onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill all fields.");
      return;
    }

    const newMaster = {
      id: `master-${uuid()}`,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
    };

    addMaster(newMaster);
    toast.success("Master saved successfully.");

    setName("");
    setPhone("");
    setAddress("");

    onSaved(); // reload master list
    onClose(); // close form/modal
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit" className="w-full">Save Master</Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
