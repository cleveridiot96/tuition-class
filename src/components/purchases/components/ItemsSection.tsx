
import React from 'react';
import ItemsTable from '../../shared/ItemsTable';

interface ItemsSectionProps {
  items: any[];
  onItemChange: (index: number, field: string, value: any) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: () => void;
}

const ItemsSection: React.FC<ItemsSectionProps> = ({
  items,
  onItemChange,
  onRemoveItem,
  onAddItem
}) => {
  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
      <ItemsTable
        items={items}
        onItemChange={onItemChange}
        onRemoveItem={onRemoveItem}
        onAddItem={onAddItem}
      />
    </div>
  );
};

export default ItemsSection;
