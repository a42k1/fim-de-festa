
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/UI/Button';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        toast({
          title: "Login bem-sucedido!",
          description: "Bem-vindo de volta ao Fim de Festa.",
        });
      } else {
        await register(name, email, password);
        toast({
          title: "Registro bem-sucedido!",
          description: "Sua conta foi criada com sucesso.",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: isLogin ? "Falha no login" : "Falha no registro",
        description: "Por favor, verifique seus dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-fimdefesta-surface rounded-xl shadow-lg max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{isLogin ? 'Entrar' : 'Criar Conta'}</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-fimdefesta-background"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-fimdefesta-background border border-fimdefesta-border focus:outline-none focus:ring-2 focus:ring-fimdefesta-primary"
                  placeholder="Seu nome"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-fimdefesta-background border border-fimdefesta-border focus:outline-none focus:ring-2 focus:ring-fimdefesta-primary"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-fimdefesta-background border border-fimdefesta-border focus:outline-none focus:ring-2 focus:ring-fimdefesta-primary"
                placeholder="********"
              />
            </div>
            
            <Button 
              type="submit" 
              fullWidth 
              isLoading={isLoading}
              disabled={isLoading || (!isLogin && !name) || !email || !password}
            >
              {isLogin ? 'Entrar' : 'Registrar'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-fimdefesta-primary hover:underline text-sm"
            >
              {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Entre'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
