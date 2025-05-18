
import React, { useState } from 'react';
import Button from '@/components/UI/Button';
import { useGroups } from '@/context/GroupContext';
import { X } from 'lucide-react';

interface AddItemFormProps {
  groupId: string;
  onClose: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ groupId, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [splitEqually, setSplitEqually] = useState(true);
  
  const { addItem, getGroup } = useGroups();
  
  const handlePriceChange = (value: string) => {
    // Allow only numbers and a single decimal point
    const formattedValue = value
      .replace(/[^\d.]/g, '')
      .replace(/(\..*)\./g, '$1');
    setPrice(formattedValue);
  };
  
  const handleQuantityChange = (value: string) => {
    // Allow only positive integers
    const formattedValue = value
      .replace(/\D/g, '')
      .replace(/^0+/, '') || '1';
    setQuantity(formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const group = getGroup(groupId);
    if (!group) return;
    
    const priceNumber = parseFloat(price);
    const quantityNumber = parseInt(quantity, 10) || 1;
    
    if (!name || isNaN(priceNumber)) return;
    
    const newItem = {
      name,
      price: priceNumber,
      quantity: quantityNumber,
      participants: splitEqually ? group.participants.map(p => p.id) : [],
      splitEqually,
    };
    
    addItem(groupId, newItem);
    onClose();
  };

  return (
    <div className="animate-scale-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Adicionar Item</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-fimdefesta-surface"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="item-name" className="block text-sm font-medium mb-1">
            Nome do Item
          </label>
          <input
            id="item-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Pizza, Refrigerante, etc."
            className="w-full px-3 py-2 rounded-md bg-fimdefesta-background border border-fimdefesta-border focus:outline-none focus:ring-2 focus:ring-fimdefesta-primary"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="item-price" className="block text-sm font-medium mb-1">
              Preço (R$)
            </label>
            <input
              id="item-price"
              type="text"
              required
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 rounded-md bg-fimdefesta-background border border-fimdefesta-border focus:outline-none focus:ring-2 focus:ring-fimdefesta-primary"
            />
          </div>
          
          <div>
            <label htmlFor="item-quantity" className="block text-sm font-medium mb-1">
              Quantidade
            </label>
            <input
              id="item-quantity"
              type="text"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-fimdefesta-background border border-fimdefesta-border focus:outline-none focus:ring-2 focus:ring-fimdefesta-primary"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <label htmlFor="split-equally" className="flex items-center gap-2 cursor-pointer">
            <input
              id="split-equally"
              type="checkbox"
              checked={splitEqually}
              onChange={() => setSplitEqually(!splitEqually)}
              className="w-4 h-4 accent-fimdefesta-primary"
            />
            <span>Dividir igualmente entre todos</span>
          </label>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            Adicionar Item
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;
