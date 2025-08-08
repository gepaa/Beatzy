import React from 'react';
import '../styles/UserProfile.css';

const UserProfile: React.FC = () => {

  const user = {
    name: 'Alex Producer',
    username: '@alexbeats',
    email: 'alex@beatzy.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
    plan: 'Pro Member',
    joinDate: '2023-06-15',
    stats: {
      projects: 24,
      beats: 156,
      collaborations: 8,
      followers: 1247
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-banner">
          <img 
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=200&fit=crop&crop=center" 
            alt="Profile Banner" 
            className="banner-image"
          />
        </div>
        
        <div className="profile-info">
          <div className="profile-avatar">
            <img src={user.avatar} alt={user.name} className="avatar-image" />
            <div className="avatar-status online" />
          </div>
          
          <div className="profile-details">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-username">{user.username}</p>
            <div className="profile-badges">
              <span className="badge pro">{user.plan}</span>
              <span className="badge verified">Verified</span>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="btn btn-primary">Edit Profile</button>
            <button className="btn btn-secondary">Settings</button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          {/* Stats */}
          <div className="stats-card card">
            <h3 className="card-title">Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{user.stats.projects}</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user.stats.beats}</span>
                <span className="stat-label">Beats</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user.stats.collaborations}</span>
                <span className="stat-label">Collabs</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user.stats.followers}</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="account-card card">
            <h3 className="card-title">Account Details</h3>
            <div className="account-details">
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Member Since</span>
                <span className="detail-value">
                  {new Date(user.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Plan</span>
                <span className="detail-value plan-value">{user.plan}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-card card">
            <h3 className="card-title">Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export All Projects
              </button>
              
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16,6 12,2 8,6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                Backup Library
              </button>
              
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
                Usage Report
              </button>
            </div>
          </div>
        </div>

        <div className="profile-main">
          {/* Recent Activity */}
          <div className="activity-card card">
            <h3 className="card-title">Recent Activity</h3>
            <div className="activity-timeline">
              <div className="activity-item">
                <div className="activity-icon create">🎵</div>
                <div className="activity-content">
                  <div className="activity-text">Created project "Trap Banger v2"</div>
                  <div className="activity-time">2 hours ago</div>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon share">🌐</div>
                <div className="activity-content">
                  <div className="activity-text">Shared "Lo-Fi Chill Session" with the community</div>
                  <div className="activity-time">1 day ago</div>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon collaborate">🤝</div>
                <div className="activity-content">
                  <div className="activity-text">Started collaboration on "Jazz Fusion Mix"</div>
                  <div className="activity-time">3 days ago</div>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon achievement">🏆</div>
                <div className="activity-content">
                  <div className="activity-text">Earned "Beat Master" badge</div>
                  <div className="activity-time">1 week ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="preferences-card card">
            <h3 className="card-title">Preferences</h3>
            <div className="preferences-grid">
              <div className="preference-section">
                <h4 className="section-title">Audio Settings</h4>
                <div className="preference-item">
                  <label className="preference-label">
                    <input type="checkbox" defaultChecked />
                    <span>Auto-save projects</span>
                  </label>
                </div>
                <div className="preference-item">
                  <label className="preference-label">
                    <input type="checkbox" defaultChecked />
                    <span>High quality audio export</span>
                  </label>
                </div>
                <div className="preference-item">
                  <label className="preference-label">
                    <input type="checkbox" />
                    <span>Enable audio compression</span>
                  </label>
                </div>
              </div>

              <div className="preference-section">
                <h4 className="section-title">Notifications</h4>
                <div className="preference-item">
                  <label className="preference-label">
                    <input type="checkbox" defaultChecked />
                    <span>New collaboration invites</span>
                  </label>
                </div>
                <div className="preference-item">
                  <label className="preference-label">
                    <input type="checkbox" defaultChecked />
                    <span>Beat sharing notifications</span>
                  </label>
                </div>
                <div className="preference-item">
                  <label className="preference-label">
                    <input type="checkbox" />
                    <span>Weekly digest emails</span>
                  </label>
                </div>
              </div>

              <div className="preference-section">
                <h4 className="section-title">Privacy</h4>
                <div className="preference-item">
                  <label className="preference-label">
                    <input type="checkbox" />
                    <span>Make profile public</span>
                  </label>
                </div>
                <div className="preference-item">
                  <label className="preference-label">
                    <input type="checkbox" defaultChecked />
                    <span>Allow collaboration requests</span>
                  </label>
                </div>
                <div className="preference-item">
                  <label className="preference-label">
                    <input type="checkbox" defaultChecked />
                    <span>Show online status</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Plan & Billing */}
          <div className="billing-card card">
            <h3 className="card-title">Plan & Billing</h3>
            <div className="plan-info">
              <div className="current-plan">
                <div className="plan-header">
                  <h4 className="plan-name">Pro Plan</h4>
                  <span className="plan-price">$19/month</span>
                </div>
                <div className="plan-features">
                  <div className="feature-item">✓ Unlimited projects</div>
                  <div className="feature-item">✓ AI beat generation</div>
                  <div className="feature-item">✓ Advanced export options</div>
                  <div className="feature-item">✓ Collaboration tools</div>
                  <div className="feature-item">✓ Priority support</div>
                </div>
              </div>
              
              <div className="billing-actions">
                <button className="btn btn-secondary">Manage Billing</button>
                <button className="btn btn-accent">Upgrade Plan</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;