
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/UI/Card';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Group } from '@/context/GroupContext';
import Button from '@/components/UI/Button';

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const navigate = useNavigate();
  
  const totalValue = group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Format date
  const formattedDate = new Date(group.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  return (
    <Card glass animate className="h-full">
      <CardHeader>
        <CardTitle className="text-gradient text-xl">{group.name}</CardTitle>
        <div className="flex items-center gap-2 text-xs text-fimdefesta-muted">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {group.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} />
            <span>{group.location}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm">
          <Users size={16} />
          <span>{group.participants.length} participantes</span>
        </div>
        
        <div className="mt-2 pt-2 border-t border-fimdefesta-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-fimdefesta-muted">Total:</span>
            <span className="font-bold">R$ {totalValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-fimdefesta-muted">Por pessoa (média):</span>
            <span>R$ {group.participants.length > 0 
              ? (totalValue / group.participants.length).toFixed(2) 
              : '0.00'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          fullWidth
          onClick={() => navigate(`/group/${group.id}`)}
        >
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
