// ============================================================
// START: SubjectsView.jsx — New Subjects Section for StudyHub
// Integrates into <main> via App.jsx activeTab === 'subjects'
// ============================================================
import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  Database,
  Globe,
  Code2,
  Monitor,
  GitBranch,
  Network,
  SlidersHorizontal,
  ArrowUpDown,
  User,
  ArrowRight,
  Plus,
  X,
  ChevronDown,
  BookOpen,
  Cpu,
  FlaskConical,
  Calculator,
  Landmark,
  TrendingUp,
  Check,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────
const INITIAL_SUBJECTS = [
  {
    id: 1,
    code: 'CS 302',
    semester: 5,
    title: 'Database Systems',
    instructor: 'Dr. Emily Carter',
    credits: 6,
    type: 'Mandatory',
    icon: 'database',
    color: 'blue',
    description: 'Exploration of relational databases, SQL optimization, and data modeling. This course covers the fundamental concepts required to design and implement efficient, scalable data storage solutions. Key topics include normalization, transaction management, and noSQL alternatives.',
    learningHours: 120,
    difficulty: 'Intermediate',
    progress: 65,
    modules: [
      { id: 1, title: 'Module 1: Relational Model', completed: true },
      { id: 2, title: 'Module 2: SQL Advanced', completed: true },
      { id: 3, title: 'Module 3: Indexing & Tuning', completed: false },
    ],
    lectures: [
      { id: 1, title: 'Introduction to SQL', module: 'Module 1', date: 'Oct 5, 2023', attachments: [{ name: 'Intro_to_SQL.pdf', type: 'pdf' }, { name: 'exercise_1.sql', type: 'code' }] },
      { id: 2, title: 'Normalization Forms', module: 'Module 2', date: 'Oct 12, 2023', attachments: [{ name: 'Normalization_Rules.pdf', type: 'pdf' }] },
      { id: 3, title: 'Indexing Strategies', module: 'Module 3', date: 'Oct 20, 2023', attachments: [{ name: 'Indexing_Slides.pdf', type: 'pdf' }] },
    ],
    deadlines: [
      { id: 1, urgency: 'IN 3 DAYS', urgentColor: 'text-primary', title: 'Final Project Proposal', desc: 'Submit schema draft via LMS' },
      { id: 2, urgency: 'MAY 14', urgentColor: 'text-[#737686]', title: 'Midterm Exam', desc: 'Covers Modules 1-4 • Hall B' },
    ],
    assignments: [
      { id: 1, title: 'Project 1: Schema Design', status: 'graded', grade: '100/100' },
      { id: 2, title: 'Project 2: Query Optimization', status: 'in-progress', grade: null },
    ],
  },
  {
    id: 2,
    code: 'CS 405',
    semester: 5,
    title: 'Web Applications',
    instructor: 'Prof. Alan Turing',
    credits: 4,
    type: 'Elective',
    icon: 'globe',
    color: 'orange',
    description: 'Building modern full-stack applications using React, Node.js, and modern web APIs. Learn state management, routing, and best practices for scalable web development.',
    learningHours: 96,
    difficulty: 'Advanced',
    progress: 42,
    modules: [
      { id: 1, title: 'Module 1: React Fundamentals', completed: true },
      { id: 2, title: 'Module 2: State Management', completed: false },
      { id: 3, title: 'Module 3: Backend Integration', completed: false },
    ],
    lectures: [
      { id: 1, title: 'React Hooks & Effects', module: 'Module 1', date: 'Nov 2, 2023', attachments: [{ name: 'React_Basics.pdf', type: 'pdf' }] },
      { id: 2, title: 'Redux & Context API', module: 'Module 2', date: 'Nov 9, 2023', attachments: [{ name: 'StateManagement.pdf', type: 'pdf' }, { name: 'redux_example.js', type: 'code' }] },
    ],
    deadlines: [
      { id: 1, urgency: 'IN 5 DAYS', urgentColor: 'text-primary', title: 'Mini Project - Todo App', desc: 'React hooks implementation' },
    ],
    assignments: [
      { id: 1, title: 'Assignment 1: Component Design', status: 'in-progress', grade: null },
    ],
  },
  {
    id: 3,
    code: 'CS 101',
    semester: 5,
    title: 'Programming',
    instructor: 'Dr. Sarah Jenkins',
    credits: 8,
    type: 'Mandatory',
    icon: 'code',
    color: 'green',
    description: 'Foundational concepts of algorithms, data structures, and object-oriented programming. Covers design patterns, SOLID principles, and competitive programming techniques.',
    learningHours: 150,
    difficulty: 'Beginner',
    progress: 88,
    modules: [
      { id: 1, title: 'Module 1: Basics', completed: true },
      { id: 2, title: 'Module 2: OOP', completed: true },
      { id: 3, title: 'Module 3: Algorithms', completed: true },
      { id: 4, title: 'Module 4: Advanced Patterns', completed: false },
    ],
    lectures: [
      { id: 1, title: 'Variables & Data Types', module: 'Module 1', date: 'Sep 1, 2023', attachments: [{ name: 'Basics.pdf', type: 'pdf' }] },
      { id: 2, title: 'Classes & Objects', module: 'Module 2', date: 'Sep 15, 2023', attachments: [{ name: 'OOP.pdf', type: 'pdf' }, { name: 'example.py', type: 'code' }] },
    ],
    deadlines: [
      { id: 1, urgency: 'COMPLETED', urgentColor: 'text-emerald-600', title: 'Lab 1: Sorting Algorithms', desc: 'Bubble sort, Quick sort implementation' },
    ],
    assignments: [
      { id: 1, title: 'Midterm Project', status: 'graded', grade: '95/100' },
      { id: 2, title: 'Final Project', status: 'in-progress', grade: null },
    ],
  },
  {
    id: 4,
    code: 'CS 305',
    semester: 5,
    title: 'Operating Systems',
    instructor: 'Dr. Robert Miles',
    credits: 6,
    type: 'Mandatory',
    icon: 'monitor',
    color: 'purple',
    description: 'Study of process management, memory allocation, file systems, and concurrency control. Understand kernel design and system-level programming.',
    learningHours: 120,
    difficulty: 'Advanced',
    progress: 30,
    modules: [
      { id: 1, title: 'Module 1: Process Management', completed: true },
      { id: 2, title: 'Module 2: Memory Management', completed: false },
      { id: 3, title: 'Module 3: File Systems', completed: false },
    ],
    lectures: [
      { id: 1, title: 'Processes & Threads', module: 'Module 1', date: 'Oct 3, 2023', attachments: [{ name: 'ProcessManagement.pdf', type: 'pdf' }] },
    ],
    deadlines: [
      { id: 1, urgency: 'IN 2 DAYS', urgentColor: 'text-primary', title: 'Assignment 2: Memory Simulation', desc: 'Virtual memory paging' },
    ],
    assignments: [
      { id: 1, title: 'Assignment 1: Process Scheduling', status: 'graded', grade: '88/100' },
    ],
  },
  {
    id: 5,
    code: 'CS 402',
    semester: 5,
    title: 'Software Engineering',
    instructor: 'Prof. Linda Gray',
    credits: 6,
    type: 'Mandatory',
    icon: 'git',
    color: 'red',
    description: 'Methodologies for software development life cycles, Agile practices, and team collaboration. Learn SDLC, testing strategies, and deployment pipelines.',
    learningHours: 108,
    difficulty: 'Intermediate',
    progress: 55,
    modules: [
      { id: 1, title: 'Module 1: SDLC Overview', completed: true },
      { id: 2, title: 'Module 2: Agile & Scrum', completed: true },
      { id: 3, title: 'Module 3: Testing & QA', completed: false },
    ],
    lectures: [
      { id: 1, title: 'Software Development Lifecycle', module: 'Module 1', date: 'Oct 1, 2023', attachments: [{ name: 'SDLC.pdf', type: 'pdf' }] },
      { id: 2, title: 'Agile Frameworks', module: 'Module 2', date: 'Oct 8, 2023', attachments: [{ name: 'Agile_Guide.pdf', type: 'pdf' }] },
    ],
    deadlines: [
      { id: 1, urgency: 'IN 7 DAYS', urgentColor: 'text-[#737686]', title: 'Project Proposal', desc: 'Define requirements & architecture' },
    ],
    assignments: [
      { id: 1, title: 'Case Study Analysis', status: 'in-progress', grade: null },
    ],
  },
  {
    id: 6,
    code: 'CS 308',
    semester: 5,
    title: 'Computer Networks',
    instructor: 'Dr. Kevin Wright',
    credits: 4,
    type: 'Elective',
    icon: 'network',
    color: 'blue',
    description: 'Understanding OSI model, TCP/IP protocols, and network security. Learn routing algorithms, network design, and cybersecurity fundamentals.',
    learningHours: 84,
    difficulty: 'Intermediate',
    progress: 15,
    modules: [
      { id: 1, title: 'Module 1: OSI Model', completed: true },
      { id: 2, title: 'Module 2: TCP/IP Protocols', completed: false },
      { id: 3, title: 'Module 3: Network Security', completed: false },
    ],
    lectures: [
      { id: 1, title: 'Network Fundamentals', module: 'Module 1', date: 'Nov 1, 2023', attachments: [{ name: 'Networks_101.pdf', type: 'pdf' }] },
    ],
    deadlines: [
      { id: 1, urgency: 'IN 10 DAYS', urgentColor: 'text-[#737686]', title: 'Lab 1: Network Configuration', desc: 'Setup & test network topology' },
    ],
    assignments: [
      { id: 1, title: 'Packet Analysis Project', status: 'not-started', grade: null },
    ],
  },
]

