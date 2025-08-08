import React, { useState } from 'react';
import '../styles/ProjectDashboard.css';

const ProjectDashboard: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'recent' | 'favorites' | 'shared'>('all');
  const [sortBy, setSortBy] = useState<'modified' | 'name' | 'created'>('modified');


  // Mock project data
  const projects = [
    {
      id: 1,
      name: 'Trap Banger v2',
      genre: 'Trap',
      tempo: 140,
      duration: 180,
      created: '2024-01-15',
      modified: '2024-01-20',
      favorite: true,
      shared: false,
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop&crop=center',
      waveform: Array.from({ length: 50 }, () => Math.random()),
      tags: ['hip-hop', 'trap', 'heavy-bass']
    },
    {
      id: 2,
      name: 'Lo-Fi Chill Session',
      genre: 'Lo-Fi',
      tempo: 85,
      duration: 240,
      created: '2024-01-10',
      modified: '2024-01-19',
      favorite: false,
      shared: true,
      thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=200&fit=crop&crop=center',
      waveform: Array.from({ length: 50 }, () => Math.random()),
      tags: ['chill', 'lo-fi', 'ambient']
    },
    {
      id: 3,
      name: 'Electronic Dreams',
      genre: 'Electronic',
      tempo: 128,
      duration: 200,
      created: '2024-01-12',
      modified: '2024-01-18',
      favorite: true,
      shared: false,
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=200&fit=crop&crop=center',
      waveform: Array.from({ length: 50 }, () => Math.random()),
      tags: ['electronic', 'synth', 'experimental']
    },
    {
      id: 4,
      name: 'Jazz Fusion Experiment',
      genre: 'Jazz',
      tempo: 120,
      duration: 300,
      created: '2024-01-08',
      modified: '2024-01-17',
      favorite: false,
      shared: true,
      thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=200&fit=crop&crop=center',
      waveform: Array.from({ length: 50 }, () => Math.random()),
      tags: ['jazz', 'fusion', 'complex']
    },
    {
      id: 5,
      name: 'Hip Hop Classic',
      genre: 'Hip Hop',
      tempo: 95,
      duration: 210,
      created: '2024-01-05',
      modified: '2024-01-16',
      favorite: true,
      shared: false,
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop&crop=center',
      waveform: Array.from({ length: 50 }, () => Math.random()),
      tags: ['hip-hop', 'classic', 'boom-bap']
    },
    {
      id: 6,
      name: 'R&B Smooth Groove',
      genre: 'R&B',
      tempo: 75,
      duration: 190,
      created: '2024-01-03',
      modified: '2024-01-15',
      favorite: false,
      shared: true,
      thumbnail: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=200&fit=crop&crop=center',
      waveform: Array.from({ length: 50 }, () => Math.random()),
      tags: ['rnb', 'smooth', 'soulful']
    }
  ];

  const filteredProjects = projects.filter(project => {
    switch (filter) {
      case 'recent':
        return new Date(project.modified) >= new Date('2024-01-18');
      case 'favorites':
        return project.favorite;
      case 'shared':
        return project.shared;
      default:
        return true;
    }
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      case 'modified':
      default:
        return new Date(b.modified).getTime() - new Date(a.modified).getTime();
    }
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="project-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">My Projects</h1>
          <p className="dashboard-subtitle">
            Manage and organize your beats and compositions
          </p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17,8 12,3 7,8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import
          </button>
          
          <button className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Project
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎵</div>
          <div className="stat-content">
            <div className="stat-value">{projects.length}</div>
            <div className="stat-label">Total Projects</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <div className="stat-value">{projects.filter(p => p.favorite).length}</div>
            <div className="stat-label">Favorites</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🌐</div>
          <div className="stat-content">
            <div className="stat-value">{projects.filter(p => p.shared).length}</div>
            <div className="stat-label">Shared</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{Math.round(projects.reduce((sum, p) => sum + p.duration, 0) / 60)}</div>
            <div className="stat-label">Total Minutes</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dashboard-controls">
        <div className="filter-section">
          <div className="filter-tabs">
            {[
              { key: 'all', label: 'All Projects', count: projects.length },
              { key: 'recent', label: 'Recent', count: projects.filter(p => new Date(p.modified) >= new Date('2024-01-18')).length },
              { key: 'favorites', label: 'Favorites', count: projects.filter(p => p.favorite).length },
              { key: 'shared', label: 'Shared', count: projects.filter(p => p.shared).length }
            ].map((tab) => (
              <button
                key={tab.key}
                className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                onClick={() => setFilter(tab.key as any)}
              >
                {tab.label}
                <span className="tab-count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="controls-section">
          <div className="search-container">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="search-input"
            />
          </div>

          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="modified">Sort by Modified</option>
            <option value="created">Sort by Created</option>
            <option value="name">Sort by Name</option>
          </select>

          <div className="view-toggle">
            <button className="view-btn active" title="Grid View">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button className="view-btn" title="List View">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {sortedProjects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-thumbnail">
              <img src={project.thumbnail} alt={project.name} />
              <div className="project-overlay">
                <button className="play-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                </button>
              </div>
              
              {/* Favorite Badge */}
              {project.favorite && (
                <div className="project-badge favorite">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
                  </svg>
                </div>
              )}

              {/* Shared Badge */}
              {project.shared && (
                <div className="project-badge shared">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16,6 12,2 8,6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="project-content">
              <div className="project-header">
                <h3 className="project-name">{project.name}</h3>
                <div className="project-menu">
                  <button className="menu-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="project-info">
                <span className="project-genre">{project.genre}</span>
                <span className="project-tempo">{project.tempo} BPM</span>
                <span className="project-duration">{formatDuration(project.duration)}</span>
              </div>

              <div className="project-waveform">
                {project.waveform.slice(0, 25).map((height, i) => (
                  <div 
                    key={i}
                    className="waveform-bar"
                    style={{ height: `${height * 100}%` }}
                  />
                ))}
              </div>

              <div className="project-tags">
                {project.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="project-tag">#{tag}</span>
                ))}
                {project.tags.length > 2 && (
                  <span className="project-tag more">+{project.tags.length - 2}</span>
                )}
              </div>

              <div className="project-footer">
                <div className="project-dates">
                  <span className="project-modified">Modified {formatDate(project.modified)}</span>
                </div>
                
                <div className="project-actions">
                  <button className="action-btn" title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  
                  <button className="action-btn" title="Duplicate">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </button>
                  
                  <button className="action-btn" title="Share">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16,6 12,2 8,6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedProjects.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎵</div>
          <h3 className="empty-title">No projects found</h3>
          <p className="empty-description">
            {filter === 'all' 
              ? "Start creating your first beat to see it here."
              : `No projects match the "${filter}" filter.`
            }
          </p>
          <button className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create New Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;