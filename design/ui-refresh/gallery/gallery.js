/* The review gallery: compares directions by component and by screen, and turns picks into feedback text. */
const { directions, pages, components, boxes } = window.MANIFEST
const SHOTS = window.SHOT_ROOT || 'shots'
const STORE_KEY = 'stemn-ui-directions-feedback'
const dirById = Object.fromEntries(directions.map((d) => [d.id, d]))
const pageById = Object.fromEntries(pages.map((p) => [p.id, p]))
const compById = Object.fromEntries(components.map((c) => [c.id, c]))
const proposals = directions.filter((d) => d.id !== 'current')

const el = (tag, props = {}, ...children) => {
  const node = document.createElement(tag)
  for (const [key, value] of Object.entries(props)) {
    if (key === 'class') node.className = value
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value)
    else if (key === 'text') node.textContent = value
    else if (value !== undefined && value !== false) node.setAttribute(key, value)
  }
  node.append(...children.flat().filter(Boolean))
  return node
}

/** `B-C12` is direction B's file list; the reference used everywhere, in the page and in the feedback */
const ref = (dirId, compId) => `${dirById[dirId].letter}-${compId}`
const shot = (dirId, pageId) => `${SHOTS}/${dirId}/${pageId}.webp`

// State: { votes: { 'b/C12': 'keep' | 'drop' }, notes: { 'b/C12': text }, favourite: 'b', overall: text }
let state = { votes: {}, notes: {}, favourite: null, overall: '' }
let remoteDoc = null
const loadLocal = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY))
    if (saved) state = { ...state, ...saved }
  } catch {
    // Storage can be blocked: picks then last until the page closes, and Copy feedback still works
  }
}
let saveTimer
const save = () => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state))
  } catch {
    // see loadLocal
  }
  clearTimeout(saveTimer)
  saveTimer = setTimeout(
    () => remoteDoc?.set({ state: JSON.stringify(state), text: feedbackText() }).catch(() => {}),
    500,
  )
  renderCount()
}

const feedbackText = () => {
  const lines = ['# Stemn UI directions: feedback', '']
  if (state.favourite)
    lines.push(`Overall favourite: ${dirById[state.favourite].letter} (${dirById[state.favourite].name})`, '')
  if (state.overall.trim()) lines.push(state.overall.trim(), '')
  const used = components.filter((c) =>
    directions.some((d) => state.votes[`${d.id}/${c.id}`] || state.notes[`${d.id}/${c.id}`]?.trim()),
  )
  for (const comp of used) {
    lines.push(`${comp.id} ${comp.name}`)
    for (const dir of directions) {
      const key = `${dir.id}/${comp.id}`
      const vote = state.votes[key]
      const note = state.notes[key]?.trim()
      if (!vote && !note) continue
      lines.push(
        `  ${vote === 'keep' ? 'KEEP' : vote === 'drop' ? 'DROP' : 'NOTE'} ${ref(dir.id, comp.id)}${note ? `: ${note}` : ''}`,
      )
    }
  }
  if (lines.length <= 2) lines.push('(nothing picked yet)')
  return lines.join('\n')
}

let view = 'overview'
let compId = components[0].id
let screenId = 'P03'
let screenDir = 'a'
let screenCompare = 'current'
let showHot = true
let compColumns = 'auto'
const main = document.getElementById('main')

const setView = (next, push = true) => {
  view = next
  if (push) {
    try {
      location.hash = next
    } catch {
      // the hash is a convenience only
    }
  }
  render()
  window.scrollTo(0, 0)
}

const copyFeedback = async (button) => {
  const original = button.textContent
  try {
    await navigator.clipboard.writeText(feedbackText())
    button.textContent = 'Copied'
  } catch {
    button.textContent = 'Blocked: copy it from the Feedback tab'
    setView('feedback')
  }
  setTimeout(() => (button.textContent = original), 2000)
}

const renderCount = () => {
  const votes = Object.values(state.votes)
  const keep = votes.filter((v) => v === 'keep').length
  const drop = votes.filter((v) => v === 'drop').length
  document.getElementById('count').textContent = `${keep} kept · ${drop} dropped`
}

