// ── SCHEDULE DATA (loaded from schedule.json) ──
let CAL_DATA = {};

function esc(s) { return String(s).replace(/&/g, '&amp;'); }

const STAGE_LABELS = { semis: 'Semis', finals: 'Finals', '3rd': 'Battle for 3rd' };

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
        const isTbd     = oppLower === 'tbd';
        const scoreAttrs  = (m.score?.site != null && m.score?.opp != null) ? ` data-score-site="${m.score.site}" data-score-opp="${m.score.opp}"` : '';
        const splashAttrs = ` data-opp="${oppLower}" data-opp-name="${esc(m.opp)}" data-time="${esc(m.time)}" data-date="${esc(day.date)}" data-label="${esc(sec.label)}" data-venue="${esc(sec.venue)}"${m.result ? ` data-result="${m.result}"` : ''}${m.stage ? ` data-stage="${m.stage}"` : ''}${scoreAttrs}`;
        const oppLogoHtml = isTbd ? '' : `<img class="team-logo" src="public/images/${oppLower}.png" alt="${esc(m.opp)}">`;
        const stageBadge  = m.stage ? `<span class="match-stage-badge match-stage-${m.stage}">${STAGE_LABELS[m.stage] || m.stage}</span>` : '';
        html += `<div class="match-row${resultCls}"${splashAttrs}>
          <div class="match-time${tbdCls}">${esc(m.time)}</div>
          <div class="match-teams"><img class="team-logo" src="public/images/site.png" alt="SITE"><span class="team site">SITE</span><span class="vs-tag">VS</span>${oppLogoHtml}<span class="team opp${isTbd ? '' : ` t-${oppLower}`}">${esc(m.opp)}</span>${stageBadge}</div>
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
        return {
          sport: sec.sport, icon: `#${sec.icon}`,
          label: sec.label, venue: sec.venue,
          matches: sec.matches.map(m => ({
            time: m.time, opp: m.opp, oCls: m.opp.toLowerCase(),
            tbd: m.tbd || false, result: m.result || null, stage: m.stage || null
          }))
        };
      })
    };
  }
  return out;
}

CAL_DATA = buildCalData(SCHEDULE_DATA);
renderSchedule(SCHEDULE_DATA);

