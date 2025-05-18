import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/Auth/AuthModal';
import { Menu, LogOut, Home, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link
        to={to}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
          {
            'bg-fimdefesta-primary/20 text-fimdefesta-primary': isActive,
            'hover:bg-fimdefesta-surface text-fimdefesta-text': !isActive,
          }
        )}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-fimdefesta-background/80 backdrop-blur-sm border-b border-fimdefesta-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fimdefesta-primary to-fimdefesta-secondary flex items-center justify-center">
                <span className="font-bold text-white">FF</span>
              </div>
              <span className="font-bold text-xl text-fimdefesta-text">Fim de Festa</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" icon={<Home size={18} />} label="Início" />
                <NavLink to="/create-group" icon={<PlusCircle size={18} />} label="Novo Grupo" />
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-fimdefesta-surface border border-fimdefesta-border">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-fimdefesta-primary text-white">
                        {user?.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    <span className="sr-only md:not-sr-only">Sair</span>
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)}>Entrar</Button>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-fimdefesta-surface"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-fimdefesta-background border-l border-fimdefesta-border animate-slide-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-2 border-b border-fimdefesta-border pb-4">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-fimdefesta-surface border border-fimdefesta-border">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-fimdefesta-primary text-white">
                          {user?.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-fimdefesta-muted">{user?.email}</p>
                    </div>
                  </div>
                  
                  <nav className="space-y-1">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-fimdefesta-surface"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Home size={20} />
                      <span>Início</span>
                    </Link>
                    <Link 
                      to="/create-group" 
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-fimdefesta-surface"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <PlusCircle size={20} />
                      <span>Novo Grupo</span>
                    </Link>
                  </nav>
                  
                  <div className="pt-4 border-t border-fimdefesta-border">
                    <button 
                      className="flex items-center gap-2 w-full p-3 text-left rounded-lg hover:bg-fimdefesta-surface"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut size={20} />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  <h2 className="text-lg font-semibold">Bem-vindo ao Fim de Festa</h2>
                  <p className="text-sm text-fimdefesta-muted">Faça login para dividir contas com seus amigos.</p>
                  <Button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Entrar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
