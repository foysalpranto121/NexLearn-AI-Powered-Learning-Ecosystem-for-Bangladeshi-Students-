const RoadmapPage = {
  roadmap: null,

  async init() {
    const content = document.getElementById('page-content');
    content.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';

    try {
      const res = await api.get('/roadmaps/current');
      this.roadmap = res.data;
      this.render(content);
    } catch {
      this.roadmap = null;
      this.render(content);
    }
  },

  render(content) {
    if (!this.roadmap) {
      content.innerHTML = `
        <div class="card" style="max-width:500px">
          <h3 class="card-title" style="margin-bottom:1rem">Generate your roadmap</h3>
          <p class="text-muted" style="margin-bottom:1.5rem">AI will create a personalized learning path based on your career goals.</p>
          <div id="form-error"></div>
          <form id="generate-form">
            <div class="form-group">
              <label>Target career</label>
              <input type="text" id="target_career" class="form-control" placeholder="e.g. Backend Developer" required>
            </div>
            <div class="form-group">
              <label>Current level</label>
              <select id="current_level" class="form-control">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div class="form-group">
              <label>Timeline (weeks)</label>
              <input type="number" id="timeline_weeks" class="form-control" value="12" min="4" max="52" required>
            </div>
            <button type="submit" class="btn btn-primary" id="gen-btn">Generate roadmap</button>
          </form>
        </div>
      `;

      document.getElementById('generate-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.generate();
      });
      return;
    }

    const nodes = (this.roadmap.nodes || []).sort((a, b) => a.sequenceNo - b.sequenceNo);
    const completed = nodes.filter((n) => n.status === 'completed').length;

    content.innerHTML = `
      <div class="card" style="margin-bottom:1.5rem">
        <div class="card-header">
          <div>
            <h3 class="card-title">${this.roadmap.title}</h3>
            <p class="text-muted text-sm">${this.roadmap.targetCareer} · ${this.roadmap.timelineWeeks} weeks · ${completed}/${nodes.length} completed</p>
          </div>
          ${App.statusBadge(this.roadmap.status)}
        </div>
      </div>
      <div class="roadmap-nodes" id="roadmap-nodes">
        ${nodes.map((n) => `
          <div class="roadmap-node ${n.status}">
            <div>
              <h4>${n.sequenceNo}. ${n.title}</h4>
              <p class="text-muted text-sm">${n.description || ''}</p>
              <div class="node-meta">
                ${App.statusBadge(n.status)}
                ${n.difficulty ? App.statusBadge(n.difficulty) : ''}
                <span class="badge badge-muted">${n.skillTag}</span>
                <span class="badge badge-muted">${n.estimatedHours}h</span>
              </div>
            </div>
            <div style="display:flex;gap:0.5rem;flex-shrink:0">
              ${n.status !== 'completed' ? `<button class="btn btn-sm btn-primary" data-action="complete" data-node="${n.id}">Complete</button>` : ''}
              ${n.status === 'not_started' ? `<button class="btn btn-sm btn-secondary" data-action="start" data-node="${n.id}">Start</button>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const status = btn.dataset.action === 'complete' ? 'completed' : 'in_progress';
        this.updateNodeStatus(btn.dataset.node, status);
      });
    });
  },

  async generate() {
    const btn = document.getElementById('gen-btn');
    const errorEl = document.getElementById('form-error');
    App.clearError(errorEl);
    btn.disabled = true;
    btn.textContent = 'Generating...';

    try {
      const res = await api.post('/roadmaps/generate', {
        target_career: document.getElementById('target_career').value,
        current_level: document.getElementById('current_level').value,
        timeline_weeks: parseInt(document.getElementById('timeline_weeks').value, 10),
      });
      this.roadmap = res.data;
      this.render(document.getElementById('page-content'));
      App.showToast('Roadmap generated!');
    } catch (err) {
      if (err.status === 409) {
        App.showToast('Complete your profile first', 'error');
        window.location.href = 'profile.html';
      } else {
        App.showError(errorEl, err.message);
        btn.disabled = false;
        btn.textContent = 'Generate roadmap';
      }
    }
  },

  async updateNodeStatus(nodeId, status) {
    try {
      await api.patch(`/roadmaps/${this.roadmap.id}/nodes/${nodeId}/status`, { status });
      const node = this.roadmap.nodes.find((n) => n.id === nodeId);
      if (node) node.status = status;
      this.render(document.getElementById('page-content'));
      App.showToast(`Node marked as ${status.replace('_', ' ')}`);
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },
};
