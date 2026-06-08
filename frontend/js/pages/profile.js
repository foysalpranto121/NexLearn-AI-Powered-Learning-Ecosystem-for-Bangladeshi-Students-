const ProfilePage = {
  async init() {
    const content = document.getElementById('page-content');
    content.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';

    try {
      const res = await api.get('/me/profile');
      const p = res.data;
      this.render(content, p);
    } catch {
      this.render(content, {});
    }
  },

  render(content, profile) {
    content.innerHTML = `
      <div class="card" style="max-width:600px">
        <div id="form-error"></div>
        <form id="profile-form">
          <div class="form-group">
            <label for="targetCareer">Target career</label>
            <input type="text" id="targetCareer" class="form-control"
              value="${profile.targetCareer || ''}" placeholder="e.g. Full Stack Developer">
          </div>
          <div class="form-group">
            <label for="currentLevel">Current level</label>
            <select id="currentLevel" class="form-control">
              <option value="beginner" ${profile.currentLevel === 'beginner' ? 'selected' : ''}>Beginner</option>
              <option value="intermediate" ${profile.currentLevel === 'intermediate' ? 'selected' : ''}>Intermediate</option>
              <option value="advanced" ${profile.currentLevel === 'advanced' ? 'selected' : ''}>Advanced</option>
            </select>
          </div>
          <div class="form-group">
            <label for="weeklyHours">Weekly study hours</label>
            <input type="number" id="weeklyHours" class="form-control" min="1" max="80"
              value="${profile.weeklyHours || 10}">
          </div>
          <div class="form-group">
            <label for="learningStyle">Learning style</label>
            <select id="learningStyle" class="form-control">
              <option value="visual" ${profile.learningStyle === 'visual' ? 'selected' : ''}>Visual</option>
              <option value="text" ${profile.learningStyle === 'text' ? 'selected' : ''}>Text / Reading</option>
              <option value="practice" ${profile.learningStyle === 'practice' ? 'selected' : ''}>Hands-on practice</option>
              <option value="mixed" ${profile.learningStyle === 'mixed' || !profile.learningStyle ? 'selected' : ''}>Mixed</option>
            </select>
          </div>
          <div class="form-group">
            <label for="preferredLanguage">Preferred language</label>
            <select id="preferredLanguage" class="form-control">
              <option value="en" ${profile.preferredLanguage === 'en' || !profile.preferredLanguage ? 'selected' : ''}>English</option>
              <option value="bn" ${profile.preferredLanguage === 'bn' ? 'selected' : ''}>বাংলা (Bangla)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="timezone">Timezone</label>
            <select id="timezone" class="form-control">
              <option value="Asia/Dhaka" ${profile.timezone === 'Asia/Dhaka' ? 'selected' : ''}>Asia/Dhaka (BST)</option>
              <option value="UTC" ${profile.timezone === 'UTC' ? 'selected' : ''}>UTC</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary" id="save-btn">Save profile</button>
        </form>
      </div>
    `;

    document.getElementById('profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('save-btn');
      const errorEl = document.getElementById('form-error');
      App.clearError(errorEl);
      btn.disabled = true;
      btn.textContent = 'Saving...';

      try {
        await api.patch('/me/profile', {
          targetCareer: document.getElementById('targetCareer').value,
          currentLevel: document.getElementById('currentLevel').value,
          weeklyHours: parseInt(document.getElementById('weeklyHours').value, 10),
          learningStyle: document.getElementById('learningStyle').value,
          preferredLanguage: document.getElementById('preferredLanguage').value,
          timezone: document.getElementById('timezone').value,
        });
        App.showToast('Profile saved successfully!');
        btn.disabled = false;
        btn.textContent = 'Save profile';
      } catch (err) {
        const msg = Array.isArray(err.data?.message)
          ? err.data.message.join(', ')
          : err.message;
        App.showError(errorEl, msg);
        btn.disabled = false;
        btn.textContent = 'Save profile';
      }
    });
  },
};
