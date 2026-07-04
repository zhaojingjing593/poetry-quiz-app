import React, { useState, useEffect, useCallback, useMemo } from 'react'
import allPoems from './data/allPoems.json'
import './App.css'

const FONT_OPTIONS = [
  { label: '默认（微软雅黑）', value: '"Microsoft YaHei", "微软雅黑", sans-serif' },
  { label: '楷体', value: '"KaiTi", "楷体", serif' },
  { label: '宋体', value: '"SimSun", "宋体", serif' },
  { label: '仿宋', value: '"FangSong", "仿宋", serif' },
  { label: '黑体', value: '"SimHei", "黑体", sans-serif' },
  { label: '华文行楷', value: '"STXingkai", "华文行楷", cursive' },
]

const COLOR_THEMES = [
  { name: '淡紫', primary: '#D8B4FE', secondary: '#F3E8FF', accent: '#A855F7', bg: '#FAF5FF', input: '#E9D5FF' },
  { name: '浅粉', primary: '#F9A8D4', secondary: '#FCE7F3', accent: '#EC4899', bg: '#FFF1F2', input: '#FBCFE8' },
  { name: '天蓝', primary: '#93C5FD', secondary: '#DBEAFE', accent: '#3B82F6', bg: '#F0F9FF', input: '#BFDBFE' },
  { name: '薄荷', primary: '#86EFAC', secondary: '#D1FAE5', accent: '#22C55E', bg: '#F0FDF4', input: '#A7F3D0' },
  { name: '暖橙', primary: '#FDBA74', secondary: '#FED7AA', accent: '#F97316', bg: '#FFF7ED', input: '#FED7AA' },
  { name: '灰蓝', primary: '#94A3B8', secondary: '#E2E8F0', accent: '#64748B', bg: '#F8FAFC', input: '#CBD5E1' },
]

const SELECTED_KEY = 'poetry-quiz-selected'
const CUSTOM_KEY = 'poetry-quiz-custom'

function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)] }

