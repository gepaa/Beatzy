import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './components/HomePage';
import BeatStudio from './components/BeatStudio';
import ProjectDashboard from './components/ProjectDashboard';
import UserProfile from './components/UserProfile';
import CreateBeatModal from './components/CreateBeatModal';
import AIBeatGenerator from './components/AIBeatGenerator';
import './styles/global.css';

export type View = 'home' | 'studio' | 'projects' | 'profile' | 'ai-generator';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [, setIsAuthenticated] = useState(false);
  const [shouldCreateBeat, setShouldCreateBeat] = useState(false);

  // Listen for sidebar toggle events from studio page
  React.useEffect(() => {
    const handleToggleSidebar = () => setSidebarOpen(prev => !prev);
    window.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggleSidebar', handleToggleSidebar);
  }, []);

  const handleGetStarted = () => {
    setIsAuthenticated(true);
    setCurrentView('studio');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('studio');
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setCurrentView('studio');
  };

  const handleCreateBeat = () => {
    setShowCreateModal(true);
  };

  const handleChooseAI = () => {
    setShowCreateModal(false);
    setCurrentView('ai-generator');
  };

  const handleChooseManual = () => {
    setShowCreateModal(false);
    setShouldCreateBeat(true);
    setCurrentView('studio');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onGetStarted={handleGetStarted} />;
      case 'studio':
        return (
          <BeatStudio 
            onCreateBeat={handleCreateBeat} 
            shouldCreateBeat={shouldCreateBeat}
            onBeatCreated={() => setShouldCreateBeat(false)}
          />
        );
      case 'projects':
        return <ProjectDashboard />;
      case 'profile':
        return <UserProfile />;
      case 'ai-generator':
        return (
          <AIBeatGenerator 
            onBack={() => setCurrentView('studio')} 
            onGenerate={(options) => {
              console.log('Generating beat with options:', options);
              setCurrentView('studio');
            }}
          />
        );
      default:
        return <HomePage onGetStarted={handleGetStarted} />;
    }
  };

  const isHomePage = currentView === 'home';

  return (
    <div className="app">
      {isHomePage && (
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          isHomePage={isHomePage}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
        />
      )}
      
      {!isHomePage && (
        <>
          <Sidebar 
            currentView={currentView}
            onViewChange={setCurrentView}
            isOpen={sidebarOpen}
            isUniversalMode={true}
          />
          
          <main className={`main-content-fixed ${sidebarOpen ? 'with-sidebar' : 'without-sidebar'}`}>
            <div className="content-container">
              {renderCurrentView()}
            </div>
          </main>

          {/* Floating Menu Button - Only show when sidebar is closed */}
          {!sidebarOpen && (
            <button 
              className="floating-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          )}
        </>
      )}
      
      {isHomePage && renderCurrentView()}
      
      {/* Create Beat Modal */}
      <CreateBeatModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onChooseAI={handleChooseAI}
        onChooseManual={handleChooseManual}
      />
      
      {/* Background ambient effects */}
      <div className="bg-ambient">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
      </div>
    </div>
  );
}

export default App;