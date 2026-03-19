// ── SCHEDULE DATA (loaded from schedule.json) ──
let CAL_DATA = {};

function esc(s) { return String(s).replace(/&/g, '&amp;'); }

function renderSchedule(data) {
  const root = document.getElementById('scheduleRoot');
  let html = '';
  data.days.forEach((day, i) => {
    const delay = ((i + 1) * 0.05).toFixed(2);
    html += `<div class="day-block" style="animation-delay:${delay}s">
      <div class="day-header">
        <div class="day-num">${day.day}</div>
        <div class="day-info">
          <div class="day-name">${esc(day.name)}</div>
          <div class="day-date">${esc(day.date)}</div>
        </div>
        <div class="day-rule"></div>
      </div>`;
    day.sections.forEach(sec => {
      const hlCls = sec.highlight ? ' highlight-section' : '';
      html += `<div class="sport-section${hlCls}" data-sport="${sec.sport}">
        <div class="sport-label">
          <span class="sport-icon"><svg class="sport-svg"><use href="#${sec.icon}"/></svg></span>
          <span class="sport-name">${esc(sec.label)}</span>
          <span class="sport-venue">${esc(sec.venue)}</span>
        </div>
        <div class="matches">`;
      sec.matches.forEach(m => {
        const resultCls = m.result ? ` ${m.result}` : '';
        const tbdCls    = m.tbd ? ' tbd' : '';
        const oppLower  = m.opp.toLowerCase();
        const splashAttrs = ` data-opp="${oppLower}" data-opp-name="${esc(m.opp)}" data-time="${esc(m.time)}" data-date="${esc(day.date)}" data-label="${esc(sec.label)}" data-venue="${esc(sec.venue)}"${m.result ? ` data-result="${m.result}"` : ''}`;
        html += `<div class="match-row${resultCls}"${splashAttrs}>
          <div class="match-time${tbdCls}">${esc(m.time)}</div>
          <div class="match-teams"><img class="team-logo" src="public/images/site.png" alt="SITE"><span class="team site">SITE</span><span class="vs-tag">VS</span><img class="team-logo" src="public/images/${oppLower}.png" alt="${esc(m.opp)}"><span class="team opp t-${oppLower}">${esc(m.opp)}</span></div>
          <div class="match-multi"></div>
        </div>`;
      });
      html += `</div></div>`;
    });
    html += `</div>`;
  });
  root.innerHTML = html;
}

function buildCalData(data) {
  const out = {};
  for (const day of data.days) {
    out[day.day] = {
      name: day.name, date: day.date,
      sections: day.sections.map(sec => {
        const hasMen    = /\bMen\b/.test(sec.label);
        const hasWomen  = /\bWomen\b/.test(sec.label);
        const isDoubles = /\bDoubles\b/.test(sec.label);
        let gLabel = '', gCls = '';
        if ((hasMen && hasWomen) || isDoubles) { gLabel = 'Mixed'; gCls = 'gmix'; }
        else if (hasWomen) { gLabel = 'Women'; gCls = 'gw'; }
        else if (hasMen)   { gLabel = 'Men';   gCls = 'gm'; }
        return {
          sport: sec.sport, icon: `#${sec.icon}`,
          label: sec.label, venue: sec.venue,
          matches: sec.matches.map(m => ({
            time: m.time, opp: m.opp, oCls: m.opp.toLowerCase(),
            tbd: m.tbd || false, gLabel, gCls
          }))
        };
      })
    };
  }
  return out;
}

CAL_DATA = buildCalData(SCHEDULE_DATA);
renderSchedule(SCHEDULE_DATA);

// ── Stats strip
(function() {
  const allSections = SCHEDULE_DATA.days.flatMap(d => d.sections);
  const allMatches  = allSections.flatMap(s => s.matches);
  const sports      = new Set(allSections.map(s => s.sport));
  const opponents   = new Set(allMatches.map(m => m.opp));
  document.getElementById('statDays').textContent      = SCHEDULE_DATA.days.length;
  document.getElementById('statSports').textContent    = sports.size;
  document.getElementById('statOpponents').textContent = opponents.size;
  document.getElementById('statMatches').textContent   = allMatches.length;
})();

