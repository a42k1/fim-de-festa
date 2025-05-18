
import React from 'react';
import { Item, Participant, useGroups } from '@/context/GroupContext';
import { Plus, Trash2, Users } from 'lucide-react';
import Button from '@/components/UI/Button';

interface ItemListProps {
  items: Item[];
  participants: Participant[];
  groupId: string;
}

const ItemList: React.FC<ItemListProps> = ({ items, participants, groupId }) => {
  const { updateItem, removeItem } = useGroups();

  const handleToggleParticipant = (item: Item, participantId: string) => {
    const updatedItem = { ...item };
    if (updatedItem.participants.includes(participantId)) {
      updatedItem.participants = updatedItem.participants.filter(id => id !== participantId);
    } else {
      updatedItem.participants = [...updatedItem.participants, participantId];
    }
    updateItem(groupId, updatedItem);
  };

  const handleToggleSplitEqually = (item: Item) => {
    const updatedItem = { 
      ...item,
      splitEqually: !item.splitEqually
    };
    updateItem(groupId, updatedItem);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-fimdefesta-muted mb-4">Nenhum item na conta ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div
          key={item.id}
          className="bg-fimdefesta-background p-4 rounded-lg border border-fimdefesta-border"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-fimdefesta-muted">
                  {item.quantity} x R$ {item.price.toFixed(2)}
                </span>
                <span className="text-fimdefesta-primary font-medium">
                  = R$ {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                className="text-fimdefesta-muted hover:text-destructive p-1.5 rounded-full hover:bg-destructive/10 transition-colors"
                onClick={() => removeItem(groupId, item.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-fimdefesta-border/30">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5">
                <Users size={16} />
                <span className="text-sm">Quem vai pagar?</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleToggleSplitEqually(item)}
              >
                {item.splitEqually ? 'Dividir individualmente' : 'Dividir para todos'}
              </Button>
            </div>
            
            {item.splitEqually ? (
              <div className="text-sm text-fimdefesta-muted italic">
                Dividido igualmente entre todos ({participants.length} pessoas)
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {participants.map(participant => (
                  <button
                    key={participant.id}
                    onClick={() => handleToggleParticipant(item, participant.id)}
                    className={`
                      px-2.5 py-1 text-sm rounded-full transition-colors
                      ${item.participants.includes(participant.id)
                        ? 'bg-fimdefesta-primary text-white'
                        : 'bg-fimdefesta-surface text-fimdefesta-muted hover:bg-fimdefesta-primary/20'
                      }
                    `}
                  >
                    {participant.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
