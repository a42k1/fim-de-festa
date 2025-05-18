
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useGroups } from '@/context/GroupContext';
import Navbar from '@/components/Layout/Navbar';
import { Button } from '@/components/ui/button';
import ItemList from '@/components/Items/ItemList';
import AddItemForm from '@/components/Items/AddItemForm';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, MapPin, Plus, Users } from 'lucide-react';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { getGroup, setCurrentGroup } = useGroups();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
  const group = getGroup(id || '');
  
  // Set current group when component mounts
  useEffect(() => {
    if (group) {
      setCurrentGroup(group);
    }
  }, [group, setCurrentGroup]);
  
  // Redirect to dashboard if group not found
  useEffect(() => {
    if (!group && !isAuthenticated) {
      navigate('/');
    } else if (!group) {
      navigate('/dashboard');
      toast({
        title: "Grupo não encontrado",
        description: "O grupo que você está procurando não existe.",
        variant: "destructive",
      });
    }
  }, [group, navigate, toast, isAuthenticated]);

  if (!group) {
    return null; // Will be redirected
  }
  
  // Format date
  const formattedDate = new Date(group.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  // Calculate summary
  const calculateSummary = () => {
    const participantTotals: Record<string, number> = {};
    
    // Initialize totals with 0
    group.participants.forEach(participant => {
      participantTotals[participant.id] = 0;
    });
    
    // Calculate individual shares
    group.items.forEach(item => {
      const totalItemPrice = item.price * item.quantity;
      
      if (item.splitEqually) {
        // Divide equally among all participants
        const perPersonShare = totalItemPrice / group.participants.length;
        group.participants.forEach(participant => {
          participantTotals[participant.id] += perPersonShare;
        });
      } else {
        // Divide among selected participants
        if (item.participants.length > 0) {
          const perPersonShare = totalItemPrice / item.participants.length;
          item.participants.forEach(participantId => {
            participantTotals[participantId] += perPersonShare;
          });
        }
      }
    });
    
    return participantTotals;
  };
  
  const summary = calculateSummary();
  const totalBill = Object.values(summary).reduce((sum, value) => sum + value, 0);

  return (
    <div className="min-h-screen flex flex-col bg-fimdefesta-background">
      <Navbar />
      
      <div className="container py-8 max-w-2xl animate-fade-in">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 text-fimdefesta-muted hover:text-fimdefesta-text mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao Dashboard</span>
        </button>
        
        <div className="bg-fimdefesta-surface rounded-xl overflow-hidden shadow-lg">
          {/* Header */}
          <div className="p-6 border-b border-fimdefesta-border">
            <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-4 text-sm text-fimdefesta-muted">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>{formattedDate}</span>
              </div>
              {group.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  <span>{group.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Users size={16} />
                <span>{group.participants.length} participantes</span>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {showAddItemForm ? (
              <AddItemForm 
                groupId={group.id} 
                onClose={() => setShowAddItemForm(false)} 
              />
            ) : showSummary ? (
              <div className="animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Resumo da Conta</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowSummary(false)}
                  >
                    Voltar aos Itens
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Totals per person */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-fimdefesta-muted">Valor por Pessoa</h3>
                    {group.participants.map(participant => (
                      <div 
                        key={participant.id}
                        className="flex justify-between items-center py-3 border-b border-fimdefesta-border/30"
                      >
                        <span>{participant.name}</span>
                        <span className="font-medium">
                          R$ {summary[participant.id]?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Total bill */}
                  <div className="pt-4 mt-4 border-t border-fimdefesta-border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total da Conta</span>
                      <span className="font-bold text-lg">
                        R$ {totalBill.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <Button fullWidth>
                      Finalizar Pagamentos
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Itens Consumidos</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant={group.items.length > 0 ? "outline" : "ghost"}
                      size="sm"
                      disabled={group.items.length === 0}
                      onClick={() => setShowSummary(true)}
                    >
                      Ver Resumo
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => setShowAddItemForm(true)}
                    >
                      <Plus size={16} className="mr-1" />
                      Adicionar Item
                    </Button>
                  </div>
                </div>
                
                <ItemList 
                  items={group.items} 
                  participants={group.participants} 
                  groupId={group.id} 
                />
                
                {group.items.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-fimdefesta-border flex justify-between items-center">
                    <div>
                      <span className="text-fimdefesta-muted">Total:</span>
                      <span className="font-bold text-lg ml-2">
                        R$ {totalBill.toFixed(2)}
                      </span>
                    </div>
                    <Button onClick={() => setShowSummary(true)}>
                      Ver Resumo
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
