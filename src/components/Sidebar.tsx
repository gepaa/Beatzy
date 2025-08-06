import React from 'react';
import { View } from '../App';
import '../styles/Sidebar.css';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen }) => {
  const navigationItems = [
    { 
      id: 'studio' as View, 
      label: 'Create Beat', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
      ),
      badge: 'Live'
    },
    { 
      id: 'projects' as View, 
      label: 'My Beats', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      badge: '12'
    },
    { 
      id: 'profile' as View, 
      label: 'Profile', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
  ];

  const quickActions = [
    { label: 'New Beat', icon: '➕', action: () => console.log('New beat') },
    { label: 'AI Generate', icon: '🤖', action: () => console.log('AI generate') },
    { label: 'Samples', icon: '🎵', action: () => console.log('Browse samples') }
  ];

  const recentProjects = [
    { name: 'Trap Banger v2', type: 'Trap', modified: '2 hours ago', progress: 85 },
    { name: 'Lo-Fi Chill', type: 'Lo-Fi', modified: '1 day ago', progress: 60 },
    { name: 'Hip Hop Classic', type: 'Hip Hop', modified: '3 days ago', progress: 40 },
    { name: 'Future Bass Drop', type: 'Electronic', modified: '1 week ago', progress: 90 }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-content">
        
        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-title">Navigation</h3>
            <ul className="nav-list">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => onViewChange(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className={`nav-badge ${item.badge === 'Live' ? 'badge-live' : 'badge-count'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Quick Actions */}
        <div className="sidebar-section">
          <h3 className="section-title">Quick Actions</h3>
          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-action-btn"
                onClick={action.action}
                title={action.label}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="sidebar-section">
          <h3 className="section-title">Recent Projects</h3>
          <div className="recent-projects">
            {recentProjects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="project-info">
                  <h4 className="project-name">{project.name}</h4>
                  <p className="project-details">
                    <span className="project-type">{project.type}</span>
                    <span className="project-modified">{project.modified}</span>
                  </p>
                </div>
                <div className="project-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant */}
        <div className="sidebar-section ai-assistant">
          <div className="ai-card glass-card">
            <div className="ai-avatar">
              <div className="ai-pulse"></div>
              🤖
            </div>
            <div className="ai-content">
              <h4 className="ai-title">AI Beat Assistant</h4>
              <p className="ai-description">Ready to help you create amazing beats!</p>
              <button className="btn btn-accent btn-sm">
                Start Creating
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="sidebar-footer">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">24</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">156</span>
              <span className="stat-label">Beats</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Pro</span>
              <span className="stat-label">Plan</span>
            </div>
          </div>
        </div>

      </div>

      {/* Audio Waveform Animation */}
      <div className="sidebar-waveform">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="wave-line"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;