// Gender gradient: tag each sport section from its heading text
document.querySelectorAll('.sport-section').forEach(sec => {
  const name = sec.querySelector('.sport-name')?.textContent || '';
  const hasMen    = /\bMen\b/.test(name);
  const hasWomen  = /\bWomen\b/.test(name);
  const isDoubles = /\bDoubles\b/.test(name);
  if ((hasMen && hasWomen) || isDoubles) sec.dataset.gender = 'mixed';
  else if (hasWomen) sec.dataset.gender = 'women';
  else if (hasMen)   sec.dataset.gender = 'men';
});

const SPORT_CHIP_CLR = {
  basketball:'#e8843a', volleyball:'#4a90d9', beach:'#3ab8c8',
  chess:'#9b72cf', scrabble:'#4aba7a', tabletennis:'#e05555', badminton:'#d4a83a'
};

function buildCalGrid(activeFilter) {
  const grid = document.getElementById('calGrid');
  const gameDays = new Set([18,19,23,24,25]);
  const startDow = new Date(2026, 2, 1).getDay(); // 0 = Sunday
  let html = '';

  for (let i = 0; i < startDow; i++) html += '<div class="cal-cell empty"></div>';

  for (let d = 1; d <= 31; d++) {
    const isGame = gameDays.has(d);
    const isToday = d === 18;
    let cls = 'cal-cell';
    if (isGame) cls += ' game-day';
    if (isToday) cls += ' today';

    html += `<div class="${cls}"${isGame ? ` data-day="${d}" onclick="openAgenda(${d})"` : ''}>`;
    html += `<div class="cal-cell-num">${d}</div>`;

    if (isGame && CAL_DATA[d]) {
      const secs = activeFilter === 'all'
        ? CAL_DATA[d].sections
        : CAL_DATA[d].sections.filter(s => s.sport === activeFilter);

      // One chip per unique sport type
      const seen = new Set(), chips = [];
      for (const sec of secs) {
        if (!seen.has(sec.sport)) { seen.add(sec.sport); chips.push(sec); }
      }

      html += '<div class="cal-chips">';
      const visible = chips.slice(0, 3);
      const overflow = chips.length - 3;
      for (const sec of visible) {
        const bg = SPORT_CHIP_CLR[sec.sport] || '#888';
        html += `<div class="cal-chip" style="background:${bg}">`;
        html += `<svg viewBox="0 0 24 24"><use href="${sec.icon}"/></svg>`;
        html += `${sec.label.split(' — ')[0]}`;
        html += `</div>`;
      }
      if (overflow > 0) html += `<div class="cal-chip-more">+${overflow} more</div>`;
      html += '</div>';
    }
    html += '</div>';
  }

  const totalCells = startDow + 31;
  const rem = totalCells % 7;
  if (rem !== 0) for (let i = 0; i < 7 - rem; i++) html += '<div class="cal-cell empty"></div>';

  grid.innerHTML = html;
}

function openAgenda(day) {
  const agendaEl = document.getElementById('calAgenda');
  const dayData  = CAL_DATA[day];
  if (!dayData) return;

  document.querySelectorAll('.cal-cell.selected').forEach(c => c.classList.remove('selected'));
  const cell = document.querySelector(`.cal-cell[data-day="${day}"]`);
  if (cell) cell.classList.add('selected');

  // Toggle if same day clicked again
  if (agendaEl.dataset.openDay == day && agendaEl.style.display !== 'none') {
    agendaEl.style.display = 'none';
    agendaEl.dataset.openDay = '';
    if (cell) cell.classList.remove('selected');
    return;
  }
  agendaEl.dataset.openDay = day;

  const af = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const sections = af === 'all' ? dayData.sections : dayData.sections.filter(s => s.sport === af);
  const total = sections.reduce((n, s) => n + s.matches.length, 0);

  let html = `
    <div class="agenda-hd">
      <div class="agenda-hd-num">${day}</div>
      <div class="agenda-hd-info">
        <div class="agenda-hd-name">${dayData.name}</div>
        <div class="agenda-hd-date">${dayData.date}</div>
      </div>
      <div class="agenda-count">${total} match${total !== 1 ? 'es' : ''}</div>
      <button class="agenda-close" onclick="closeAgenda()" aria-label="Close">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="agenda-sections">`;

  for (const sec of sections) {
    html += `<div class="agenda-sport-group">
      <div class="agenda-sport-hd">
        <svg viewBox="0 0 24 24"><use href="${sec.icon}"/></svg>
        ${sec.label}
        <span class="agenda-sport-venue">${sec.venue}</span>
      </div>`;
    for (const m of sec.matches) {
      html += `
      <div class="agenda-match opp-${m.oCls}">
        <div class="agenda-time${m.tbd ? ' tbd' : ''}">${m.time}</div>
        <div class="agenda-teams">
          <img class="team-logo" src="public/images/site.png" alt="SITE"><span class="team site">SITE</span>
          <span class="vs-tag">VS</span>
          <img class="team-logo" src="public/images/${m.oCls}.png" alt="${m.opp}"><span class="team opp t-${m.oCls}">${m.opp}</span>
        </div>
        ${m.gLabel ? `<div class="agenda-gender ${m.gCls}">${m.gLabel}</div>` : '<div></div>'}
      </div>`;
    }
    html += `</div>`;
  }

  if (!sections.length) {
    html += `<div style="color:var(--muted);font-size:12px;letter-spacing:2px;text-transform:uppercase">No events match the current filter.</div>`;
  }

  html += `</div>`;
  agendaEl.innerHTML = html;
  agendaEl.style.display = 'block';
  setTimeout(() => agendaEl.scrollIntoView({ behavior:'smooth', block:'nearest' }), 50);
}

