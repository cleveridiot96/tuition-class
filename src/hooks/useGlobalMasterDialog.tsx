
// Create this file if it doesn't exist
import { useState, useCallback } from 'react';
import { MasterType } from '@/types/master.types';
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function useGlobalMasterDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [masterType, setMasterType] = useState<MasterType>('supplier');
  const [initialName, setInitialName] = useState('');
  const [name, setName] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [onConfirm, setOnConfirm] = useState<((id: string, name: string) => void) | null>(null);

  const open = useCallback((type: MasterType, initialValue = '') => {
    setMasterType(type);
    setInitialName(initialValue);
    setName(initialValue);
    setCommissionRate(type === 'broker' || type === 'agent' ? '1' : '');
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleAddMaster = useCallback((callback: (id: string, name: string) => void) => {
    setOnConfirm(() => callback);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!name.trim()) return;
    
    const id = `${masterType}-${uuidv4()}`;
    
    if (onConfirm) {
      onConfirm(id, name);
    }
    
    setIsOpen(false);
    setName('');
    setCommissionRate('');
    setOnConfirm(null);
  }, [masterType, name, onConfirm]);

  const GlobalMasterAddDialog = useCallback(() => {
    const showCommissionField = masterType === 'broker' || masterType === 'agent';
    
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New {masterType.charAt(0).toUpperCase() + masterType.slice(1)}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
            {showCommissionField && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="commission" className="text-right">
                  Commission (%)
                </Label>
                <Input
                  id="commission"
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }, [isOpen, masterType, name, commissionRate, close, handleConfirm]);

  return {
    open,
    close,
    isOpen,
    handleAddMaster,
    GlobalMasterAddDialog
  };
}
