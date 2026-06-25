const app = {
  currentPage: 'home',
  currentBranch: null,
  currentSubject: null,

  init() {
    this.setupEventListeners();
    this.setupWindowConfig();
    this.setupWeatherConfig();
  },

  setupEventListeners() {
    const form = document.getElementById('calculator-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.calculateACCapacity();
      });

      const windowConfig = document.getElementById('window-config');
      if (windowConfig) {
        windowConfig.addEventListener('change', () => this.setupWindowConfig());
      }
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const query = searchInput.value.trim().toLowerCase();
          if (query.length < 2) {
            if (app.currentPage !== 'home') {
              app.renderHome();
            }
            return;
          }
          app.performSearch(query);
        }, 300);
      });
    }

    const logo = document.querySelector('.logo');
    if (logo) {
      logo.addEventListener('click', () => {
        app.showPage('home');
        app.renderHome();
      });
    }
  },

  setupWindowConfig() {
    const windowConfig = document.getElementById('window-config');
    const windowsFactor = document.getElementById('windows-factor');
    if (windowConfig && windowsFactor) {
      const selectedOption = windowConfig.options[windowConfig.selectedIndex];
      let factor = 1.0;
      let description = 'No glazed opening in wall';

      for (const [key, config] of Object.entries(WINDOW_CONFIGS)) {
        if (config.type && selectedOption.value.startsWith(key)) {
          factor = config.factor || 1.0;
          description = config.name;
          break;
        }
      }

      windowsFactor.value = factor.toFixed(2);
    }
  },

  setupWeatherConfig() {
    const weatherSelect = document.getElementById('weather-condition');
    const weatherLabel = document.getElementById('weather-label');
    if (weatherSelect && weatherLabel) {
      weatherSelect.addEventListener('change', () => {
        const selected = weatherSelect.options[weatherSelect.selectedIndex];
        weatherLabel.textContent = selected.text;
      });
    }
  },

  calculateACCapacity() {
    const form = document.getElementById('calculator-form');
    const resultsSection = document.getElementById('results-section');
    const capacityValue = document.getElementById('capacity-value');
    const recommendation = document.getElementById('recommendation');
    const specsGrid = document.getElementById('specs-grid');

    if (!form || !resultsSection || !capacityValue || !recommendation || !specsGrid) return;

    const formData = new FormData(form);
    const length = parseFloat(formData.get('room-length'));
    const width = parseFloat(formData.get('room-width'));
    const height = parseFloat(formData.get('room-height'));
    const roofType = formData.get('roof-type');
    const orientation = formData.get('orientation');
    const construction = formData.get('construction');
    const windowConfig = formData.get('window-config');
    const windowFactor = parseFloat(formData.get('windows-factor'));
    const peopleCount = parseInt(formData.get('people-count'));
    const illumination = parseInt(formData.get('illumination'));
    const hasComputer = formData.get('has-computer') === 'on';
    const hasTV = formData.get('has-tv') === 'on';
    const hasFridge = formData.get('has-fridge') === 'on';
    const lampsCount = parseInt(formData.get('has-lamps'));
    const weatherCondition = formData.get('weather-condition');
    const ceilingHeight = parseFloat(formData.get('ceiling-height'));
    const additionalPartitions = parseInt(formData.get('additional-partitions'));

    let baseBTU = this.calculateBaseBTU(length, width, height);
    let totalBTU = this.applyAllFactors(baseBTU, {
      roofType, orientation, construction, windowFactor,
      peopleCount, illumination, hasComputer, hasTV, hasFridge,
      lampsCount, weatherCondition, ceilingHeight, additionalPartitions
    });

    this.displayResults(totalBTU, {
      length, width, height, baseBTU,
      roofType, orientation, construction, windowConfig,
      windowFactor, peopleCount, illumination, hasComputer, hasTV, hasFridge,
      lampsCount, weatherCondition, ceilingHeight, additionalPartitions
    });

    resultsSection.classList.add('show');
    capacityValue.textContent = Math.round(totalBTU);
    recommendation.textContent = this.getRecommendation(totalBTU);
    recommendation.className = `recommendation ${this.getRecommendationClass(totalBTU)}`;

    this.renderSpecsGrid(baseBTU, totalBTU, {
      length, width, height,
      roofType, orientation, construction, windowConfig,
      peopleCount, illumination, hasComputer, hasTV, hasFridge,
      lampsCount, weatherCondition, ceilingHeight, additionalPartitions
    });
  },

  calculateBaseBTU(length, width, height) {
    return length * width * height * 3;
  },

  applyAllFactors(baseBTU, data) {
    let total = baseBTU;

    total *= this.getRoofFactor(data.roofType);
    total *= this.getOrientationFactor(data.orientation);
    total *= this.getConstructionFactor(data.construction);
    total *= data.windowFactor;
    total *= this.getPeopleFactor(data.peopleCount);
    total *= this.getEquipmentFactors(data);
    total *= this.getWeatherFactor(data.weatherCondition);
    total *= this.getCeilingFactor(data.ceilingHeight);
    total *= (1 + (data.additionalPartitions * FORMULAS.MISC.INTERIOR_PARTITIONS));

    return total;
  },

  getRoofFactor(roofType) {
    const roofFactors = {
      'hot': FORMULAS.ROOF_SOLAR_GAIN,
      'shaded': FORMULAS.ROOF_SHADED,
      'enclosed': FORMULAS.ROOF_ENCLOSED
    };
    return roofFactors[roofType] || 1.0;
  },

  getOrientationFactor(orientation) {
    const orientationFactors = {
      'south': FORMULAS.ROOM_ORIENTATION.SOUTH,
      'north': FORMULAS.ROOM_ORIENTATION.NORTH,
      'east': FORMULAS.ROOM_ORIENTATION.EAST,
      'west': FORMULAS.ROOM_ORIENTATION.WEST,
      'any': FORMULAS.ROOM_ORIENTATION.ANY
    };
    return orientationFactors[orientation] || 1.0;
  },

  getConstructionFactor(construction) {
    const constructionFactors = {
      'wood': FORMULAS.CONSTRUCTION.WOOD_FLOORS,
      'concrete': FORMULAS.CONSTRUCTION.CONCRETE_FLOORS,
      'insulated': FORMULAS.CONSTRUCTION.INSULATED_ROOF,
      'non-insulated': FORMULAS.CONSTRUCTION.NON_INSULATED_ROOF,
      'glass': FORMULAS.CONSTRUCTION.GLASS_WALL,
      'masonry': FORMULAS.CONSTRUCTION.MASONRY_WALL,
      'double-glass': FORMULAS.CONSTRUCTION.DOUBLE_GLASS,
      'single-glass': FORMULAS.CONSTRUCTION.SINGLE_GLASS
    };
    return constructionFactors[construction] || 1.0;
  },

  getPeopleFactor(peopleCount) {
    const heatPerPerson = FORMULAS.PEOPLE_LOAD.RESIDENTIAL;
    return 1 + (peopleCount - 1) * (FORMULAS.PEOPLE_LOAD.OFFICE / heatPerPerson);
  },

  getEquipmentFactors(data) {
    let equipmentFactor = 1.0;

    if (data.hasComputer) equipmentFactor += FORMULAS.EQUIPMENT_LOAD.COMPUTER / 100;
    if (data.hasTV) equipmentFactor += FORMULAS.EQUIPMENT_LOAD.TV_SET / 100;
    if (data.hasFridge) equipmentFactor += FORMULAS.EQUIPMENT_LOAD.REFRIGERATOR / 100;
    equipmentFactor += data.lampsCount * FORMULAS.EQUIPMENT_LOAD.LAMP / 100;

    return equipmentFactor;
  },

  getWeatherFactor(weatherCondition) {
    const weatherFactors = {
      'standard': WEATHER_CONDITIONS.DEFAULT.correction,
      'hot': WEATHER_CONDITIONS.HOT_WEATHER.correction,
      'moderate': WEATHER_CONDITIONS.MODERATE.correction,
      'cold': WEATHER_CONDITIONS.COLD.correction
    };
    return 1 + (weatherFactors[weatherCondition] || 0);
  },

  getCeilingFactor(ceilingHeight) {
    if (ceilingHeight > 8) {
      return 1 + ((ceilingHeight - 8) * 0.25);
    }
    return 1.0;
  },

  getRecommendation(btu) {
    if (btu < 12000) return 'Small AC (1 Ton) - Suitable for small rooms';
    if (btu < 18000) return 'Medium AC (1.5 Ton) - Good for medium-sized rooms';
    if (btu < 24000) return 'Large AC (2 Ton) - Ideal for larger rooms';
    if (btu < 36000) return 'Very Large AC (3 Ton) - For large or poorly insulated spaces';
    return 'Multiple AC units or commercial unit recommended';
  },

  getRecommendationClass(btu) {
    if (btu < 12000) return 'good';
    if (btu < 24000) return 'warning';
    return 'danger';
  },

  renderSpecsGrid(baseBTU, totalBTU, data) {
    const specsGrid = document.getElementById('specs-grid');
    if (!specsGrid) return;

    specsGrid.innerHTML = `
      <div class="spec-card">
        <h3>Room Size</h3>
        <div class="spec-value">${data.length} × ${data.width} × ${data.height} ft</div>
        <div class="spec-label">Volume: ${(data.length * data.width * data.height).toFixed(1)} cubic ft</div>
      </div>
      <div class="spec-card">
        <h3>Base Capacity</h3>
        <div class="spec-value">${Math.round(baseBTU)} BTU</div>
        <div class="spec-label">Without any adjustments</div>
      </div>
      <div class="spec-card">
        <h3>Final Capacity</h3>
        <div class="spec-value">${Math.round(totalBTU)} BTU</div>
        <div class="spec-label">With all factors applied</div>
      </div>
      <div class="spec-card">
        <h3>AC Tonnage</h3>
        <div class="spec-value">${(totalBTU / FORMULAS.TON_TO_BTU).toFixed(1)} Ton</div>
        <div class="spec-label">Theoretical AC size needed</div>
      </div>
    `;
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
        app.renderHome();
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
        app.renderHome();
      });
      container.querySelectorAll('.note-card').forEach(card => {
        card.addEventListener('click', () => {
          const bId = card.dataset.branch;
          const sId = card.dataset.subject;
          const nId = card.dataset.note;
          app.showNote(bId, sId, nId);
        });
      });
    }
    this.showPage('home');
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());