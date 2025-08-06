import { useState } from 'react';
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
    setCurrentView('studio');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onGetStarted={handleGetStarted} />;
      case 'studio':
        return <BeatStudio onCreateBeat={handleCreateBeat} />;
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
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        isHomePage={isHomePage}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
      
      {!isHomePage && (
        <div className="app-layout">
          <Sidebar 
            currentView={currentView}
            onViewChange={setCurrentView}
            isOpen={sidebarOpen}
          />
          
          <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            {renderCurrentView()}
          </main>
        </div>
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