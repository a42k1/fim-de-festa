import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/Auth/AuthModal';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 pt-16 pb-24 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/2 w-[500px] h-[500px] bg-fimdefesta-primary/20 rounded-full blur-3xl -translate-x-1/2" />
          <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-fimdefesta-secondary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-3xl mx-auto text-center z-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">Fim de Festa</span>
          </h1>
          <p className="text-xl md:text-2xl text-fimdefesta-text/90 mb-8">
            A maneira mais simples de dividir a conta entre amigos.
            <br />
            Sem confusões, sem complicações.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="group"
            >
              <span>Começar agora</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-fimdefesta-surface/70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-fimdefesta-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fimdefesta-primary">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Crie um Grupo</h3>
              <p className="text-fimdefesta-muted">Adicione amigos e comece a registrar os itens consumidos.</p>
            </div>
            
            <div className="bg-fimdefesta-surface/70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-fimdefesta-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fimdefesta-primary">
                  <path d="m16 6 4 14"></path>
                  <path d="M12 6v14"></path>
                  <path d="M8 8v12"></path>
                  <path d="M4 4v16"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Divida os Itens</h3>
              <p className="text-fimdefesta-muted">Atribua quem pagará cada item ou divida igualmente entre todos.</p>
            </div>
            
            <div className="bg-fimdefesta-surface/70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-fimdefesta-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fimdefesta-primary">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M7 15h0"></path>
                  <path d="M12 15h0"></path>
                  <path d="M17 15h0"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Finalize o Pagamento</h3>
              <p className="text-fimdefesta-muted">Veja quanto cada um deve pagar e finalize com facilidade.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 border-t border-fimdefesta-border bg-fimdefesta-surface/50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-fimdefesta-primary to-fimdefesta-secondary flex items-center justify-center">
                <span className="font-bold text-xs text-white">FF</span>
              </div>
              <span className="font-medium">Fim de Festa</span>
            </div>
            <p className="text-sm text-fimdefesta-muted">
              © {new Date().getFullYear()} Fim de Festa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default Index;
