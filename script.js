// ── BADMINTON HIGHLIGHT KILL SWITCH ──
// Set to false to disable all gold nebula effects on badminton rows and calendar cell.
const BADMINTON_HIGHLIGHT = false;

// ── TEST DATE OVERRIDE ──
// Set to an object to simulate a specific date/time; set to null to use system time.
// gmt: UTC offset as a number (e.g. 8 for PHT, -5 for EST, 0 for UTC)
// Example: { date: '2026-03-21', time: '17:30', gmt: 8 }
const TEST_DATE = null;


// ── SCHEDULE DATA (loaded from schedule.json) ──
let CAL_DATA = {};

function esc(s) { return String(s).replace(/&/g, '&amp;'); }

const STAGE_LABELS = { quarters: 'Quarters', semis: 'Semis', finals: 'Finals', '3rd': 'Battle for 3rd' };

const SPORT_LOGO = {
  'ico-badminton':     'badminton.svg',
  'ico-basketball':    'basketball.svg',
  'ico-volleyball':    'volleyball.svg',
  'ico-beach':         'beachvolley.svg',
  'ico-chess':         'chess.svg',
  'ico-scrabble':      'scrabble.svg',
  'ico-tabletennis':   'tabletennis.svg',
  'ico-mobilelegends': 'mlbb.svg',
  'ico-callofduty':    'codm.svg',
};