const ICON_MAP = {
  database: Database,
  globe: Globe,
  code: Code2,
  monitor: Monitor,
  git: GitBranch,
  network: Network,
  cpu: Cpu,
  flask: FlaskConical,
  calculator: Calculator,
  landmark: Landmark,
  trending: TrendingUp,
  book: BookOpen,
}

const ICON_OPTIONS = [
  { key: 'database', label: 'Database', Icon: Database },
  { key: 'globe', label: 'Globe', Icon: Globe },
  { key: 'code', label: 'Code', Icon: Code2 },
  { key: 'monitor', label: 'Monitor', Icon: Monitor },
  { key: 'git', label: 'Git Branch', Icon: GitBranch },
  { key: 'network', label: 'Network', Icon: Network },
  { key: 'cpu', label: 'CPU', Icon: Cpu },
  { key: 'flask', label: 'Flask', Icon: FlaskConical },
  { key: 'calculator', label: 'Calculator', Icon: Calculator },
  { key: 'landmark', label: 'Landmark', Icon: Landmark },
  { key: 'book', label: 'Book', Icon: BookOpen },
]

// Progress bar colour by percentage range
const getProgressColor = (pct) => {
  if (pct >= 70) return '#2563eb'   // primary blue — matches screenshot
  if (pct >= 40) return '#2563eb'
  return '#2563eb'                   // same blue throughout (matches mockup)
}

