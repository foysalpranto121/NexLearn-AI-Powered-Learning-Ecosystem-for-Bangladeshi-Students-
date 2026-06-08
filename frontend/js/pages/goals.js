const GoalsPage = {
  goals: [],

  async init() {
    const content = document.getElementById('page-content');
    content.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';
    await this.loadGoals(content);
  },

  async loadGoals(content) {
    try {
      const res = await api.get('/goals/today?timezone=Asia/Dhaka');
      this.goals = res.data || [];
      this.render(content);
    } catch (err) {
      content.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  render(content) {
    content.innerHTML = `
      <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <button class="btn btn-primary" id="add-goal-btn">+ Add goal</button>
        <button class="btn btn-secondary" id="suggest-btn">AI suggest goals</button>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Today's goals</h3>
          <span class="badge badge-info">${this.goals.length} goals</span>
        </div>
        <div id="goals-list">
          ${this.goals.length ? this.goals.map((g) => `
            <div class="goal-item" data-id="${g.id}">
              <div class="goal-checkbox${g.status === 'completed' ? ' checked' : ''}" data-complete="${g.id}">
                ${g.status === 'completed' ? '✓' : ''}
              </div>
              <div class="goal-content">
                <h4>${g.title}</h4>
                <p>${g.description || 'No description'}${g.targetMinutes ? ` · ${g.targetMinutes} min` : ''}</p>
              </div>
              ${App.statusBadge(g.status)}
            </div>
          `).join('') : '<div class="empty-state"><div class="icon">🎯</div><p>No goals for today. Add one or let AI suggest!</p></div>'}
        </div>
      </div>
    `;

    document.getElementById('add-goal-btn').addEventListener('click', () => this.addGoal());
    document.getElementById('suggest-btn').addEventListener('click', () => this.suggestGoals());

    document.querySelectorAll('[data-complete]').forEach((el) => {
      el.addEventListener('click', () => this.completeGoal(el.dataset.complete));
    });
  },

  async addGoal() {
    const title = prompt('Goal title:');
    if (!title) return;

    const description = prompt('Description (optional):', '');
    const minutes = prompt('Target minutes (optional):', '30');

    try {
      await api.post('/goals', {
        title,
        description: description || undefined,
        targetMinutes: minutes ? parseInt(minutes, 10) : undefined,
        goalDate: new Date().toISOString().split('T')[0],
      });
      App.showToast('Goal added!');
      await this.loadGoals(document.getElementById('page-content'));
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },

  async suggestGoals() {
    try {
      const res = await api.post('/goals/suggest');
      const suggested = res.data;
      if (Array.isArray(suggested) && suggested.length) {
        App.showToast(`${suggested.length} goals suggested!`);
        await this.loadGoals(document.getElementById('page-content'));
      } else {
        App.showToast('No suggestions available right now');
      }
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },

  async completeGoal(id) {
    try {
      await api.post(`/goals/${id}/complete`);
      App.showToast('Goal completed!');
      await this.loadGoals(document.getElementById('page-content'));
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },
};