function sportIconHtml(iconId, extraCls = '') {
  const id = iconId.replace(/^#/, '');
  const file = SPORT_LOGO[id];
  const cls = 'sport-img' + (extraCls ? ' ' + extraCls : '');
  if (file) {
    const url = `public/images/sportslogos/${file}`;
    return `<img class="${cls}" src="${url}" alt="">`;
  }
  return `<svg class="sport-svg${extraCls ? ' ' + extraCls : ''}"><use href="#${id}"/></svg>`;
}

function renderSchedule(data) {
  const root = document.getElementById('scheduleRoot');
  let html = '';
  data.days.forEach((day, i) => {
    const delay = ((i + 1) * 0.05).toFixed(2);
    html += `<div class="day-block" id="day-${day.day}" style="animation-delay:${delay}s">
      <div class="day-header">
        <div class="day-num">${day.day}</div>
        <div class="day-info">
          <div class="day-name">${esc(day.name)}</div>
          <div class="day-date">${esc(day.date)}</div>
        </div>
        <div class="day-rule"></div>
      </div>`;
    day.sections.forEach(sec => {
      const hlCls = (BADMINTON_HIGHLIGHT && sec.highlight) ? ' highlight-section' : '';
      const evCls = sec.isEvent ? (sec.shimmer ? ' event-section award-section' : ' event-section') : '';
      const bbEntries = (sec.entries || []).filter(e => e.img);
      const bbLabelAttr = bbEntries.length
        ? ` data-bb-imgs="${bbEntries.map(e => e.img).join(',')}" data-bb-names="${bbEntries.map(e => esc(e.name)).join(',')}"`
        : '';
      html += `<div class="sport-section${hlCls}${evCls}" data-sport="${sec.sport}">
        <div class="sport-label"${bbLabelAttr}>
          <span class="sport-icon">${sportIconHtml(sec.icon)}</span>
          <span class="sport-name">${esc(sec.label)}</span>
          <span class="sport-venue">${esc(sec.venue)}</span>
        </div>
        <div class="matches">`;
      if (sec.isEvent) {
        html += `<div class="event-row"${bbLabelAttr}>
          <div class="match-time">${esc(sec.time)}</div>
          <div><span class="event-badge">${esc(sec.badge || 'Special Event')}</span></div>
        </div>`;
        if (sec.entries?.length) {
          html += `<div class="event-entries">`;
          for (const entry of sec.entries) {
            const eAttr = entry.img ? ` data-bb-img="${entry.img}" data-bb-name="${esc(entry.name)}"` : '';
            html += `<div class="event-entry"${eAttr}><svg class="entry-crown" viewBox="0 0 24 24"><use href="#ico-crown"/></svg><span class="event-entry-name">${esc(entry.name)}</span></div>`;
          }
          html += `</div>`;
        }
      }
      sec.matches.forEach(m => {
        const resultCls = m.result ? ` ${m.result}` : '';
        const tbdCls    = m.tbd ? ' tbd' : '';
        const oppLower  = m.opp.toLowerCase();
        const isTbd     = oppLower === 'tbd';
        const isBracket = !!m.bracket;
        const scoreAttrs  = (m.score?.site != null && m.score?.opp != null) ? ` data-score-site="${m.score.site}" data-score-opp="${m.score.opp}"` : '';
        const splashAttrs = ` data-opp="${oppLower}" data-opp-name="${esc(m.opp)}" data-time="${esc(m.time)}" data-date="${esc(day.date)}" data-label="${esc(sec.label)}" data-venue="${esc(sec.venue)}"${m.result ? ` data-result="${m.result}"` : ''}${m.stage ? ` data-stage="${m.stage}"` : ''}${isBracket ? ' data-bracket="true"' : ''}${scoreAttrs}`;
        const siteLogo    = isBracket ? 'placeholder_dept' : 'site';
        const siteName    = isBracket ? '???' : 'SITE';
        const oppLogoImg  = (isBracket || oppLower === '???') ? 'placeholder_dept' : oppLower;
        const oppLogoHtml = isTbd ? '' : `<img class="team-logo" src="public/images/${oppLogoImg}.png" alt="${esc(m.opp)}">`;
        const stageBadge  = m.stage ? `<span class="match-stage-badge match-stage-${m.stage}">${STAGE_LABELS[m.stage] || m.stage}</span>` : '';
        html += `<div class="match-row${resultCls}"${splashAttrs}>
          <div class="match-time${tbdCls}">${esc(m.time)}</div>
          <div class="match-teams"><img class="team-logo" src="public/images/${siteLogo}.png" alt="${siteName}"><span class="team site">${siteName}</span><span class="vs-tag">VS</span>${oppLogoHtml}<span class="team opp${isTbd ? '' : ` t-${oppLower}`}">${esc(m.opp)}</span>${stageBadge}</div>
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
      highlight: BADMINTON_HIGHLIGHT && day.sections.some(s => s.highlight),
      sections: day.sections.map(sec => {
        return {
          sport: sec.sport, icon: `#${sec.icon}`,
          label: sec.label, venue: sec.venue,
          isEvent: sec.isEvent || false,
          shimmer: sec.shimmer || false,
          badge: sec.badge || null,
          time: sec.time || null,
          entries: sec.entries || null,
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
if (!BADMINTON_HIGHLIGHT) {
  document.querySelector('.filter-btn[data-filter="badminton"]')?.classList.add('no-highlight');
}

// ── Calendar month title from data
(function () {
  const d = new Date(SCHEDULE_DATA.days[0].date);
  const title = d.toLocaleString('en-US', { month: 'long' }) + '\u00a0\u00a0' + d.getFullYear();
  document.getElementById('calMonthTitle').textContent = title;
})();

// ── Stats strip
(function() {
  const allSections = SCHEDULE_DATA.days.flatMap(d => d.sections).filter(s => !s.isEvent);
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
  chess:'#9b72cf', scrabble:'#4aba7a', tabletennis:'#e05555', badminton:'#d4a83a',
  event:'#c9a84c',
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
    const isGame      = gameDays.has(d);
    const isToday     = d === todayNum;
    const isHighlight = isGame && CAL_DATA[d]?.highlight;
    let cls = 'cal-cell';
    if (isGame)      cls += ' game-day';
    if (isToday)     cls += ' today';
    if (isHighlight) cls += ' gold-highlight';

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
        html += sportIconHtml(sec.icon);
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
  const matchCount = sections.reduce((n, s) => s.isEvent ? n : n + s.matches.length, 0);
  const evCount = sections.filter(s => s.isEvent).length;
  const countStr = matchCount > 0 && evCount > 0
    ? `${matchCount} match${matchCount !== 1 ? 'es' : ''} · ${evCount} event${evCount !== 1 ? 's' : ''}`
    : matchCount > 0
      ? `${matchCount} match${matchCount !== 1 ? 'es' : ''}`
      : `${evCount} event${evCount !== 1 ? 's' : ''}`;

  let html = `
    <div class="agenda-hd">
      <div class="agenda-hd-num">${day}</div>
      <div class="agenda-hd-info">
        <div class="agenda-hd-name">${dayData.name}</div>
        <div class="agenda-hd-date">${dayData.date}</div>
      </div>
      <div class="agenda-count">${countStr}</div>
      <button class="agenda-close" onclick="closeAgenda()" aria-label="Close">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="agenda-sections">`;

  for (const sec of sections) {
    const agBbEntries = (sec.entries || []).filter(e => e.img);
    const agBbHdAttr = agBbEntries.length
      ? ` data-bb-imgs="${agBbEntries.map(e => e.img).join(',')}" data-bb-names="${agBbEntries.map(e => esc(e.name)).join(',')}"`
      : '';
    html += `<div class="agenda-sport-group">
      <div class="agenda-sport-hd"${agBbHdAttr}>
        ${sportIconHtml(sec.icon)}
        ${sec.label}
        <span class="agenda-sport-venue">${sec.venue}</span>
      </div>`;
    if (sec.isEvent) {
      const awardCls = sec.shimmer ? ' award-section' : '';
      html += `
      <div class="agenda-match${awardCls}"${agBbHdAttr}>
        <div class="agenda-time">${sec.time}</div>
        <div><span class="event-badge">${sec.badge || 'Special Event'}</span></div>
        <div></div>
      </div>`;
      if (sec.entries?.length) {
        html += `<div class="event-entries" style="padding-left:0;margin-top:6px">`;
        for (const entry of sec.entries) {
          const eAttr = entry.img ? ` data-bb-img="${entry.img}" data-bb-name="${esc(entry.name)}"` : '';
          html += `<div class="event-entry"${eAttr}><svg class="entry-crown" viewBox="0 0 24 24"><use href="#ico-crown"/></svg><span class="event-entry-name">${esc(entry.name)}</span></div>`;
        }
        html += `</div>`;
      }
    } else {
    for (const m of sec.matches) {
      const isTbdOpp    = m.oCls === 'tbd';
      const isAgendaBracket = !!m.bracket;
      const agendaSiteLogo = isAgendaBracket ? 'placeholder_dept' : 'site';
      const agendaSiteName = isAgendaBracket ? '???' : 'SITE';
      const agendaOppImg  = (isAgendaBracket || m.oCls === '???') ? 'placeholder_dept' : m.oCls;
      const agendaOppLogo = isTbdOpp ? '' : `<img class="team-logo" src="public/images/${agendaOppImg}.png" alt="${m.opp}">`;
      const agendaStageBadge = m.stage ? `<span class="match-stage-badge match-stage-${m.stage}">${STAGE_LABELS[m.stage] || m.stage}</span>` : '';
      html += `
      <div class="agenda-match${isTbdOpp ? '' : ` opp-${m.oCls}`}${isAgendaBracket ? ' data-bracket="true"' : ''}">
        <div class="agenda-time${m.tbd ? ' tbd' : ''}">${m.time}</div>
        <div class="agenda-teams">
          <img class="team-logo" src="public/images/${agendaSiteLogo}.png" alt="${agendaSiteName}"><span class="team site">${agendaSiteName}</span>
          <span class="vs-tag">VS</span>
          ${agendaOppLogo}<span class="team opp${isTbdOpp ? '' : ` t-${m.oCls}`}">${m.opp}</span>${agendaStageBadge}
        </div>
        ${m.result ? `<div class="agenda-result ${m.result}">${m.result === 'win' ? 'WIN' : 'LOSE'}</div>` : '<div></div>'}
      </div>`;
    }
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
  document.getElementById('floatingNavBtn')?.classList.remove('fab-visible');
  buildCalGrid(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
});

document.getElementById('tabSched').addEventListener('click', () => {
  document.getElementById('tabSched').classList.add('active');
  document.getElementById('tabCal').classList.remove('active');
  document.getElementById('tabTally').classList.remove('active');
  document.getElementById('calWrap').classList.remove('visible');
  document.getElementById('tallyRoot').classList.remove('visible');
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
  document.getElementById('floatingNavBtn')?.classList.remove('fab-visible');
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
          entry.stages.set(m.stage, { result: m.result || null, opp: m.opp, time: m.time, date: day.date, venue: sec.venue, stage: m.stage, score: m.score });
        } else {
          const oppKey = m.opp.toUpperCase();
          if (!entry.matches.has(oppKey)) entry.matches.set(oppKey, []);
          entry.matches.get(oppKey).push({ result: m.result || null, score: m.score, time: m.time, date: day.date, venue: sec.venue });
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

  function splashAttrs(opp, oppName, result, label, time, date, venue, score, stage) {
    const scoreAttrs = (score?.site != null && score?.opp != null) ? ` data-score-site="${score.site}" data-score-opp="${score.opp}"` : '';
    const stageAttr  = stage ? ` data-stage="${stage}"` : '';
    return `data-opp="${esc(opp)}" data-opp-name="${esc(oppName)}" data-result="${esc(result || '')}" data-label="${esc(label)}" data-time="${esc(time || '')}" data-date="${esc(date || '')}" data-venue="${esc(venue || '')}"${scoreAttrs}${stageAttr}`;
  }

  function resultStageCell(sd, label) {
    if (!sd) return `<span class="tally-dash">—</span>`;
    const val = sd.result;
    if (val === 'win' || val === 'lose') {
      const cls = val === 'win' ? 'tally-win' : 'tally-lose';
      return `<div class="tally-score ${cls} tally-clickable" ${splashAttrs(sd.opp.toLowerCase(), sd.opp, val, label, sd.time, sd.date, sd.venue, sd.score, sd.stage)}>${val === 'win' ? 'WIN' : 'LOSE'}</div>`;
    }
    return `<span class="tally-dash">—</span>`;
  }

  function resultBadge(val) {
    if (!val) return `<span class="tally-dash">—</span>`;
    const lower = val.toLowerCase();
    let cls = 'tally-result-badge';
    if (lower.includes('champion')) cls += ' tally-result-gold';
    else if (lower.includes('runner') || lower.includes('2nd')) cls += ' tally-result-silver';
    else if (lower === '3rd' || lower.includes('3rd')) cls += ' tally-result-bronze';
    return `<div class="${cls}">${esc(val)}</div>`;
  }

  let html = `<div class="tally-wrap"><table class="tally-table"><thead><tr><th class="tally-th-game">Game</th>`;
  for (const opp of opponents) {
    html += `<th class="tally-th-opp"><span class="t-${opp.toLowerCase()}">${opp}</span></th>`;
  }
  html += `<th class="tally-th-stat">W/L</th>`;
  html += `<th class="tally-th-stat">Quarters</th>`;
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
    else if (resultLower.includes('runner') || resultLower.includes('2nd')) rowGlow = ' tally-glow-silver';
    else if (resultLower.includes('3rd') || resultLower === '3rd place') rowGlow = ' tally-glow-bronze';

    html += `<tr class="tally-row${rowGlow}"${gAttr}>`;
    html += `<td class="tally-game-label"><div class="tally-label-inner">`;
    html += `<span class="sport-icon">${sportIconHtml(data.icon)}</span>`;
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
            cellHtml += `<div class="tally-score ${cls} tally-clickable" ${splashAttrs(opp.toLowerCase(), opp, m.result, label, m.time, m.date, m.venue, m.score)}>${scoreStr}</div>`;
          } else {
            cellHtml += `<div class="tally-score tally-pending tally-clickable" ${splashAttrs(opp.toLowerCase(), opp, '', label, m.time, m.date, m.venue, m.score)}>TBD</div>`;
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

    // Quarters / Semis / Finals / Battle for 3rd / Result — derived from stage-marked matches in SCHEDULE_DATA
    html += `<td class="tally-cell tally-cell-stat">${resultStageCell(data.stages.get('quarters') ?? null, label)}</td>`;
    html += `<td class="tally-cell tally-cell-stat">${resultStageCell(data.stages.get('semis') ?? null, label)}</td>`;
    html += `<td class="tally-cell tally-cell-stat">${resultStageCell(data.stages.get('3rd') ?? null, label)}</td>`;
    html += `<td class="tally-cell tally-cell-stat">${resultStageCell(data.stages.get('finals') ?? null, label)}</td>`;
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
  document.getElementById('floatingNavBtn').classList.add('fab-visible');
  floatHint.classList.add('hint-show');
}));

// ── Result announce popup (driven by OVERALL_RESULT in data.js)
const badmintonAnnounce = document.getElementById('badmintonAnnounce');
if (OVERALL_RESULT) {
  document.getElementById('badmintonAnnounceTitle').textContent = OVERALL_RESULT;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    badmintonAnnounce.classList.add('announce-show');
  }));
  document.addEventListener('click', () => {
    badmintonAnnounce.classList.add('announce-hide');
    badmintonAnnounce.addEventListener('transitionend', () => badmintonAnnounce.remove(), { once: true });
  }, { once: true });
} else {
  badmintonAnnounce.remove();
}

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

function sportLogoFromLabel(label) {
  const l = label.toLowerCase();
  if (l.includes('badminton'))      return 'badminton.svg';
  if (l.includes('basketball'))     return 'basketball.svg';
  if (l.includes('beach'))          return 'beachvolley.svg';
  if (l.includes('volleyball'))     return 'volleyball.svg';
  if (l.includes('chess'))          return 'chess.svg';
  if (l.includes('scrabble'))       return 'scrabble.svg';
  if (l.includes('table tennis'))   return 'tabletennis.svg';
  if (l.includes('mobile legends')) return 'mlbb.svg';
  if (l.includes('call of duty'))   return 'codm.svg';
  return null;
}

function showResultSplash(ds) {
  const isWin   = ds.result === 'win';
  const oppClr  = TEAM_COLORS[ds.opp] || '#888';
  const resClr  = isWin ? '#2ea84a' : '#cc3333';
  const resText = isWin ? 'WIN' : 'LOSE';
  const stageLine = ds.stage ? `<div class="splash-stage-badge splash-stage-${ds.stage}">${STAGE_LABELS[ds.stage] || ds.stage}</div>` : '';
  const isSplashBracket = ds.bracket === 'true';
  const siteSplashLogo  = isSplashBracket ? 'placeholder_dept' : 'site';
  const siteSplashName  = isSplashBracket ? '???' : 'SITE';
  const oppLogoHtml = ds.opp === 'tbd' ? `<div class="splash-logo-tbd">?</div>` : `<img src="public/images/${(isSplashBracket || ds.opp === '???') ? 'placeholder_dept' : ds.opp}.png" alt="${ds.oppName}" class="splash-logo">`;

  const _sportFile = sportLogoFromLabel(ds.label);
  const _sportBg = _sportFile ? `<img class="splash-sport-bg" src="public/images/sportslogos/${_sportFile}" alt="">` : '';

  const overlay = document.createElement('div');
  overlay.id = 'splashOverlay';
  overlay.innerHTML = `
    <div class="splash-bg splash-bg-${ds.result}"></div>
    ${_sportBg}
    <div class="splash-inner">
      <div class="splash-team splash-team-left">
        <img src="public/images/${siteSplashLogo}.png" alt="${siteSplashName}" class="splash-logo">
        <div class="splash-team-name"${isSplashBracket ? ' style="color:#888"' : ''}>${siteSplashName}</div>
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
  const isMatchBracket = ds.bracket === 'true';
  const siteMatchLogo  = isMatchBracket ? 'placeholder_dept' : 'site';
  const siteMatchName  = isMatchBracket ? '???' : 'SITE';
  const oppLogoHtml = ds.opp === 'tbd' ? `<div class="splash-logo-tbd">?</div>` : `<img src="public/images/${(isMatchBracket || ds.opp === '???') ? 'placeholder_dept' : ds.opp}.png" alt="${ds.oppName}" class="splash-logo">`;
  const _sportFile2 = sportLogoFromLabel(ds.label);
  const _sportBg2 = _sportFile2 ? `<img class="splash-sport-bg" src="public/images/sportslogos/${_sportFile2}" alt="">` : '';

  const overlay = document.createElement('div');
  overlay.id = 'splashOverlay';
  overlay.innerHTML = `
    <div class="splash-bg splash-bg-pending"></div>
    ${_sportBg2}
    <div class="splash-inner">
      <div class="splash-team splash-team-left">
        <img src="public/images/${siteMatchLogo}.png" alt="${siteMatchName}" class="splash-logo">
        <div class="splash-team-name"${isMatchBracket ? ' style="color:#888"' : ''}>${siteMatchName}</div>
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
    stage:     row.dataset.stage || null,
    bracket:   row.dataset.bracket || null
  };
  if (ds.result) {
    showResultSplash(ds);
  } else {
    showMatchSplash(ds);
  }
});

document.getElementById('tallyRoot').addEventListener('click', e => {
  const cell = e.target.closest('.tally-clickable');
  if (!cell) return;
  const ds = {
    result:    cell.dataset.result,
    opp:       cell.dataset.opp,
    oppName:   cell.dataset.oppName,
    time:      cell.dataset.time,
    date:      cell.dataset.date,
    label:     cell.dataset.label,
    venue:     cell.dataset.venue,
    tbd:       false,
    scoreSite: cell.dataset.scoreSite,
    scoreOpp:  cell.dataset.scoreOpp,
    stage:     cell.dataset.stage || null,
    bracket:   cell.dataset.bracket || null
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
  const fabNav     = document.getElementById('floatingNavBtn');
  const fabLabel   = document.getElementById('floatingResultsLabel');
  let fabTimer = null;
  let navTargetInView = false;

  function showFabs() {
    fabResults.classList.add('fab-visible');
    fabTheme.classList.add('fab-visible');
    const onSched = document.getElementById('tabSched').classList.contains('active');
    if (!navTargetInView && onSched) fabNav.classList.add('fab-visible');
    if (fabTimer) clearTimeout(fabTimer);
    fabTimer = setTimeout(() => {
      fabResults.classList.remove('fab-visible');
      fabTheme.classList.remove('fab-visible');
      fabNav.classList.remove('fab-visible');
    }, 1000);
  }

  // ── Nav button: today/tomorrow/<day> logic (PHT = UTC+8) ──
  function getNow() {
    if (!TEST_DATE) return new Date();
    const sign = TEST_DATE.gmt >= 0 ? '+' : '-';
    const hh = String(Math.floor(Math.abs(TEST_DATE.gmt))).padStart(2, '0');
    const mm = String(Math.round((Math.abs(TEST_DATE.gmt) % 1) * 60)).padStart(2, '0');
    return new Date(`${TEST_DATE.date}T${TEST_DATE.time}:00${sign}${hh}:${mm}`);
  }

  function getPhtHour() {
    const now = getNow();
    return Math.floor(((now.getUTCHours() * 60 + now.getUTCMinutes() + 8 * 60) % (24 * 60)) / 60);
  }

  function getNavTarget() {
    const phtHour = getPhtHour();
    const phtNow = new Date(getNow().getTime() + 8 * 3600 * 1000);

    const MONTHS = { January:0, February:1, March:2, April:3, May:4, June:5,
                     July:6, August:7, September:8, October:9, November:10, December:11 };
    function parseDateParts(str) {
      const m = str.match(/(\w+)\s+(\d+),\s+(\d+)/);
      return m ? { year: +m[3], month: MONTHS[m[1]], day: +m[2] } : null;
    }
    function hasEvents(date) {
      const cy = date.getUTCFullYear(), cm = date.getUTCMonth(), cd = date.getUTCDate();
      return SCHEDULE_DATA.days.some(d => {
        const p = parseDateParts(d.date);
        return p && p.year === cy && p.month === cm && p.day === cd;
      });
    }

    // During today window: only use "Today's Events" if today actually has events
    if (phtHour >= 0 && phtHour < 17 && hasEvents(phtNow)) {
      return { day: phtNow.getUTCDate(), label: "Today's Events" };
    }

    // Otherwise scan forward for the next day with events
    for (let offset = 1; offset <= 30; offset++) {
      const candidate = new Date(phtNow.getTime() + offset * 24 * 3600 * 1000);
      const cd = candidate.getUTCDate();
      const found = SCHEDULE_DATA.days.find(d => {
        const p = parseDateParts(d.date);
        return p && p.year === candidate.getUTCFullYear() && p.month === candidate.getUTCMonth() && p.day === cd;
      });
      if (found) {
        const label = offset === 1 ? "Tomorrow's Events" : `${found.name}'s Events`;
        return { day: cd, label };
      }
    }

    // Fallback: no upcoming events found
    return { day: new Date(phtNow.getTime() + 24 * 3600 * 1000).getUTCDate(), label: "Tomorrow's Events" };
  }

  const DOWN = `<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>`;
  const UP   = `<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>`;

  function syncNavPosition() {
    const { day, label } = getNavTarget();
    document.getElementById('floatingNavLabel').textContent = label;

    const navEl   = document.getElementById('floatingNav');
    const arrowEl = document.getElementById('floatingNavArrow');
    const dayEl   = document.getElementById('day-' + day);

    // If not on the schedule tab, hide the nav FAB entirely
    if (!document.getElementById('tabSched').classList.contains('active')) {
      navTargetInView = false;
      fabNav.classList.remove('fab-visible');
      return;
    }

    // If the target block is hidden (non-schedule view) default to bottom/down
    if (!dayEl || dayEl.offsetParent === null) {
      navTargetInView = false;
      navEl.classList.remove('nav-above');
      arrowEl.innerHTML = DOWN;
      return;
    }

    const rect = dayEl.getBoundingClientRect();
    navTargetInView = rect.top >= 0 && rect.top < window.innerHeight;

    if (navTargetInView) {
      fabNav.classList.remove('fab-visible');
      return;
    }

    if (rect.top < 0) {
      navEl.classList.add('nav-above');
      arrowEl.innerHTML = UP;
    } else {
      navEl.classList.remove('nav-above');
      arrowEl.innerHTML = DOWN;
    }
  }

  syncNavPosition();

  fabNav.addEventListener('click', () => {
    const { day } = getNavTarget();
    // Switch to Schedule view
    document.getElementById('tabSched').click();
    // Scroll to the day block
    const dayEl = document.getElementById('day-' + day);
    if (dayEl) {
      setTimeout(() => {
        const offset = 30;
        const top = dayEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        setTimeout(syncNavPosition, 400);
      }, 50);
    }
    showFabs();
  });

  document.addEventListener('scroll', syncNavPosition, { passive: true });

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

// ── BINIBINING LIGHTBOX ──
function openBbLightbox(imgs, names) {
  const lb = document.getElementById('bbLightbox');
  const container = document.getElementById('bbLightboxImages');
  const multi = imgs.length > 1;
  container.innerHTML = imgs.map((img, i) => `
    <figure class="bb-figure">
      <img src="public/images/bb/${img}" class="bb-img" alt="${names[i] || ''}"${multi ? ' style="max-width:42vw;max-height:65vh"' : ''}>
      ${names[i] ? `<figcaption class="bb-name">${names[i]}</figcaption>` : ''}
    </figure>`).join('');
  lb.classList.add('bb-show');
}

document.addEventListener('click', e => {
  const lb = document.getElementById('bbLightbox');
  if (!lb) return;
  if (lb.classList.contains('bb-show')) {
    if (!e.target.closest('#bbLightboxInner')) lb.classList.remove('bb-show');
    return;
  }
  const entry = e.target.closest('[data-bb-img]');
  const label = e.target.closest('[data-bb-imgs]');
  if (entry) {
    openBbLightbox([entry.dataset.bbImg], [entry.dataset.bbName || '']);
  } else if (label) {
    openBbLightbox(label.dataset.bbImgs.split(','), (label.dataset.bbNames || '').split(','));
  }
});
