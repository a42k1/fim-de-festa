
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useGroups } from '@/context/GroupContext';
import Navbar from '@/components/Layout/Navbar';
import GroupCard from '@/components/Groups/GroupCard';
import Button from '@/components/UI/Button';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { groups, isLoading } = useGroups();
  const navigate = useNavigate();
  
  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (!isAuthenticated) {
    return null; // Will be redirected
  }

  return (
    <div className="min-h-screen flex flex-col bg-fimdefesta-background">
      <Navbar />
      
      <div className="container py-8 flex-grow animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Olá, {user?.name}</h1>
            <p className="text-fimdefesta-muted mt-1">Gerencie suas divisões de contas</p>
          </div>
          
          <Button 
            onClick={() => navigate('/create-group')}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Grupo
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-fimdefesta-primary/20 border-t-fimdefesta-primary rounded-full animate-spin"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-fimdefesta-surface rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Você ainda não tem grupos</h2>
            <p className="text-fimdefesta-muted mb-6">Crie seu primeiro grupo para começar a dividir contas</p>
            <Button 
              onClick={() => navigate('/create-group')}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Criar Grupo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