/** A component's box from a full-page screenshot, scaled to the card's width */
const crop = (dirId, comp, maxH) => {
  const box = boxes[dirId]?.[comp.page]?.components?.[comp.id]
  const size = boxes[dirId]?.[comp.page]?.size
  if (!box || !size) return el('div', { class: 'empty', text: 'Not on this screen in this direction' })
  const [x, y, w, h] = box
  const frame = el('button', {
    class: 'crop',
    title: `Open ${ref(dirId, comp.id)} at full size`,
    'aria-label': `Open ${ref(dirId, comp.id)} at full size`,
    onclick: () => openLightbox(dirId, comp),
  })
  const clip = el('span', { class: 'crop-clip' })
  const img = el('img', { src: shot(dirId, comp.page), alt: `${comp.name} in ${dirById[dirId].name}`, loading: 'lazy' })
  clip.append(img)
  frame.append(clip)
  const layout = () => {
    const width = frame.clientWidth || 460
    const scale = Math.min(1, width / w)
    const height = Math.min(h * scale, maxH || Infinity)
    frame.style.height = `${height}px`
    clip.style.width = `${w * scale}px`
    clip.style.height = `${height}px`
    img.style.width = `${size.w * scale}px`
    img.style.left = `${-x * scale}px`
    img.style.top = `${-y * scale}px`
  }
  requestAnimationFrame(layout)
  new ResizeObserver(layout).observe(frame)
  return frame
}

const openLightbox = (dirId, comp) => {
  const inner = document.getElementById('lightbox-inner')
  inner.replaceChildren()
  const [x, y, w, h] = boxes[dirId][comp.page].components[comp.id]
  const size = boxes[dirId][comp.page].size
  const frame = el('div', { style: `position:relative;overflow:hidden;width:100%;aspect-ratio:${w}/${h}` })
  const scale = 100 / w
  frame.append(
    el('img', {
      src: shot(dirId, comp.page),
      alt: `${comp.name} in ${dirById[dirId].name}`,
      style: `position:absolute;max-width:none;width:${size.w * scale}%;left:${-x * scale}%;top:${(-y / h) * 100}%`,
    }),
  )
  inner.append(frame)
  document.getElementById('lightbox').classList.add('open')
  document.getElementById('lightbox-close').focus()
}
const closeLightbox = () => document.getElementById('lightbox').classList.remove('open')

const voteButtons = (dirId, comp, card) => {
  const key = `${dirId}/${comp.id}`
  const sync = () => {
    keep.setAttribute('aria-pressed', state.votes[key] === 'keep')
    drop.setAttribute('aria-pressed', state.votes[key] === 'drop')
    card.classList.toggle('keep', state.votes[key] === 'keep')
    card.classList.toggle('drop', state.votes[key] === 'drop')
  }
  const toggle = (value) => () => {
    if (state.votes[key] === value) delete state.votes[key]
    else state.votes[key] = value
    sync()
    save()
    renderSideMarks()
  }
  const keep = el('button', { class: 'k', text: 'Keep', onclick: toggle('keep') })
  const drop = el('button', { class: 'd', text: 'Drop', onclick: toggle('drop') })
  sync()
  return el('div', { class: 'vote' }, keep, drop)
}

const renderSideMarks = () => {
  document.querySelectorAll('.side button[data-comp]').forEach((button) => {
    const id = button.dataset.comp
    const count = directions.filter((d) => state.votes[`${d.id}/${id}`] === 'keep').length
    button.querySelector('.done').textContent = count ? `${count} kept` : ''
  })
}

const componentCard = (dir, comp) => {
  const key = `${dir.id}/${comp.id}`
  const card = el('article', { class: 'variant' })
  card.append(
    el(
      'div',
      { class: 'variant-head' },
      el('span', { class: 'ref mono', text: ref(dir.id, comp.id) }),
      el('span', { class: 'variant-name', text: dir.name }),
      voteButtons(dir.id, comp, card),
    ),
    crop(dir.id, comp, comp.maxHeight || 720),
    el('textarea', {
      class: 'note',
      rows: 1,
      placeholder: `Note on ${ref(dir.id, comp.id)}`,
      'aria-label': `Note on ${ref(dir.id, comp.id)}`,
      oninput: (event) => {
        state.notes[key] = event.target.value
        save()
      },
    }),
  )
  card.querySelector('textarea').value = state.notes[key] || ''
  return card
}