function closeAgenda() {
  const el = document.getElementById('calAgenda');
  el.style.display = 'none';
  el.dataset.openDay = '';
  document.querySelectorAll('.cal-cell.selected').forEach(c => c.classList.remove('selected'));
}

// View tab switching
document.getElementById('tabCal').addEventListener('click', () => {
  document.getElementById('tabCal').classList.add('active');
  document.getElementById('tabSched').classList.remove('active');
  document.getElementById('calWrap').classList.add('visible');
  document.querySelectorAll('.day-block').forEach(d => d.style.display = 'none');
  buildCalGrid(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
});

document.getElementById('tabSched').addEventListener('click', () => {
  document.getElementById('tabSched').classList.add('active');
  document.getElementById('tabCal').classList.remove('active');
  document.getElementById('calWrap').classList.remove('visible');
  const af = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  document.querySelectorAll('.day-block').forEach(day => {
    const vis = [...day.querySelectorAll('.sport-section')].some(s => !s.classList.contains('hidden'));
    day.style.display = vis ? '' : 'none';
  });
});

// Refresh calendar when filter changes (if calendar tab is active)
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (document.getElementById('calWrap').classList.contains('visible')) {
      setTimeout(() => {
        const af = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        buildCalGrid(af);
        const openDay = document.getElementById('calAgenda').dataset.openDay;
        if (openDay) openAgenda(parseInt(openDay));
      }, 10);
    }
  });
});

// ── Results hint
const hint = document.getElementById('resultHint');
let hintTimer = null;

function dismissHint() {
  hint.classList.remove('hint-show');
  if (hintTimer) { clearTimeout(hintTimer); hintTimer = null; }
}

function startHintTimer() {
  if (hintTimer) return;
  hintTimer = setTimeout(dismissHint, 3000);
  ['mousemove', 'scroll', 'keydown', 'touchstart', 'click'].forEach(e =>
    document.removeEventListener(e, startHintTimer)
  );
}

// Show immediately once JS runs
requestAnimationFrame(() => requestAnimationFrame(() => hint.classList.add('hint-show')));

// Begin 3s countdown on first user interaction
['mousemove', 'scroll', 'keydown', 'touchstart', 'click'].forEach(e =>
  document.addEventListener(e, startHintTimer, { passive: true })
);

// ── Results toggle
document.getElementById('resultsToggle').addEventListener('click', () => {
  const visible = document.documentElement.classList.toggle('results-visible');
  document.getElementById('resultsLabel').textContent = visible ? 'Hide Results' : 'Show Results';
  dismissHint();
});

// ── Theme toggle
const themeToggle = document.getElementById('themeToggle');
const themeLabel  = document.getElementById('themeLabel');
const moonIcon = `<circle cx="12" cy="12" r="5"/><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>`;
const sunIcon  = `<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/><line x1="4.93" y1="19.07" x2="7.05" y2="16.95"/><line x1="16.95" y1="7.05" x2="19.07" y2="4.93"/>`;

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.classList.toggle('light');
  document.getElementById('themeIcon').innerHTML = isLight ? moonIcon : sunIcon;
  themeLabel.textContent = isLight ? 'Dark' : 'Light';
});

