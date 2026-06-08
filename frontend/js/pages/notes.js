const NotesPage = {
  documents: [],

  async init() {
    const content = document.getElementById('page-content');
    content.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';
    await this.loadDocuments(content);
  },

  async loadDocuments(content) {
    try {
      const res = await api.get('/notes');
      this.documents = res.data || [];
      this.render(content);
    } catch (err) {
      content.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  render(content) {
    content.innerHTML = `
      <div style="margin-bottom:1.5rem">
        <button class="btn btn-primary" id="upload-btn">+ Upload document</button>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Your documents</h3>
          <span class="badge badge-info">${this.documents.length} files</span>
        </div>
        ${this.documents.length ? this.documents.map((d) => `
          <div class="list-item" data-id="${d.id}">
            <div class="list-item-content">
              <h4>${d.title}</h4>
              <p>${d.mimeType || 'Document'} · ${App.formatDate(d.createdAt)}</p>
            </div>
            <div style="display:flex;gap:0.5rem;align-items:center">
              ${App.statusBadge(d.status)}
              <button class="btn btn-sm btn-secondary" data-summarize="${d.id}">Summarize</button>
              <button class="btn btn-sm btn-danger" data-delete="${d.id}">Delete</button>
            </div>
          </div>
        `).join('') : '<div class="empty-state"><div class="icon">📝</div><p>No documents yet. Upload your study materials!</p></div>'}
      </div>
      <div id="summary-area" style="margin-top:1.5rem"></div>
    `;

    document.getElementById('upload-btn').addEventListener('click', () => this.uploadDocument());

    document.querySelectorAll('[data-summarize]').forEach((btn) => {
      btn.addEventListener('click', () => this.summarize(btn.dataset.summarize));
    });

    document.querySelectorAll('[data-delete]').forEach((btn) => {
      btn.addEventListener('click', () => this.deleteDocument(btn.dataset.delete));
    });
  },

  async uploadDocument() {
    const title = prompt('Document title:');
    if (!title) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.txt,.md,.doc,.docx';
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const initRes = await api.post('/notes/uploads/init', {
          title,
          mime_type: file.type || 'application/octet-stream',
          file_size_bytes: file.size,
        });

        App.showToast('Upload initialized. Processing...');
        const docId = initRes.data.documentId || initRes.data.id;

        if (docId) {
          await api.post(`/notes/${docId}/process`);
        }

        await this.loadDocuments(document.getElementById('page-content'));
      } catch (err) {
        App.showToast(err.message, 'error');
      }
    };
    input.click();
  },

  async summarize(docId) {
    const area = document.getElementById('summary-area');
    area.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';

    try {
      await api.post(`/notes/${docId}/summaries`);
      App.showToast('Summary generation started...');

      const res = await api.get(`/notes/${docId}/summaries/latest`);
      const summary = res.data;

      area.innerHTML = `
        <div class="card">
          <h3 class="card-title" style="margin-bottom:1rem">Latest summary</h3>
          <div style="line-height:1.7">${typeof summary.content === 'string' ? summary.content : `<pre>${JSON.stringify(summary.content, null, 2)}</pre>`}</div>
        </div>
      `;
    } catch (err) {
      area.innerHTML = `<div class="alert alert-error">${err.message}</div>`;
    }
  },

  async deleteDocument(docId) {
    if (!confirm('Delete this document?')) return;

    try {
      await api.delete(`/notes/${docId}`);
      App.showToast('Document deleted');
      await this.loadDocuments(document.getElementById('page-content'));
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },
};
