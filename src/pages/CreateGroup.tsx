
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useGroups } from '@/context/GroupContext';
import Navbar from '@/components/Layout/Navbar';
import Button from '@/components/UI/Button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, X } from 'lucide-react';

const CreateGroup = () => {
  const { isAuthenticated, user } = useAuth();
  const { createGroup } = useGroups();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState<{ id: string; name: string }[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');
  
  // Add current user as initial participant
  useEffect(() => {
    if (user) {
      setParticipants([{ id: user.id, name: user.name }]);
    }
  }, [user]);
  
  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleAddParticipant = () => {
    if (!newParticipantName.trim()) return;
    
    // Check if participant with same name already exists
    if (participants.some(p => p.name.toLowerCase() === newParticipantName.toLowerCase())) {
      toast({
        title: "Participante já existe",
        description: "Um participante com este nome já foi adicionado.",
        variant: "destructive",
      });
      return;
    }
    
    setParticipants([
      ...participants, 
      { 
        id: `temp-${Date.now()}`, 
        name: newParticipantName.trim() 
      }
    ]);
    setNewParticipantName('');
  };

  const handleRemoveParticipant = (id: string) => {
    // Prevent removing current user
    if (user && id === user.id) {
      toast({
        title: "Ação não permitida",
        description: "Você não pode remover a si mesmo do grupo.",
        variant: "destructive",
      });
      return;
    }
    
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, dê um nome ao seu grupo.",
        variant: "destructive",
      });
      return;
    }
    
    if (participants.length < 1) {
      toast({
        title: "Participantes necessários",
        description: "Adicione pelo menos um participante ao grupo.",
        variant: "destructive",
      });
      return;
    }
    
    const newGroup = {
      name,
      date,
      location,
      participants,
      items: [],
      createdBy: user?.id || '',
    };
    
    createGroup(newGroup);
    
    toast({
      title: "Grupo criado!",
      description: "Seu grupo foi criado com sucesso.",
    });
    
    navigate('/dashboard');
  };

  if (!isAuthenticated) {
    return null; // Will be redirected
  }

  return (
    <div className="min-h-screen flex flex-col bg-fimdefesta-background">
      <Navbar />
      
      <div className="container py-8 max-w-xl animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Criar Novo Grupo</h1>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-fimdefesta-surface rounded-xl p-6 shadow-lg">
          <div className="space-y-6">
            <div>
              <label htmlFor="group-name" className="block text-sm font-medium mb-1">
                Nome do Grupo *
              </label>
              <input
                id="group-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Almoço de Aniversário, Pizza com Amigos"
                className="w-full px-3 py-2 rounded-md bg-fimdefesta-background border border-fimdefesta-border focus:outline-none focus:ring-2 focus:ring-fimdefesta-primary"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Local (opcional)
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Restaurante da Praia"
                className="w-full px-3 py-2 rounded-md bg-fimdefesta-background border border-fimdefesta-border focus:outline-none focus:ring-2 focus:ring-fimdefesta-primary"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Data
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-fimdefesta-background border border-fimdefesta-border focus:outline-none focus:ring-2 focus:ring-fimdefesta-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Participantes
              </label>
              
              <div className="space-y-2 mb-4">
                {participants.map(participant => (
                  <div 
                    key={participant.id}
                    className="flex items-center justify-between p-2 rounded-md bg-fimdefesta-background border border-fimdefesta-border"
                  >
                    <span>{participant.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipant(participant.id)}
                      className={`
                        p-1.5 rounded-full hover:bg-fimdefesta-primary/20
                        ${participant.id === user?.id ? 'text-fimdefesta-muted cursor-not-allowed' : 'text-fimdefesta-muted hover:text-destructive'}
                      `}
                      disabled={participant.id === user?.id}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                  placeholder="Nome do participante"
                  className="flex-grow px-3 py-2 rounded-md bg-fimdefesta-background border border-fimdefesta-border focus:outline-none focus:ring-2 focus:ring-fimdefesta-primary"
                  onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                />
                <Button
                  type="button"
                  onClick={handleAddParticipant}
                  disabled={!newParticipantName.trim()}
                >
                  <Plus size={18} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Criar Grupo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