const renderComponents = () => {
  const groups = [...new Set(components.map((c) => c.group))]
  const side = el(
    'aside',
    { class: 'side' },
    groups.flatMap((group) => [
      el('h3', { text: group }),
      ...components
        .filter((c) => c.group === group)
        .map((c) =>
          el(
            'button',
            {
              'data-comp': c.id,
              'aria-current': c.id === compId,
              onclick: () => {
                compId = c.id
                render()
                window.scrollTo(0, 0)
              },
            },
            el('span', { class: 'id mono', text: c.id }),
            el('span', { text: c.name }),
            el('span', { class: 'done' }),
          ),
        ),
    ]),
  )
  const comp = compById[compId]
  const index = components.indexOf(comp)
  const go = (delta) => () => {
    compId = components[(index + delta + components.length) % components.length].id
    render()
    window.scrollTo(0, 0)
  }
  const widest = Math.max(...directions.map((d) => boxes[d.id]?.[comp.page]?.components?.[comp.id]?.[2] || 0))
  const fit = widest > 1200 ? 1 : widest > 620 ? 2 : 3
  const columns = compColumns === 'auto' ? fit : Number(compColumns)
  const content = el(
    'section',
    {},
    el(
      'div',
      { class: 'comp-head' },
      el(
        'h2',
        {},
        el('span', { class: 'mono', style: 'font-size:15px;color:var(--ink-3);margin-right:8px', text: comp.id }),
        comp.name,
      ),
      el('span', { class: 'count', text: `from ${pageById[comp.page].name} (${comp.page})` }),
      el('div', { class: 'spacer' }),
      select(
        'Columns',
        compColumns,
        [
          ['auto', 'Fit'],
          ['1', '1'],
          ['2', '2'],
          ['3', '3'],
        ],
        (value) => {
          compColumns = value
          render()
        },
      ),
      el('button', { class: 'ghost', text: '← Previous', onclick: go(-1) }),
      el('button', { class: 'ghost', text: 'Next →', onclick: go(1) }),
    ),
    comp.note && el('p', { class: 'lead', text: comp.note }),
    el(
      'div',
      { class: 'comp-grid', style: `--columns:${columns}` },
      directions.map((dir) => componentCard(dir, comp)),
    ),
  )
  main.replaceChildren(el('div', { class: 'layout' }, side, content))
  renderSideMarks()
}

const screenPanel = (dirId) => {
  const data = boxes[dirId]?.[screenId]
  const dir = dirById[dirId]
  if (!data)
    return el(
      'div',
      { class: 'screen' },
      el('div', { class: 'empty', text: `No capture of ${screenId} in ${dir.name}` }),
    )
  const canvas = el('div', { class: 'canvas' })
  canvas.append(
    el('img', { src: shot(dirId, screenId), alt: `${pageById[screenId].name} in ${dir.name}`, loading: 'lazy' }),
  )
  for (const [id, box] of Object.entries(data.components)) {
    const [x, y, w, h] = box
    const height = Math.min(h, data.size.h - y)
    if (height <= 0) continue
    canvas.append(
      el(
        'button',
        {
          class: 'hot',
          title: `${ref(dirId, id)} ${compById[id].name}`,
          'aria-label': `Compare ${compById[id].name} across directions`,
          style: `left:${(x / data.size.w) * 100}%;top:${(y / data.size.h) * 100}%;width:${(w / data.size.w) * 100}%;height:${(height / data.size.h) * 100}%`,
          onclick: () => {
            compId = id
            setView('components')
          },
        },
        el('span', { text: ref(dirId, id) }),
      ),
    )
  }
  return el(
    'article',
    { class: 'screen' },
    el(
      'div',
      { class: 'screen-head' },
      el('span', { class: 'letter', text: dir.letter }),
      el('strong', { text: dir.name }),
      el('span', { class: 'variant-name', text: `${screenId} ${pageById[screenId].name}` }),
    ),
    canvas,
  )
}

const select = (label, value, options, onchange) =>
  el(
    'label',
    {},
    `${label} `,
    el(
      'select',
      { onchange: (event) => onchange(event.target.value) },
      options.map(([id, name]) => el('option', { value: id, selected: id === value, text: name })),
    ),
  )

