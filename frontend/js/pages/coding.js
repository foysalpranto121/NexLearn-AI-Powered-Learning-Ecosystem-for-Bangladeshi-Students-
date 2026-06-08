const CodingPage = {
  challenges: [],
  activeChallenge: null,

  async init() {
    const content = document.getElementById('page-content');
    content.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';

    try {
      const res = await api.get('/coding/challenges?limit=20');
      this.challenges = res.data || [];
      this.renderList(content);
    } catch (err) {
      content.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  renderList(content) {
    content.innerHTML = `
      <div class="challenge-grid" id="challenge-grid">
        ${this.challenges.length ? this.challenges.map((c) => `
          <div class="challenge-card" data-slug="${c.slug}">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.75rem">
              <h4>${c.title}</h4>
              ${App.statusBadge(c.difficulty)}
            </div>
            <p class="text-muted text-sm">${c.skillTag}</p>
          </div>
        `).join('') : '<div class="empty-state"><div class="icon">💻</div><p>No challenges available yet.</p></div>'}
      </div>
      <div id="challenge-detail" style="margin-top:1.5rem"></div>
    `;

    document.querySelectorAll('.challenge-card').forEach((el) => {
      el.addEventListener('click', () => this.loadChallenge(el.dataset.slug));
    });
  },

  async loadChallenge(slug) {
    const detail = document.getElementById('challenge-detail');
    detail.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';

    try {
      const res = await api.get(`/coding/challenges/${slug}`);
      this.activeChallenge = res.data;
      const c = this.activeChallenge;
      const langs = c.supportedLanguages || ['javascript', 'python'];

      detail.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${c.title}</h3>
            ${App.statusBadge(c.difficulty)}
          </div>
          <div style="margin-bottom:1.5rem;line-height:1.7">${this.renderMarkdown(c.descriptionMd || c.description || 'No description')}</div>
          <div class="form-group">
            <label>Language</label>
            <select id="code-lang" class="form-control" style="max-width:200px">
              ${langs.map((l) => `<option value="${l}">${l}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Your code</label>
            <textarea id="source-code" class="form-control code-editor" rows="12">${this.getStarterCode(c)}</textarea>
          </div>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
            <button class="btn btn-secondary" id="run-btn">Run sample</button>
            <button class="btn btn-primary" id="submit-btn">Submit</button>
          </div>
          <div id="result-area" style="margin-top:1rem"></div>
        </div>
      `;

      document.getElementById('run-btn').addEventListener('click', () => this.runSample());
      document.getElementById('submit-btn').addEventListener('click', () => this.submit());
    } catch (err) {
      detail.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  getStarterCode(challenge) {
    const lang = (challenge.supportedLanguages || ['javascript'])[0];
    const starters = challenge.starterCode || {};
    return starters[lang] || '// Write your solution here\n';
  },

  renderMarkdown(md) {
    return md
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:var(--bg);padding:1rem;border-radius:8px;overflow:auto"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code style="background:var(--bg);padding:0.15rem 0.4rem;border-radius:4px">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  },

  async runSample() {
    const result = document.getElementById('result-area');
    result.innerHTML = '<div class="spinner"></div>';

    try {
      const res = await api.post(`/coding/challenges/${this.activeChallenge.id}/run-sample`, {
        language: document.getElementById('code-lang').value,
        source_code: document.getElementById('source-code').value,
      });
      result.innerHTML = `<div class="alert alert-info"><pre>${JSON.stringify(res.data, null, 2)}</pre></div>`;
    } catch (err) {
      result.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  async submit() {
    const result = document.getElementById('result-area');
    result.innerHTML = '<div class="spinner"></div>';

    try {
      const res = await api.post(`/coding/challenges/${this.activeChallenge.id}/submit`, {
        language: document.getElementById('code-lang').value,
        source_code: document.getElementById('source-code').value,
      });
      const sub = res.data;
      result.innerHTML = `
        <div class="alert alert-success">Submission queued! Status: ${sub.status || 'queued'}</div>
        <p class="text-sm text-muted">Submission ID: ${sub.id || '—'}</p>
      `;
      App.showToast('Code submitted!');
    } catch (err) {
      result.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },
};
