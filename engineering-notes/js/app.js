const app = {
  currentPage: 'home',
  currentBranch: null,
  currentSubject: null,

  init() {
    this.renderHome();
    this.setupSearch();
    this.setupNavigation();
  },

  setupNavigation() {
    document.querySelector('.logo').addEventListener('click', () => {
      this.showPage('home');
      this.renderHome();
    });
  },

  showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(`page-${pageId}`);
    if (page) page.classList.add('active');
    this.currentPage = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderHome() {
    const container = document.getElementById('page-home');
    container.innerHTML = `
      <section class="hero">
        <h1>Engineering Notes Hub</h1>
        <p>Comprehensive study notes for engineering students across all branches</p>
      </section>
      <div class="branches-grid">
        ${branches.map(b => `
          <div class="branch-card" data-branch="${b.id}">
            <div class="icon">${b.icon}</div>
            <h2>${b.name}</h2>
            <div class="short">${b.short}</div>
            <p>${b.description}</p>
          </div>
        `).join('')}
      </div>
    `;
    container.querySelectorAll('.branch-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.branch;
        this.showBranch(id);
      });
    });
    this.showPage('home');
  },

  showBranch(branchId) {
    const branch = branches.find(b => b.id === branchId);
    if (!branch) return;
    this.currentBranch = branch;
    const container = document.getElementById('page-branch');
    container.innerHTML = `
      <div class="section-header">
        <button class="back-btn" id="back-home">← Back to Branches</button>
      </div>
      <div class="branch-detail-header">
        <div class="icon">${branch.icon}</div>
        <h1>${branch.name}</h1>
        <div class="description">${branch.description}</div>
      </div>
      <div class="subjects-grid">
        ${branch.subjects.map(s => `
          <div class="subject-card" data-subject="${s.id}">
            <h3>${s.name}</h3>
            <div class="code">${s.code}</div>
            <div class="count">${s.notes.length} note${s.notes.length > 1 ? 's' : ''}</div>
          </div>
        `).join('')}
      </div>
    `;
    container.querySelector('#back-home').addEventListener('click', () => this.renderHome());
    container.querySelectorAll('.subject-card').forEach(card => {
      card.addEventListener('click', () => {
        const subjectId = card.dataset.subject;
        this.showSubject(branchId, subjectId);
      });
    });
    this.showPage('branch');
  },

  showSubject(branchId, subjectId) {
    const branch = branches.find(b => b.id === branchId);
    if (!branch) return;
    const subject = branch.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    this.currentSubject = subject;
    const container = document.getElementById('page-subject');
    container.innerHTML = `
      <div class="section-header">
        <button class="back-btn" id="back-branch">← Back to ${branch.short}</button>
      </div>
      <div class="branch-detail-header">
        <h1>${subject.name}</h1>
        <div class="description">${subject.code} — ${branch.name}</div>
      </div>
      <div class="notes-list">
        ${subject.notes.map(n => `
          <div class="note-card" data-note="${n.id}">
            <div class="note-info">
              <h3>${n.title}</h3>
              <div class="topics">
                ${n.topics.map(t => `<span class="topic-tag">${t}</span>`).join('')}
              </div>
            </div>
            <div class="arrow">→</div>
          </div>
        `).join('')}
      </div>
    `;
    container.querySelector('#back-branch').addEventListener('click', () => this.showBranch(branchId));
    container.querySelectorAll('.note-card').forEach(card => {
      card.addEventListener('click', () => {
        const noteId = card.dataset.note;
        this.showNote(branchId, subjectId, noteId);
      });
    });
    this.showPage('subject');
  },

  showNote(branchId, subjectId, noteId) {
    const branch = branches.find(b => b.id === branchId);
    if (!branch) return;
    const subject = branch.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    const note = subject.notes.find(n => n.id === noteId);
    if (!note) return;
    const container = document.getElementById('page-note');
    container.innerHTML = `
      <div class="note-view-header">
        <button class="back-btn" id="back-subject">←</button>
        <div class="note-meta">
          <h2>${note.title}</h2>
          <div class="breadcrumb">${branch.short} / ${subject.name}</div>
        </div>
      </div>
      <div class="note-content">${this.renderMarkdown(note.content)}</div>
    `;
    container.querySelector('#back-subject').addEventListener('click', () => this.showSubject(branchId, subjectId));
    this.showPage('note');
  },

  renderMarkdown(text) {
    let html = text
      .split('\n').map(line => line.trimEnd()).join('\n')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
      .replace(/\|(.+)\|/g, (match) => {
        if (match.includes('---')) return '';
        const cells = match.split('|').filter(c => c.trim()).map(c => c.trim());
        if (match.match(/^\|.+\|$/)) {
          return `<td>${cells.join('</td><td>')}</td>`;
        }
        return match;
      })
      .replace(/((?:<td>.*<\/td>\n?)+)/g, '<tr>$1</tr>')
      .replace(/((?:<tr>.*<\/tr>\n?)+)/g, '<table>$1</table>')
      .replace(/\n\n+/g, '</p><p>')
      .replace(/<p>(.*?)<\/p>/g, (m, c) => {
        const cleaned = c
          .replace(/<h[1-3]>.*?<\/h[1-3]>/g, '')
          .replace(/<ul>.*?<\/ul>/g, '')
          .replace(/<table>.*?<\/table>/g, '')
          .replace(/<li>.*?<\/li>/g, '')
          .replace(/<tr>.*?<\/tr>/g, '')
          .replace(/<td>.*?<\/td>/g, '')
          .trim();
        return cleaned ? `<p>${c}</p>` : c;
      })
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(\n|\s)*<\/p>/g, '');
    return html;
  },

  setupSearch() {
    const input = document.getElementById('search-input');
    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = input.value.trim().toLowerCase();
        if (query.length < 2) {
          if (this.currentPage !== 'home') {
            this.renderHome();
          }
          return;
        }
        this.performSearch(query);
      }, 300);
    });
  },

  performSearch(query) {
    const results = [];
    branches.forEach(branch => {
      branch.subjects.forEach(subject => {
        subject.notes.forEach(note => {
          const matchTitle = note.title.toLowerCase().includes(query);
          const matchTopics = note.topics.some(t => t.toLowerCase().includes(query));
          const matchContent = note.content.toLowerCase().includes(query);
          if (matchTitle || matchTopics || matchContent) {
            results.push({ branch, subject, note });
          }
        });
      });
    });
    const container = document.getElementById('page-home');
    if (results.length === 0) {
      container.innerHTML = `
        <div class="section-header">
          <button class="back-btn" id="clear-search">← Back</button>
        </div>
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try a different search term</p>
        </div>
      `;
      container.querySelector('#clear-search').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        this.renderHome();
      });
    } else {
      container.innerHTML = `
        <div class="section-header">
          <button class="back-btn" id="clear-search">← Back</button>
          <span style="color: var(--text-muted); font-size: 0.9rem;">${results.length} result${results.length > 1 ? 's' : ''}</span>
        </div>
        <div class="notes-list">
          ${results.map(r => `
            <div class="note-card" data-branch="${r.branch.id}" data-subject="${r.subject.id}" data-note="${r.note.id}">
              <div class="note-info">
                <h3>${r.note.title}</h3>
                <div class="topics">
                  <span class="topic-tag">${r.branch.short}</span>
                  <span class="topic-tag">${r.subject.code}</span>
                </div>
              </div>
              <div class="arrow">→</div>
            </div>
          `).join('')}
        </div>
      `;
      container.querySelector('#clear-search').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        this.renderHome();
      });
      container.querySelectorAll('.note-card').forEach(card => {
        card.addEventListener('click', () => {
          const bId = card.dataset.branch;
          const sId = card.dataset.subject;
          const nId = card.dataset.note;
          this.showNote(bId, sId, nId);
        });
      });
    }
    this.showPage('home');
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());