const renderScreens = () => {
  const dirOptions = directions.map((d) => [d.id, `${d.letter} ${d.name}`])
  const bar = el(
    'div',
    { class: 'bar' },
    select(
      'Screen',
      screenId,
      pages.map((p) => [p.id, `${p.id} ${p.name}`]),
      (v) => {
        screenId = v
        render()
      },
    ),
    select('Direction', screenDir, dirOptions, (v) => {
      screenDir = v
      render()
    }),
    select('Compare with', screenCompare, [['none', 'Nothing'], ...dirOptions], (v) => {
      screenCompare = v
      render()
    }),
    el(
      'label',
      { class: 'toggle' },
      el('input', {
        type: 'checkbox',
        checked: showHot,
        onchange: (event) => {
          showHot = event.target.checked
          render()
        },
      }),
      'Show component ids',
    ),
    el('span', { class: 'count', text: 'Click a labelled area to compare that component. Keys ← → change direction.' }),
  )
  const panels = [screenDir, screenCompare !== 'none' && screenCompare !== screenDir ? screenCompare : null].filter(
    Boolean,
  )
  main.replaceChildren(
    bar,
    el(
      'div',
      { class: `screens${panels.length > 1 ? ' two' : ''}${showHot ? '' : ' no-hot'}` },
      panels.map(screenPanel),
    ),
  )
}

const renderOverview = () => {
  const cards = directions.map((dir) => {
    const favourite = state.favourite === dir.id
    return el(
      'article',
      { class: `card${favourite ? ' fav' : ''}` },
      el(
        'button',
        {
          class: 'thumb',
          'aria-label': `Open ${dir.name} screens`,
          onclick: () => {
            screenDir = dir.id
            screenCompare = 'none'
            setView('screens')
          },
        },
        el('img', { src: shot(dir.id, 'P03'), alt: `Project overview in ${dir.name}`, loading: 'lazy' }),
      ),
      el(
        'div',
        { class: 'card-body' },
        el(
          'div',
          { class: 'card-title' },
          el('span', { class: 'letter', text: dir.letter }),
          el('strong', { text: dir.name }),
        ),
        el('div', { class: 'tagline', text: dir.tagline }),
        el('p', { text: dir.summary }),
        el(
          'div',
          { class: 'swatches' },
          dir.swatches.map((c) => el('i', { style: `background:${c}` })),
          el('span', { text: dir.fonts }),
        ),
        el(
          'div',
          { class: 'card-actions' },
          el('button', {
            class: 'ghost',
            text: 'View screens',
            onclick: () => {
              screenDir = dir.id
              screenCompare = dir.id === 'current' ? 'none' : 'current'
              setView('screens')
            },
          }),
          dir.id !== 'current' &&
            el('button', {
              class: 'ghost',
              'aria-pressed': favourite,
              text: favourite ? 'Favourite' : 'Mark favourite',
              onclick: () => {
                state.favourite = favourite ? null : dir.id
                save()
                render()
              },
            }),
        ),
      ),
    )
  })
  main.replaceChildren(
    el('h2', { text: 'Five directions on the real app' }),
    el('p', {
      class: 'lead',
      text: 'Every image is a screenshot of the running Stemn website with seeded data, with one stylesheet applied over it. Nothing here is a mockup, and no app code changed.',
    }),
    el(
      'div',
      { class: 'how' },
      el('div', {}, el('b', { text: '1. Get a feel' }), 'Scan the directions here, then open a few in Screens.'),
      el(
        'div',
        {},
        el('b', { text: '2. Compare parts' }),
        'In Components, each part is shown in all directions. Mark Keep or Drop, and add notes.',
      ),
      el(
        'div',
        {},
        el('b', { text: '3. Use the ids' }),
        'B-C12 means direction B, component 12 (file list). Mix them freely: nav from E, tables from C.',
      ),
      el(
        'div',
        {},
        el('b', { text: '4. Send it' }),
        'Copy feedback gives you text to paste back to Claude or into the PR.',
      ),
    ),
    el('div', { class: 'cards' }, cards),
  )
}

