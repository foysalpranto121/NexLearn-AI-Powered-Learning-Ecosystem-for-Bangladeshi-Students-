const AiTutorPage = {
  sessions: [],
  activeSessionId: null,

  async init() {
    const content = document.getElementById('page-content');
    content.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';

    try {
      const res = await api.get('/ai/study/sessions?limit=20');
      this.sessions = res.data || [];
      this.render(content);
    } catch (err) {
      content.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  render(content) {
    content.innerHTML = `
      <div class="chat-layout">
        <div class="session-list">
          <div class="session-list-header">
            <button class="btn btn-primary btn-sm btn-block" id="new-session-btn">+ New session</button>
          </div>
          <div class="session-items" id="session-items">
            ${this.sessions.length ? this.sessions.map((s) => `
              <div class="session-item${s.id === this.activeSessionId ? ' active' : ''}" data-id="${s.id}">
                <h4>${s.title || 'Untitled'}</h4>
                <p>${s.subject || 'General'} · ${App.formatRelative(s.updatedAt || s.createdAt)}</p>
              </div>
            `).join('') : '<div class="empty-state"><p>No sessions yet</p></div>'}
          </div>
        </div>
        <div class="chat-panel">
          <div class="chat-messages" id="chat-messages">
            <div class="message system">Select a session or start a new one</div>
          </div>
          <div class="chat-input-area">
            <input type="text" class="form-control" id="chat-input" placeholder="Ask your question..." disabled>
            <button class="btn btn-primary" id="send-btn" disabled>Send</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('new-session-btn').addEventListener('click', () => this.createSession());
    document.getElementById('send-btn').addEventListener('click', () => this.sendMessage());
    document.getElementById('chat-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    document.querySelectorAll('.session-item').forEach((el) => {
      el.addEventListener('click', () => this.loadSession(el.dataset.id));
    });
  },

  async createSession() {
    const title = prompt('Session title:', 'Study session');
    if (!title) return;

    const subject = prompt('Subject (optional):', 'General');
    const mode = prompt('Mode (tutor/quiz_help/debugging/revision):', 'tutor');

    try {
      const res = await api.post('/ai/study/sessions', { title, subject, mode: mode || 'tutor' });
      this.sessions.unshift(res.data);
      this.activeSessionId = res.data.id;
      this.render(document.getElementById('page-content'));
      this.loadSession(res.data.id);
      App.showToast('Session created');
    } catch (err) {
      if (err.status === 409) {
        App.showToast('Complete your profile first', 'error');
        window.location.href = 'profile.html';
      } else {
        App.showToast(err.message, 'error');
      }
    }
  },

  async loadSession(id) {
    this.activeSessionId = id;
    document.querySelectorAll('.session-item').forEach((el) => {
      el.classList.toggle('active', el.dataset.id === id);
    });

    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    input.disabled = false;
    sendBtn.disabled = false;

    const messagesEl = document.getElementById('chat-messages');
    messagesEl.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';

    try {
      const res = await api.get(`/ai/study/sessions/${id}`);
      const session = res.data;
      const messages = session.messages || [];

      messagesEl.innerHTML = messages.length
        ? messages.map((m) => `<div class="message ${m.role}">${this.escapeHtml(m.content)}</div>`).join('')
        : '<div class="message system">Start the conversation — ask anything!</div>';

      messagesEl.scrollTop = messagesEl.scrollHeight;
    } catch (err) {
      messagesEl.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  async sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message || !this.activeSessionId) return;

    const messagesEl = document.getElementById('chat-messages');
    messagesEl.innerHTML += `<div class="message user">${this.escapeHtml(message)}</div>`;
    input.value = '';
    input.disabled = true;
    document.getElementById('send-btn').disabled = true;

    try {
      const res = await api.post(`/ai/study/sessions/${this.activeSessionId}/messages`, { message });
      const reply = res.data;
      const content = reply.content || reply.message || JSON.stringify(reply);
      messagesEl.innerHTML += `<div class="message assistant">${this.escapeHtml(content)}</div>`;
      messagesEl.scrollTop = messagesEl.scrollHeight;
    } catch (err) {
      if (err.status === 409) {
        App.showToast('Complete your profile to use AI Tutor', 'error');
        window.location.href = 'profile.html';
      } else {
        messagesEl.innerHTML += `<div class="message system">Error: ${err.message}</div>`;
      }
    } finally {
      input.disabled = false;
      document.getElementById('send-btn').disabled = false;
      input.focus();
    }
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
};