/* ──────── Quiz View ──────── */
function QuizView({ poem, onNext }) {
  const [coupletIdx, setCoupletIdx] = useState(-1)
  const [blankUpper, setBlankUpper] = useState(true)
  const [revealed, setRevealed] = useState(false)

  const pickQuiz = useCallback(() => {
    if (!poem || !poem.couplets || poem.couplets.length === 0) return
    const ci = Math.floor(Math.random() * poem.couplets.length)
    setCoupletIdx(ci)
    setBlankUpper(Math.random() < 0.5)
    setRevealed(false)
  }, [poem])

  useEffect(() => { pickQuiz() }, [pickQuiz])

  if (!poem || coupletIdx < 0) return null

  const buildLines = () => poem.couplets.map((couplet, ci) => {
    if (ci === coupletIdx) {
      return { type: 'quiz', shownLine: blankUpper ? couplet[1] : couplet[0],
        blankedLine: blankUpper ? couplet[0] : couplet[1], shown: blankUpper ? 'lower' : 'upper' }
    }
    return { type: 'normal', line0: couplet[0], line1: couplet[1] }
  })

  return (
    <div className="quiz-view">
      <div className="poem-body">
        {buildLines().map((item, ci) => (
          <div key={ci} className={`couplet-row ${item.type === 'quiz' ? 'quiz-couplet' : ''}`}>
            {item.type === 'normal' ? (
              <><span className="line upper">{item.line0}</span><span className="line lower">{item.line1}</span></>
            ) : (
              <>
                <div className={`line quiz-line upper ${blankUpper ? 'blank-cell' : 'shown'}`}
                  onClick={blankUpper && !revealed ? () => setRevealed(true) : undefined}>
                  {blankUpper ? revealed ? <span className="answer-reveal">{item.blankedLine}</span>
                    : <span className="blank-clickable">（点击显示上句）</span>
                    : <span>{item.shownLine}</span>}
                </div>
                <div className={`line quiz-line lower ${!blankUpper ? 'blank-cell' : 'shown'}`}
                  onClick={!blankUpper && !revealed ? () => setRevealed(true) : undefined}>
                  {!blankUpper ? revealed ? <span className="answer-reveal">{item.blankedLine}</span>
                    : <span className="blank-clickable">（点击显示下句）</span>
                    : <span>{item.shownLine}</span>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="action-bar">
        {revealed ? <button className="btn btn-primary" onClick={onNext} autoFocus>下一首 →</button>
          : <span className="tap-hint">点击上方空白处显示答案</span>}
      </div>
    </div>
  )
}

/* ──────── Poem Selector (settings panel) ──────── */
function PoemSelector({ allPoems, selectedIds, setSelectedIds, customPoems, onAddCustom, onClose }) {
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('all')

  const grades = useMemo(() => {
    const gs = [...new Set(allPoems.map(p => p.grade).filter(Boolean))]
    return ['all', ...gs.sort()]
  }, [allPoems])

  const filtered = useMemo(() => {
    let list = [...allPoems]
    if (gradeFilter !== 'all') list = list.filter(p => p.grade === gradeFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q))
    }
    // Add custom poems
    if (gradeFilter === 'all' || gradeFilter === '自定义') {
      customPoems.forEach((cp, i) => {
        if (!cp._deleted) list.push({ ...cp, id: `custom_${i}`, grade: '自定义', _custom: true })
      })
    }
    return list
  }, [allPoems, search, gradeFilter, customPoems])

  const toggleId = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const selectAll = () => {
    const ids = filtered.map(p => p.id)
    setSelectedIds(prev => [...new Set([...prev, ...ids])])
  }

  const deselectAll = () => {
    const ids = filtered.map(p => p.id)
    setSelectedIds(prev => prev.filter(i => !ids.includes(i)))
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel selector-panel" onClick={e => e.stopPropagation()}>
        <h2 className="settings-title">选择古诗</h2>

        <div className="selector-controls">
          <input className="selector-search" type="text" placeholder="搜索诗名或作者..."
            value={search} onChange={e => setSearch(e.target.value)} autoFocus />
          <select className="selector-grade" value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
            {grades.map(g => <option key={g} value={g}>{g === 'all' ? '全部年级' : g}</option>)}
          </select>
        </div>

        <div className="selector-count">
          已选 {selectedIds.length} 首 / 共 {filtered.length} 首
          <div className="selector-batch">
            <button className="mini-btn" onClick={selectAll}>全选</button>
            <button className="mini-btn" onClick={deselectAll}>取消全选</button>
          </div>
        </div>

        <div className="selector-list">
          {filtered.map(p => {
            const isSelected = selectedIds.includes(p.id)
            return (
              <label key={p.id} className={`selector-item ${isSelected ? 'checked' : ''}`}>
                <input type="checkbox" checked={isSelected} onChange={() => toggleId(p.id)} />
                <span className="sel-title">{p.title}</span>
                <span className="sel-author">{p.author}</span>
                <span className="sel-grade">{p.grade}</span>
              </label>
            )
          })}
        </div>

        <button className="btn btn-ghost" style={{width: '100%', marginTop: 8}} onClick={onClose}>完成</button>
      </div>
    </div>
  )
}

/* ──────── App ──────── */
export default function App() {
  const [themeIndex, setThemeIndex] = useState(0)
  const [fontSize, setFontSize] = useState(20)
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value)
  const [showSettings, setShowSettings] = useState(false)
  const [showSelector, setShowSelector] = useState(false)

  // Selection & custom poems from localStorage
  const [selectedIds, setSelectedIds] = useState(() => {
    try { const s = localStorage.getItem(SELECTED_KEY); return s ? JSON.parse(s) : allPoems.map(p => p.id) } catch { return allPoems.map(p => p.id) }
  })
  const [customPoems, setCustomPoems] = useState(() => {
    try { const s = localStorage.getItem(CUSTOM_KEY); return s ? JSON.parse(s) : [] } catch { return [] }
  })

  // Persist
  useEffect(() => { localStorage.setItem(SELECTED_KEY, JSON.stringify(selectedIds)) }, [selectedIds])
  useEffect(() => { localStorage.setItem(CUSTOM_KEY, JSON.stringify(customPoems)) }, [customPoems])

  // Active poems = selected built-in + custom
  const activePoems = useMemo(() => {
    const builtin = allPoems.filter(p => selectedIds.includes(p.id))
    const custom = customPoems.filter(c => c && c.title && c.couplets && c.couplets.length > 0)
    return [...builtin, ...custom]
  }, [selectedIds, customPoems])

  const [currentPoem, setCurrentPoem] = useState(null)
  const [quizKey, setQuizKey] = useState(0)

  const pickNewPoem = useCallback(() => {
    if (activePoems.length === 0) return
    setCurrentPoem(getRandomItem(activePoems))
    setQuizKey(k => k + 1)
  }, [activePoems])

  useEffect(() => { if (activePoems.length > 0) pickNewPoem() }, [activePoems.length, pickNewPoem])

  const theme = COLOR_THEMES[themeIndex]

  if (!currentPoem) {
    return (
      <div className="app" style={{'--color-bg': theme.bg, '--font-family': fontFamily, '--font-size': fontSize+'px'}}>
        <div className="empty-state">
          <p>当前没有选中的古诗。</p>
          <button className="btn btn-primary" onClick={() => setShowSelector(true)}>选择古诗</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app" style={{
      '--color-primary': theme.primary, '--color-secondary': theme.secondary,
      '--color-accent': theme.accent, '--color-bg': theme.bg,
      '--color-input': theme.input, '--font-size': fontSize+'px', '--font-family': fontFamily,
    }}>
      <header className="header">
        <h1 className="title">古诗词抽取智能体</h1>
        <div className="header-controls">
          <button className="settings-btn" onClick={() => setShowSettings(!showSettings)} title="设置">⚙</button>
        </div>
      </header>

      <main className="main-content">
        <div className="poem-header">
          <h2 className="poem-title">{currentPoem.title}</h2>
          <span className="poem-author">{currentPoem.author}</span>
        </div>
        <QuizView key={quizKey} poem={currentPoem} onNext={pickNewPoem} />
      </main>

      {/* Settings */}
      {showSettings && !showSelector && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-panel" onClick={e => e.stopPropagation()}>
            <h2 className="settings-title">设置</h2>

            <div className="settings-group">
              <label className="settings-label">颜色主题</label>
              <div className="color-picker">
                {COLOR_THEMES.map((t, i) => (
                  <button key={t.name} className={`color-btn ${i === themeIndex ? 'active' : ''}`}
                    style={{backgroundColor: t.primary}} onClick={() => setThemeIndex(i)} title={t.name}>
                    {i === themeIndex && '✓'}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <label className="settings-label">字号：{fontSize}px</label>
              <input type="range" className="font-slider" min="14" max="36" value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))} />
            </div>

            <div className="settings-group">
              <label className="settings-label">字体</label>
              <select className="font-select" value={fontFamily}
                onChange={e => setFontFamily(e.target.value)}>
                {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>

            <div className="settings-group">
              <label className="settings-label">古诗库</label>
              <p className="settings-hint">已选 {selectedIds.length} 首 / 共 {allPoems.length} 首</p>
              <button className="btn btn-ghost" style={{width: '100%', marginTop: 4}}
                onClick={() => setShowSelector(true)}>
                选择要考的古诗
              </button>
            </div>

            <button className="settings-close" onClick={() => setShowSettings(false)}>关闭设置</button>
          </div>
        </div>
      )}

      {/* Poem Selector */}
      {showSelector && (
        <PoemSelector allPoems={allPoems} selectedIds={selectedIds} setSelectedIds={setSelectedIds}
          customPoems={customPoems} onAddCustom={null}
          onClose={() => { setShowSelector(false); setShowSettings(false) }} />
      )}
    </div>
  )
}