// Filter
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.sport-section').forEach(sec => {
      if (f === 'all' || sec.dataset.sport === f) {
        sec.classList.remove('hidden');
      } else {
        sec.classList.add('hidden');
      }
    });
    // Hide day blocks that become empty
    document.querySelectorAll('.day-block').forEach(day => {
      const visible = [...day.querySelectorAll('.sport-section')].some(s => !s.classList.contains('hidden'));
      day.style.display = visible ? '' : 'none';
    });
  });
});

// ── Result Splash ──
const TEAM_COLORS = {
  ciste: '#5bb4d4', sohe: '#e07832', sohs: '#52b05c',
  sba: '#d4aa45', sihm: '#e05252'
};

function showResultSplash(ds) {
  const isWin   = ds.result === 'win';
  const oppClr  = TEAM_COLORS[ds.opp] || '#888';
  const resClr  = isWin ? '#2ea84a' : '#cc3333';
  const resText = isWin ? 'WIN' : 'LOSE';

  const overlay = document.createElement('div');
  overlay.id = 'splashOverlay';
  overlay.innerHTML = `
    <div class="splash-bg splash-bg-${ds.result}"></div>

    <div class="splash-inner">
      <div class="splash-team splash-team-left">
        <img src="public/images/site.png" alt="SITE" class="splash-logo">
        <div class="splash-team-name">SITE</div>
      </div>
      <div class="splash-center">
        <div class="splash-vs">VS</div>
        <div class="splash-result" style="color:${resClr}">${resText}</div>
        <div class="splash-meta">${ds.label}</div>
        <div class="splash-meta-time">${ds.date} &nbsp;·&nbsp; ${ds.time} &nbsp;·&nbsp; ${ds.venue}</div>
      </div>
      <div class="splash-team splash-team-right">
        <img src="public/images/${ds.opp}.png" alt="${ds.oppName}" class="splash-logo">
        <div class="splash-team-name" style="color:${oppClr}">${ds.oppName}</div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('splash-visible'));
  overlay.addEventListener('click', closeResultSplash);
}

function closeResultSplash() {
  const el = document.getElementById('splashOverlay');
  if (!el) return;
  el.classList.remove('splash-visible');
  el.addEventListener('transitionend', () => el.remove(), { once: true });
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeResultSplash(); });

function showMatchSplash(ds) {
  const oppClr = TEAM_COLORS[ds.opp] || '#888';
  const overlay = document.createElement('div');
  overlay.id = 'splashOverlay';
  overlay.innerHTML = `
    <div class="splash-bg splash-bg-pending"></div>

    <div class="splash-inner">
      <div class="splash-team splash-team-left">
        <img src="public/images/site.png" alt="SITE" class="splash-logo">
        <div class="splash-team-name">SITE</div>
      </div>
      <div class="splash-center">
        <div class="splash-pending-time${ds.tbd ? ' tbd' : ''}">${ds.time}</div>
        <div class="splash-meta">${ds.label}</div>
        <div class="splash-meta-time">${ds.date} &nbsp;·&nbsp; ${ds.venue}</div>
      </div>
      <div class="splash-team splash-team-right">
        <img src="public/images/${ds.opp}.png" alt="${ds.oppName}" class="splash-logo">
        <div class="splash-team-name" style="color:${oppClr}">${ds.oppName}</div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('splash-visible'));
  overlay.addEventListener('click', closeResultSplash);
}

document.getElementById('scheduleRoot').addEventListener('click', e => {
  const row = e.target.closest('.match-row');
  if (!row) return;
  const ds = {
    result:  row.dataset.result,
    opp:     row.dataset.opp,
    oppName: row.dataset.oppName,
    time:    row.dataset.time,
    date:    row.dataset.date,
    label:   row.dataset.label,
    venue:   row.dataset.venue,
    tbd:     row.querySelector('.match-time.tbd') !== null
  };
  if (ds.result) {
    showResultSplash(ds);
  } else {
    showMatchSplash(ds);
  }
});
