const DashboardPage = {
  async init() {
    const content = document.getElementById('page-content');
    content.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';

    try {
      const safeGet = async (endpoint, fallback) => {
        try {
          const res = await api.get(endpoint);
          return res || fallback;
        } catch (err) {
          console.warn(`Dashboard: ${endpoint} failed`, err.message);
          return fallback;
        }
      };

      const [overview, streak, goals, roadmap] = await Promise.all([
        safeGet('/analytics/overview', { data: {} }),
        safeGet('/gamification/streak', { data: {} }),
        safeGet('/goals/today', { data: [] }),
        safeGet('/roadmaps/current', { data: null }),
      ]);

      const o = overview.data || {};
      const s = streak.data || {};
      const goalList = goals.data || [];
      const rm = roadmap.data;

      content.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Current streak</div>
            <div class="stat-value primary">${s.currentStreak ?? 0} days</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">XP earned</div>
            <div class="stat-value warning">${o.xp ?? 0}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Study minutes</div>
            <div class="stat-value info">${o.total_study_minutes ?? 0}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Roadmap progress</div>
            <div class="stat-value">${o.roadmap_progress_percentage ?? 0}%</div>
          </div>
        </div>

        <div class="content-grid">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Today's goals</h3>
              <a href="goals.html" class="btn btn-sm btn-secondary">View all</a>
            </div>
            ${goalList.length ? goalList.map((g) => `
              <div class="list-item">
                <div class="list-item-content">
                  <h4>${g.title}</h4>
                  <p>${g.description || 'No description'}</p>
                </div>
                ${App.statusBadge(g.status)}
              </div>
            `).join('') : '<div class="empty-state"><div class="icon">🎯</div><p>No goals for today. <a href="goals.html">Add one</a></p></div>'}
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Active roadmap</h3>
              <a href="roadmap.html" class="btn btn-sm btn-secondary">View roadmap</a>
            </div>
            ${rm ? `
              <h4 style="margin-bottom:0.5rem">${rm.title}</h4>
              <p class="text-muted text-sm">${rm.targetCareer} · ${rm.timelineWeeks} weeks · ${App.statusBadge(rm.status)}</p>
              <p class="text-sm" style="margin-top:1rem">${(rm.nodes || []).filter(n => n.status === 'completed').length} of ${(rm.nodes || []).length} nodes completed</p>
            ` : '<div class="empty-state"><div class="icon">🗺️</div><p>No roadmap yet. <a href="roadmap.html">Generate one</a></p></div>'}
          </div>
        </div>

        <div class="card" style="margin-top:1.5rem">
          <div class="card-header">
            <h3 class="card-title">Quick actions</h3>
          </div>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
            <a href="ai-tutor.html" class="btn btn-primary">Ask AI Tutor</a>
            <a href="coding.html" class="btn btn-secondary">Practice coding</a>
            <a href="notes.html" class="btn btn-secondary">Upload notes</a>
            <a href="profile.html" class="btn btn-secondary">Edit profile</a>
          </div>
        </div>
      `;
    } catch (err) {
      content.innerHTML = `<div class="alert alert-error">Failed to load dashboard: ${err.message}</div>`;
    }
  },
};