const renderFeedback = () => {
  const output = el('pre', { class: 'out', text: feedbackText() })
  const overall = el('textarea', {
    placeholder: 'What should the final version feel like? What is missing from all five?',
    'aria-label': 'Overall notes',
    oninput: (event) => {
      state.overall = event.target.value
      save()
      output.textContent = feedbackText()
    },
  })
  overall.value = state.overall
  const copy = el('button', { class: 'primary', text: 'Copy feedback', onclick: (event) => copyFeedback(event.target) })
  const reset = el('button', {
    class: 'ghost',
    text: 'Clear all picks',
    onclick: (event) => {
      if (event.target.dataset.armed) {
        state = { votes: {}, notes: {}, favourite: null, overall: '' }
        save()
        render()
      } else {
        event.target.dataset.armed = 'yes'
        event.target.textContent = 'Click again to clear'
      }
    },
  })
  const tally = el(
    'table',
    { class: 'tally' },
    el(
      'thead',
      {},
      el(
        'tr',
        {},
        el('th', { text: 'Direction' }),
        el('th', { class: 'num', text: 'Keep' }),
        el('th', { class: 'num', text: 'Drop' }),
      ),
    ),
    el(
      'tbody',
      {},
      proposals.map((dir) => {
        const of = (value) => components.filter((c) => state.votes[`${dir.id}/${c.id}`] === value).length
        return el(
          'tr',
          {},
          el('td', { text: `${dir.letter} ${dir.name}${state.favourite === dir.id ? ' (favourite)' : ''}` }),
          el('td', { class: 'num', text: of('keep') }),
          el('td', { class: 'num', text: of('drop') }),
        )
      }),
    ),
  )
  main.replaceChildren(
    el('h2', { text: 'Your feedback' }),
    el('p', {
      class: 'lead',
      text: 'Picks save in this browser as you go. Copy this and paste it back to Claude, or into the PR as a comment.',
    }),
    el(
      'div',
      { class: 'fb' },
      el(
        'div',
        { style: 'display:grid;gap:16px' },
        el('div', { class: 'fb-panel' }, el('h3', { text: 'Overall notes' }), overall),
        el('div', { class: 'fb-panel' }, el('h3', { text: 'Tally' }), tally),
      ),
      el(
        'div',
        { class: 'fb-panel' },
        el(
          'div',
          { style: 'display:flex;gap:8px;margin-bottom:10px;align-items:center' },
          copy,
          reset,
          el('span', { class: 'saved', text: remoteDoc ? 'Claude can also read these picks from this page' : '' }),
        ),
        output,
      ),
    ),
  )
}

const render = () => {
  document
    .querySelectorAll('.nav button')
    .forEach((button) => button.setAttribute('aria-current', button.dataset.view === view))
  if (view === 'components') renderComponents()
  else if (view === 'screens') renderScreens()
  else if (view === 'feedback') renderFeedback()
  else renderOverview()
  renderCount()
}

document
  .querySelectorAll('.nav button')
  .forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)))
document.getElementById('copy-top').addEventListener('click', (event) => copyFeedback(event.target))
document.getElementById('lightbox-close').addEventListener('click', closeLightbox)
document.getElementById('lightbox').addEventListener('click', (event) => {
  if (event.target.id === 'lightbox') closeLightbox()
})
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox()
  if (
    view !== 'screens' ||
    !['ArrowLeft', 'ArrowRight'].includes(event.key) ||
    event.target.matches('select, textarea, input')
  )
    return
  const ids = directions.map((d) => d.id)
  screenDir = ids[(ids.indexOf(screenDir) + (event.key === 'ArrowRight' ? 1 : -1) + ids.length) % ids.length]
  render()
})
window.addEventListener('hashchange', () => {
  const next = location.hash.slice(1)
  if (['overview', 'components', 'screens', 'feedback'].includes(next) && next !== view) setView(next, false)
})

loadLocal()
const initial = location.hash.slice(1)
if (['components', 'screens', 'feedback'].includes(initial)) view = initial
render()

// Published as an artifact, picks are also kept in its database, so Claude can read them without a paste
if (window.claude?.use) {
  window.claude
    .use('db')
    .then(async (db) => {
      if (!db) return
      remoteDoc = db.doc('feedback/current')
      const saved = await remoteDoc.get().catch(() => null)
      const data = typeof saved?.data === 'function' ? saved.data() : (saved?.data ?? saved)
      const hasLocal = Object.keys(state.votes).length || Object.keys(state.notes).length
      if (data?.state && !hasLocal) {
        state = { ...state, ...JSON.parse(data.state) }
        render()
      }
    })
    .catch(() => {})
}