// Type-badge styling
const TYPE_STYLES = {
  Mandatory: 'bg-[#eeefff] text-[#004ac6]',
  Elective:  'bg-[#e6f4ea] text-emerald-700',
}

// ─── Single Subject Card ─────────────────────────────────────
const SubjectCard = ({ subject, onSelectSubject }) => {
  const IconComponent = ICON_MAP[subject.icon] || BookOpen
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-ambient hover:shadow-md transition-shadow flex flex-col p-5 gap-4 font-inter">
      {/* Card header row: icon + badge */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 bg-[#eeefff] text-[#004ac6] flex items-center justify-center rounded-md shrink-0">
          <IconComponent className="w-5 h-5" />
        </div>
        <span className={`text-label-sm font-bold px-2.5 py-0.5 rounded-sm ${TYPE_STYLES[subject.type] ?? 'bg-slate-100 text-slate-600'}`}>
          {subject.type}
        </span>
      </div>

      {/* Meta: code + credits */}
      <div className="flex items-center gap-2">
        <span className="text-label-sm font-extrabold text-primary uppercase tracking-wide">{subject.code}</span>
        <span className="w-1 h-1 rounded-full bg-[#737686] shrink-0" />
        <span className="text-label-sm text-[#737686] font-medium">{subject.credits} Credits</span>
      </div>

      {/* Title + description */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-headline-md font-bold text-on-surface leading-snug">{subject.title}</h3>
        <p className="text-body-md text-[#737686] line-clamp-2 leading-relaxed">{subject.description}</p>
      </div>

      {/* Instructor + semester */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 text-body-md text-[#737686]">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate text-[13px]">{subject.instructor}</span>
        </div>
        <span className="text-label-sm text-[#737686] font-semibold shrink-0">Sem {subject.semester}</span>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-label-sm text-[#737686] font-medium">Progress</span>
          <span className="text-label-sm font-bold text-primary">{subject.progress}%</span>
        </div>
        <div className="w-full bg-[#e0e3e5] rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${subject.progress}%`, backgroundColor: getProgressColor(subject.progress) }}
          />
        </div>
      </div>

      {/* CTA Button */}
      <button 
        onClick={() => onSelectSubject?.(subject)}
        className="w-full bg-[#004ac6] hover:bg-[#003ea8] active:scale-[0.98] text-white font-semibold py-2.5 rounded-md text-label-md flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm">
        Open Subject
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Create Subject Modal ────────────────────────────────────
const CreateSubjectModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    code: '',
    title: '',
    credits: '4',
    type: 'Mandatory',
    instructor: '',
    semester: '5',
    progress: '0',
    icon: 'book',
    description: '',
  })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.code.trim()) return
    onSave({
      id: Date.now(),
      code: form.code.toUpperCase(),
      credits: Number(form.credits),
      type: form.type,
      icon: form.icon,
      title: form.title,
      description: form.description,
      instructor: form.instructor,
      semester: Number(form.semester),
      progress: Math.min(100, Math.max(0, Number(form.progress))),
    })
    onClose()
  }

  const inputCls = 'w-full px-3 py-2 bg-surface rounded-md border border-[#E2E8F0] text-body-md text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-colors'
  const labelCls = 'text-label-md font-bold text-on-surface-variant'

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-[#E2E8F0] w-full max-w-lg overflow-hidden font-inter">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-surface">
          <h2 className="text-headline-md font-bold text-on-surface">Add New Subject</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#E2E8F0] text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Subject Title</label>
            <input required placeholder="e.g. Artificial Intelligence" value={form.title} onChange={set('title')} className={inputCls} />
          </div>

          {/* Code + Credits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Course Code</label>
              <input required placeholder="e.g. CS 501" value={form.code} onChange={set('code')} className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Credits</label>
              <select value={form.credits} onChange={set('credits')} className={inputCls}>
                {[2, 3, 4, 5, 6, 7, 8].map(c => <option key={c} value={c}>{c} Credits</option>)}
              </select>
            </div>
          </div>

          {/* Type + Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Type</label>
              <select value={form.type} onChange={set('type')} className={inputCls}>
                <option>Mandatory</option>
                <option>Elective</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Semester</label>
              <select value={form.semester} onChange={set('semester')} className={inputCls}>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Instructor</label>
            <input placeholder="e.g. Prof. John Doe" value={form.instructor} onChange={set('instructor')} className={inputCls} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Short Description</label>
            <textarea rows={2} placeholder="Brief description of the subject..." value={form.description} onChange={set('description')} className={`${inputCls} resize-none`} />
          </div>

          {/* Icon picker */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Icon</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {ICON_OPTIONS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  title={label}
                  onClick={() => setForm(f => ({ ...f, icon: key }))}
                  className={`relative w-full aspect-square flex items-center justify-center rounded-md border transition-all cursor-pointer ${
                    form.icon === key
                      ? 'bg-[#eeefff] border-primary text-primary ring-1 ring-primary/25'
                      : 'bg-white border-[#E2E8F0] text-on-surface-variant hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {form.icon === key && <Check className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Initial Progress ({form.progress}%)</label>
            <input type="range" min="0" max="100" value={form.progress} onChange={set('progress')} className="w-full accent-primary cursor-pointer" />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-[#E2E8F0] mt-2">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-4 py-2 border border-[#E2E8F0] rounded-md text-label-md font-semibold text-on-surface-variant hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-[#004ac6] hover:bg-[#003ea8] text-white rounded-md text-label-md font-semibold shadow-sm transition-colors cursor-pointer">Save Subject</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Dropdown helper ─────────────────────────────────────────
const Dropdown = ({ label, icon: Icon, options, value, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative w-full sm:w-auto" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full sm:w-auto items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded-md text-label-md font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer shadow-ambient"
      >
        <Icon className="w-3.5 h-3.5 text-[#737686]" />
        {label}
        <ChevronDown className={`w-3 h-3 text-[#737686] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-30 bg-white border border-[#E2E8F0] rounded-lg shadow-lg min-w-[160px] py-1 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-label-md font-medium transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                value === opt.value ? 'text-primary bg-[#eeefff]' : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {opt.label}
              {value === opt.value && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main SubjectsView Component ─────────────────────────────
const SubjectsView = ({ onSelectSubject }) => {
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS)
  const [filterType, setFilterType] = useState('all')     // 'all' | 'Mandatory' | 'Elective'
  const [sortKey, setSortKey] = useState('default')       // 'default' | 'name' | 'progress' | 'credits'
  const [isModalOpen, setIsModalOpen] = useState(false)

  const FILTER_OPTIONS = [
    { value: 'all',       label: 'All Subjects' },
    { value: 'Mandatory', label: 'Mandatory' },
    { value: 'Elective',  label: 'Elective' },
  ]

  const SORT_OPTIONS = [
    { value: 'default',  label: 'Default Order' },
    { value: 'name',     label: 'Name (A–Z)' },
    { value: 'progress', label: 'Progress (High–Low)' },
    { value: 'credits',  label: 'Credits (High–Low)' },
  ]

  const displayed = useMemo(() => {
    let list = [...subjects]

    // Filter
    if (filterType !== 'all') list = list.filter(s => s.type === filterType)

    // Sort
    if (sortKey === 'name')     list.sort((a, b) => a.title.localeCompare(b.title))
    if (sortKey === 'progress') list.sort((a, b) => b.progress - a.progress)
    if (sortKey === 'credits')  list.sort((a, b) => b.credits - a.credits)

    return list
  }, [subjects, filterType, sortKey])

  const handleSave = (newSubject) => setSubjects(prev => [...prev, newSubject])

  const filterLabel = FILTER_OPTIONS.find(o => o.value === filterType)?.label ?? 'Filter'
  const sortLabel   = SORT_OPTIONS.find(o => o.value === sortKey)?.label ?? 'Sort'

  return (
    <>
      {/* ================================================ */}
      {/* START: Subjects Section — inner <main> content   */}
      {/* ================================================ */}
      <div className="w-full flex flex-col gap-8 font-inter pb-16">

        {/* ── Page Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 min-w-0">
            <h1 className="text-display text-on-surface">My Subjects</h1>
            <p className="text-body-md text-[#737686]">Manage your academic curriculum and track learning progress.</p>
          </div>

          {/* Filter + Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <Dropdown
                label={filterLabel}
                icon={SlidersHorizontal}
                options={FILTER_OPTIONS}
                value={filterType}
                onChange={setFilterType}
              />
            </div>
            <div className="w-full sm:w-auto">
              <Dropdown
                label={sortLabel}
                icon={ArrowUpDown}
                options={SORT_OPTIONS}
                value={sortKey}
                onChange={setSortKey}
              />
            </div>
          </div>
        </div>

        {/* ── Subjects Grid ── */}
        {displayed.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-16 text-center flex flex-col items-center gap-3 shadow-ambient">
            <div className="w-12 h-12 bg-[#eeefff] text-primary rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-headline-md font-semibold text-on-surface">No subjects found</p>
            <p className="text-body-md text-[#737686]">Try changing the filter or add a new subject.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayed.map(subject => (
              <SubjectCard key={subject.id} subject={subject} onSelectSubject={onSelectSubject} />
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="text-center text-body-md text-[#737686] pt-4 border-t border-[#E2E8F0]">
          © 2024 ScholarFlow Academic Systems. All modules are up to date for the Fall 2024 Semester.
        </footer>
      </div>

      {/* ── Floating Action Button ── */}
      <button
        onClick={() => setIsModalOpen(true)}
        title="Add New Subject"
        className="fixed lg:bottom-8 bottom-20 right-8 w-14 h-14 bg-[#004ac6] hover:bg-[#003ea8] active:scale-95 text-white rounded-full shadow-xl flex items-center justify-center transition-all z-30 cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ── Create Subject Modal ── */}
      {isModalOpen && (
        <CreateSubjectModal onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      )}
      {/* ============================================ */}
      {/* END: Subjects Section                        */}
      {/* ============================================ */}
    </>
  )
}

export default SubjectsView