// ── Calendar month title from data
(function () {
  const d = new Date(SCHEDULE_DATA.days[0].date);
  const title = d.toLocaleString('en-US', { month: 'long' }) + '\u00a0\u00a0' + d.getFullYear();
  document.getElementById('calMonthTitle').textContent = title;
})();

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
  const gameDays  = new Set(SCHEDULE_DATA.days.map(d => d.day));
  const firstDate = new Date(SCHEDULE_DATA.days[0].date);
  const year      = firstDate.getFullYear();
  const month     = firstDate.getMonth();
  const startDow  = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const now       = new Date();
  const todayNum  = now.getFullYear() === year && now.getMonth() === month ? now.getDate() : -1;
  let html = '';

  for (let i = 0; i < startDow; i++) html += '<div class="cal-cell empty"></div>';

  for (let d = 1; d <= daysInMonth; d++) {
    const isGame  = gameDays.has(d);
    const isToday = d === todayNum;
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

  const totalCells = startDow + daysInMonth;
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
      const isTbdOpp = m.oCls === 'tbd';
      const agendaOppLogo = isTbdOpp ? '' : `<img class="team-logo" src="public/images/${m.oCls}.png" alt="${m.opp}">`;
      const agendaStageBadge = m.stage ? `<span class="match-stage-badge match-stage-${m.stage}">${STAGE_LABELS[m.stage] || m.stage}</span>` : '';
      html += `
      <div class="agenda-match${isTbdOpp ? '' : ` opp-${m.oCls}`}">
        <div class="agenda-time${m.tbd ? ' tbd' : ''}">${m.time}</div>
        <div class="agenda-teams">
          <img class="team-logo" src="public/images/site.png" alt="SITE"><span class="team site">SITE</span>
          <span class="vs-tag">VS</span>
          ${agendaOppLogo}<span class="team opp${isTbdOpp ? '' : ` t-${m.oCls}`}">${m.opp}</span>${agendaStageBadge}
        </div>
        ${m.result ? `<div class="agenda-result ${m.result}">${m.result === 'win' ? 'WIN' : 'LOSE'}</div>` : '<div></div>'}
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
  document.getElementById('tabTally').classList.remove('active');
  document.getElementById('calWrap').classList.add('visible');
  document.getElementById('tallyRoot').classList.remove('visible');
  document.querySelectorAll('.day-block').forEach(d => d.style.display = 'none');
  buildCalGrid(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
});

document.getElementById('tabSched').addEventListener('click', () => {
  document.getElementById('tabSched').classList.add('active');
  document.getElementById('tabCal').classList.remove('active');
  document.getElementById('tabTally').classList.remove('active');
  document.getElementById('calWrap').classList.remove('visible');
  document.getElementById('tallyRoot').classList.remove('visible');
  const af = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  document.querySelectorAll('.day-block').forEach(day => {
    const vis = [...day.querySelectorAll('.sport-section')].some(s => !s.classList.contains('hidden'));
    day.style.display = vis ? '' : 'none';
  });
});

document.getElementById('tabTally').addEventListener('click', () => {
  document.getElementById('tabTally').classList.add('active');
  document.getElementById('tabCal').classList.remove('active');
  document.getElementById('tabSched').classList.remove('active');
  document.getElementById('calWrap').classList.remove('visible');
  document.querySelectorAll('.day-block').forEach(d => d.style.display = 'none');
  document.getElementById('tallyRoot').classList.add('visible');
  renderTally();
});

function renderTally() {
  const root = document.getElementById('tallyRoot');
  const opponents = ['CISTE', 'SOHE', 'SOHS', 'SBA', 'SIHM'];

  // Collect sport sections grouped by label, preserving order
  const sectionOrder = [];
  const sectionMap = new Map();

  for (const day of SCHEDULE_DATA.days) {
    for (const sec of day.sections) {
      if (!sectionMap.has(sec.label)) {
        sectionOrder.push(sec.label);
        sectionMap.set(sec.label, { icon: sec.icon, sport: sec.sport, matches: new Map(), stages: new Map() });
      }
      const entry = sectionMap.get(sec.label);
      for (const m of sec.matches) {
        if (m.stage) {
          entry.stages.set(m.stage, { result: m.result || null, opp: m.opp });
        } else {
          const oppKey = m.opp.toUpperCase();
          if (!entry.matches.has(oppKey)) entry.matches.set(oppKey, []);
          entry.matches.get(oppKey).push({ result: m.result || null, score: m.score });
        }
      }
    }
  }

  function genderOf(label) {
    const hasMen = /\bMen\b/.test(label);
    const hasWomen = /\bWomen\b/.test(label);
    const isDoubles = /\bDoubles\b/.test(label);
    if ((hasMen && hasWomen) || isDoubles) return 'mixed';
    if (hasWomen) return 'women';
    if (hasMen) return 'men';
    return '';
  }

  function resultStageCell(val) {
    if (val === 'win')  return `<div class="tally-score tally-win">WIN</div>`;
    if (val === 'lose') return `<div class="tally-score tally-lose">LOSE</div>`;
    return `<span class="tally-dash">—</span>`;
  }

  function resultBadge(val) {
    if (!val) return `<span class="tally-dash">—</span>`;
    const lower = val.toLowerCase();
    let cls = 'tally-result-badge';
    if (lower.includes('champion')) cls += ' tally-result-gold';
    else if (lower.includes('runner') || lower === '2nd') cls += ' tally-result-silver';
    else if (lower === '3rd' || lower.includes('3rd')) cls += ' tally-result-bronze';
    return `<div class="${cls}">${esc(val)}</div>`;
  }

  let html = `<div class="tally-wrap"><table class="tally-table"><thead><tr><th class="tally-th-game">Game</th>`;
  for (const opp of opponents) {
    html += `<th class="tally-th-opp"><span class="t-${opp.toLowerCase()}">${opp}</span></th>`;
  }
  html += `<th class="tally-th-stat">W/L</th>`;
  html += `<th class="tally-th-stat">Semis</th>`;
  html += `<th class="tally-th-stat">Battle for 3rd</th>`;
  html += `<th class="tally-th-stat">Finals</th>`;
  html += `<th class="tally-th-stat tally-th-result">Result</th>`;
  html += `</tr></thead><tbody>`;

  for (const label of sectionOrder) {
    const data = sectionMap.get(label);
    const gender = genderOf(label);
    const gAttr = gender ? ` data-gender="${gender}"` : '';
    const meta = (typeof TALLY_META !== 'undefined' && TALLY_META[label]) || {};

    // Compute W/L from all matches with results
    let wins = 0, losses = 0;
    for (const matchList of data.matches.values()) {
      for (const m of matchList) {
        if (m.result === 'win') wins++;
        else if (m.result === 'lose') losses++;
      }
    }

    const resultLower = (meta.result || '').toLowerCase();
    let rowGlow = '';
    if (resultLower.includes('champion')) rowGlow = ' tally-glow-gold';
    else if (resultLower.includes('runner') || resultLower === '2nd') rowGlow = ' tally-glow-silver';
    else if (resultLower.includes('3rd') || resultLower === '3rd place') rowGlow = ' tally-glow-bronze';

    html += `<tr class="tally-row${rowGlow}"${gAttr}>`;
    html += `<td class="tally-game-label"><div class="tally-label-inner">`;
    html += `<span class="sport-icon"><svg class="sport-svg"><use href="#${data.icon}"/></svg></span>`;
    html += `<span class="sport-name">${esc(label)}</span>`;
    html += `</div></td>`;

    for (const opp of opponents) {
      const matchList = data.matches.get(opp) || [];
      if (matchList.length === 0) {
        html += `<td class="tally-cell tally-no-match">—</td>`;
      } else {
        let cellHtml = '';
        for (const m of matchList) {
          if (m.result) {
            const cls = m.result === 'win' ? 'tally-win' : 'tally-lose';
            let scoreStr;
            if (m.score && m.score.site != null && m.score.opp != null) {
              scoreStr = `${m.score.site} – ${m.score.opp}`;
            } else {
              scoreStr = m.result === 'win' ? 'WIN' : 'LOSE';
            }
            cellHtml += `<div class="tally-score ${cls}">${scoreStr}</div>`;
          } else {
            cellHtml += `<div class="tally-score tally-pending">TBD</div>`;
          }
        }
        html += `<td class="tally-cell">${cellHtml}</td>`;
      }
    }

    // W/L cell
    const wlHtml = (wins || losses)
      ? `<span class="tally-w">${wins}W</span><span class="tally-sep"> · </span><span class="tally-l">${losses}L</span>`
      : `<span class="tally-dash">—</span>`;
    html += `<td class="tally-cell tally-cell-stat">${wlHtml}</td>`;

    // Semis / Finals / Battle for 3rd / Result — derived from stage-marked matches in SCHEDULE_DATA
    const semisResult  = data.stages.get('semis')?.result ?? null;
    const finalsResult = data.stages.get('finals')?.result ?? null;
    const thirdResult  = data.stages.get('3rd')?.result ?? null;
    html += `<td class="tally-cell tally-cell-stat">${resultStageCell(semisResult)}</td>`;
    html += `<td class="tally-cell tally-cell-stat">${resultStageCell(thirdResult)}</td>`;
    html += `<td class="tally-cell tally-cell-stat">${resultStageCell(finalsResult)}</td>`;
    html += `<td class="tally-cell tally-cell-stat tally-cell-result">${resultBadge(meta.result ?? null)}</td>`;

    html += `</tr>`;
  }

  html += `</tbody></table></div>`;
  root.innerHTML = html;
}

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

// ── Results hint (floating only)
const floatHint = document.getElementById('floatingHint');
let hintTimer = null;

function dismissHint() {
  floatHint.classList.remove('hint-show');
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
requestAnimationFrame(() => requestAnimationFrame(() => {
  document.getElementById('floatingResults').classList.add('fab-visible');
  document.getElementById('floatingTheme').classList.add('fab-visible');
  floatHint.classList.add('hint-show');
}));

// Begin 3s countdown on first user interaction
['mousemove', 'scroll', 'keydown', 'touchstart', 'click'].forEach(e =>
  document.addEventListener(e, startHintTimer, { passive: true })
);

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
  const stageLine = ds.stage ? `<div class="splash-stage-badge splash-stage-${ds.stage}">${STAGE_LABELS[ds.stage] || ds.stage}</div>` : '';
  const oppLogoHtml = ds.opp !== 'tbd' ? `<img src="public/images/${ds.opp}.png" alt="${ds.oppName}" class="splash-logo">` : `<div class="splash-logo-tbd">?</div>`;

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
        ${stageLine}
        ${ds.scoreSite != null && ds.scoreOpp != null ? `<div class="splash-score"><span class="splash-score-site">${ds.scoreSite}</span><span class="splash-score-sep">–</span><span class="splash-score-opp">${ds.scoreOpp}</span></div>` : ''}
        <div class="splash-result" style="color:${resClr}">${resText}</div>
        <div class="splash-meta">${ds.label}</div>
        <div class="splash-meta-time">${ds.date} &nbsp;·&nbsp; ${ds.time} &nbsp;·&nbsp; ${ds.venue}</div>
      </div>
      <div class="splash-team splash-team-right">
        ${oppLogoHtml}
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
  const stageLine = ds.stage ? `<div class="splash-stage-badge splash-stage-${ds.stage}">${STAGE_LABELS[ds.stage] || ds.stage}</div>` : '';
  const oppLogoHtml = ds.opp !== 'tbd' ? `<img src="public/images/${ds.opp}.png" alt="${ds.oppName}" class="splash-logo">` : `<div class="splash-logo-tbd">?</div>`;
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
        ${stageLine}
        <div class="splash-pending-time${ds.tbd ? ' tbd' : ''}">${ds.time}</div>
        <div class="splash-meta">${ds.label}</div>
        <div class="splash-meta-time">${ds.date} &nbsp;·&nbsp; ${ds.venue}</div>
      </div>
      <div class="splash-team splash-team-right">
        ${oppLogoHtml}
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
    tbd:       row.querySelector('.match-time.tbd') !== null,
    scoreSite: row.dataset.scoreSite,
    scoreOpp:  row.dataset.scoreOpp,
    stage:     row.dataset.stage || null
  };
  if (ds.result) {
    showResultSplash(ds);
  } else {
    showMatchSplash(ds);
  }
});

// ── Floating Buttons ──
(function () {
  const fabResults = document.getElementById('floatingResults');
  const fabTheme   = document.getElementById('floatingTheme');
  const fabLabel   = document.getElementById('floatingResultsLabel');
  let fabTimer = null;

  function showFabs() {
    fabResults.classList.add('fab-visible');
    fabTheme.classList.add('fab-visible');
    if (fabTimer) clearTimeout(fabTimer);
    fabTimer = setTimeout(() => {
      fabResults.classList.remove('fab-visible');
      fabTheme.classList.remove('fab-visible');
    }, 1000);
  }

  function syncResultsLabel() {
    const on = document.documentElement.classList.contains('results-visible');
    fabLabel.textContent = on ? 'Hide Results' : 'Show Results';
  }

  fabResults.addEventListener('click', () => {
    document.documentElement.classList.toggle('results-visible');
    syncResultsLabel();
    dismissHint();
    showFabs();
  });

  fabTheme.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    const moonIcon = `<circle cx="12" cy="12" r="5"/><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>`;
    const sunIcon  = `<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/><line x1="4.93" y1="19.07" x2="7.05" y2="16.95"/><line x1="16.95" y1="7.05" x2="19.07" y2="4.93"/>`;
    document.getElementById('floatingThemeIcon').innerHTML = isLight ? moonIcon : sunIcon;
    document.getElementById('floatingThemeLabel').textContent = isLight ? 'Dark' : 'Light';
    showFabs();
  });

  const events = ['mousemove', 'scroll', 'keydown', 'touchstart', 'click'];
  events.forEach(e => document.addEventListener(e, showFabs, { passive: true }));
})();
