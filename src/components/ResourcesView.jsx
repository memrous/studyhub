// ============================================================
// START: ResourcesView.jsx — Resources Section for StudyHub
// Integrates into <main> via App.jsx activeTab === 'resources'
// ============================================================
import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  FileText,
  FileVideo,
  FileImage,
  Link2,
  FileType,
  File,
  Download,
  ExternalLink,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  Search,
  Plus,
  X,
  Check,
  FolderOpen,
  BookOpen,
  History,
  Play,
} from 'lucide-react'

// ─── Static Data ─────────────────────────────────────────────
const RESOURCES = [
  // Database Systems
  { id: 1, title: 'SQL Fundamentals.pdf',         subject: 'Database Systems',    type: 'PDF',          tags: ['DATABASE', 'PDF'],          description: 'Core concepts of relational databases, SELECT statements, and basic joins.',        meta: 'Oct 12 • 4.2 MB',   action: 'open',    actionLabel: 'Open' },
  { id: 2, title: 'Database Normalization Notes',  subject: 'Database Systems',    type: 'NOTES',        tags: ['DATABASE', 'NOTES'],         description: 'Detailed guide on 1NF, 2NF, 3NF, and BCNF with practical examples.',              meta: 'Oct 10 • 1.1 MB',   action: 'open',    actionLabel: 'Open' },
  { id: 3, title: 'Indexing Strategies',           subject: 'Database Systems',    type: 'RECORDING',    tags: ['DATABASE', 'RECORDING'],     description: 'Lecture recording covering B-Tree and Hash indexing in PostgreSQL.',               meta: 'Oct 05 • 52:14',    action: 'open',    actionLabel: 'Open' },
  // Web Applications
  { id: 4, title: 'React Components Presentation', subject: 'Web Applications',   type: 'SLIDES',       tags: ['WEB APPS', 'SLIDES'],        description: 'Overview of functional components, hooks, and props management in React.',          meta: 'Oct 14 • 12 Slides', action: 'open',    actionLabel: 'Open' },
  { id: 5, title: 'REST API Guide',                subject: 'Web Applications',   type: 'LINK',         tags: ['WEB APPS', 'LINK'],          description: 'Curated documentation and best practices for building scalable RESTful APIs.',      meta: 'External Link',      action: 'preview', actionLabel: 'Preview' },
  { id: 6, title: 'Tailwind CSS Cheat Sheet',      subject: 'Web Applications',   type: 'PDF',          tags: ['WEB APPS', 'PDF'],           description: 'Quick reference for utility classes, configuration, and responsive design.',        meta: 'Oct 08 • 0.8 MB',   action: 'open',    actionLabel: 'Open' },
  // Software Engineering
  { id: 7, title: 'Project Requirements',          subject: 'Software Engineering', type: 'DOC',         tags: ['SW ENG', 'DOC'],             description: 'Technical specifications and deliverables for the final semester project.',         meta: 'Oct 15 • 2.4 MB',   action: 'open',    actionLabel: 'Open' },
  // Operating Systems
  { id: 8, title: 'OS Kernel Deep Dive',           subject: 'Operating Systems',  type: 'RECORDING',    tags: ['OS', 'RECORDING'],           description: 'Detailed lecture on kernel architecture, syscalls, and process scheduling.',        meta: 'Yesterday • 45:20', action: 'open',    actionLabel: 'Open' },
  { id: 9, title: 'Memory Management Notes',       subject: 'Operating Systems',  type: 'NOTES',        tags: ['OS', 'NOTES'],               description: 'Comprehensive notes on paging, segmentation, and virtual memory.',                  meta: 'Oct 11 • 0.9 MB',   action: 'open',    actionLabel: 'Open' },
]

const RECENT_IDS = [1, 4, 8]   // IDs shown in "Recent Resources"

const SUBJECTS_ORDER = ['Database Systems', 'Web Applications', 'Software Engineering', 'Operating Systems']

// ─── Type Config ─────────────────────────────────────────────
const TYPE_CONFIG = {
  PDF:       { Icon: FileText,  iconBg: 'bg-[#ffdad6]', iconColor: 'text-[#ba1a1a]', badgeBg: 'bg-[#ffdad6]', badgeText: 'text-[#ba1a1a]' },
  NOTES:     { Icon: FileText,  iconBg: 'bg-[#eeefff]', iconColor: 'text-[#004ac6]', badgeBg: 'bg-[#eeefff]', badgeText: 'text-[#004ac6]' },
  SLIDES:    { Icon: FileImage, iconBg: 'bg-[#eeefff]', iconColor: 'text-[#004ac6]', badgeBg: 'bg-[#eeefff]', badgeText: 'text-[#004ac6]' },
  RECORDING: { Icon: FileVideo, iconBg: 'bg-[#ffede6]', iconColor: 'text-[#bc4800]', badgeBg: 'bg-[#ffede6]', badgeText: 'text-[#bc4800]' },
  LINK:      { Icon: Link2,     iconBg: 'bg-[#ffede6]', iconColor: 'text-[#bc4800]', badgeBg: 'bg-[#ffede6]', badgeText: 'text-[#bc4800]' },
  DOC:       { Icon: File,      iconBg: 'bg-[#eeefff]', iconColor: 'text-[#004ac6]', badgeBg: 'bg-[#eeefff]', badgeText: 'text-[#004ac6]' },
}

const getTypeConfig = (type) => TYPE_CONFIG[type] ?? TYPE_CONFIG['DOC']

// ─── Tag Chip ────────────────────────────────────────────────
const TagChip = ({ label }) => (
  <span className="text-[9px] font-extrabold tracking-widest uppercase px-1.5 py-0.5 rounded-sm bg-[#eceef0] text-[#434655] border border-[#E2E8F0]">
    {label}
  </span>
)

// ─── Recent Resource Card (horizontal compact) ───────────────
const RecentCard = ({ resource }) => {
  const cfg = getTypeConfig(resource.type)
  const { Icon } = cfg
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-ambient hover:shadow-md transition-shadow p-4 flex flex-col gap-3 flex-1 min-w-[220px] max-w-sm">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center rounded-md shrink-0`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <span className={`text-label-sm font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm ${cfg.badgeBg} ${cfg.badgeText}`}>
          {resource.type}
        </span>
      </div>
      <div>
        <p className="text-label-md font-bold text-on-surface leading-snug truncate">{resource.title}</p>
        <p className="text-[11px] text-[#737686] mt-0.5">{resource.subject}</p>
      </div>
      <p className="text-[11px] text-[#737686] mt-auto">{resource.meta}</p>
    </div>
  )
}

// ─── Full Resource Card ───────────────────────────────────────
const ResourceCard = ({ resource }) => {
  const cfg = getTypeConfig(resource.type)
  const { Icon } = cfg
  const isLink = resource.type === 'LINK'
  const isRecording = resource.type === 'RECORDING'

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-ambient hover:shadow-md transition-shadow p-4 flex flex-col gap-3 font-inter">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className={`w-9 h-9 ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center rounded-md shrink-0`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div className="flex flex-wrap gap-1 justify-end">
          {resource.tags.map(tag => <TagChip key={tag} label={tag} />)}
        </div>
      </div>

      {/* Title + description */}
      <div className="flex flex-col gap-1">
        <h4 className="text-label-md font-bold text-on-surface leading-snug line-clamp-2">{resource.title}</h4>
        <p className="text-[12px] text-[#737686] leading-relaxed line-clamp-3">{resource.description}</p>
      </div>

      {/* Footer: meta + actions */}
      <div className="flex items-center justify-between mt-auto pt-1 border-t border-[#f2f4f6]">
        <span className="text-[11px] text-[#737686] font-medium truncate pr-2">{resource.meta}</span>
        <div className="flex items-center gap-2 shrink-0">
          {!isLink && (
            <button className="text-[#737686] hover:text-primary transition-colors cursor-pointer p-0.5" title="Download">
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
          {isLink ? (
            <button className="flex items-center gap-1 text-label-sm font-bold text-primary hover:text-[#003ea8] transition-colors cursor-pointer">
              <ExternalLink className="w-3.5 h-3.5" />
              Preview
            </button>
          ) : isRecording ? (
            <button className="flex items-center gap-1 text-label-sm font-bold text-primary hover:text-[#003ea8] transition-colors cursor-pointer">
              <Play className="w-3.5 h-3.5 fill-current" />
              Open
            </button>
          ) : (
            <button className="text-label-sm font-bold text-primary hover:text-[#003ea8] transition-colors cursor-pointer">
              Open
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Dropdown ────────────────────────────────────────────────
const Dropdown = ({ label, icon: Icon, options, value, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-md text-label-md font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer shadow-ambient"
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-[#737686]" />}
        {label}
        <ChevronDown className={`w-3 h-3 text-[#737686] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-30 bg-white border border-[#E2E8F0] rounded-lg shadow-lg min-w-[160px] py-1 overflow-hidden">
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

// ─── Upload Modal ────────────────────────────────────────────
const UploadModal = ({ onClose }) => {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)
  const [form, setForm] = useState({ title: '', subject: 'Database Systems', type: 'PDF' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const inputCls = 'w-full px-3 py-2 bg-surface rounded-md border border-[#E2E8F0] text-body-md text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-colors'
  const labelCls = 'text-label-md font-bold text-on-surface-variant'

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-[#E2E8F0] w-full max-w-md overflow-hidden font-inter">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-surface">
          <h2 className="text-headline-md font-bold text-on-surface">Upload Resource</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#E2E8F0] text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false) }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
              dragging ? 'border-primary bg-[#eeefff]' : 'border-[#c3c6d7] hover:border-primary hover:bg-surface'
            }`}
          >
            <div className="w-10 h-10 bg-[#eeefff] text-primary rounded-full flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <p className="text-label-md font-semibold text-on-surface">Drop files here or <span className="text-primary underline">browse</span></p>
            <p className="text-[11px] text-[#737686]">PDF, DOCX, PPTX, MP4, links supported</p>
            <input ref={inputRef} type="file" className="hidden" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Resource Title</label>
            <input placeholder="e.g. SQL Cheat Sheet" value={form.title} onChange={set('title')} className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Subject</label>
              <select value={form.subject} onChange={set('subject')} className={inputCls}>
                {SUBJECTS_ORDER.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Type</label>
              <select value={form.type} onChange={set('type')} className={inputCls}>
                {['PDF', 'NOTES', 'SLIDES', 'RECORDING', 'LINK', 'DOC'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-[#E2E8F0] mt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#E2E8F0] rounded-md text-label-md font-semibold text-on-surface-variant hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
            <button type="button" onClick={onClose} className="px-4 py-2 bg-[#004ac6] hover:bg-[#003ea8] text-white rounded-md text-label-md font-semibold shadow-sm transition-colors cursor-pointer">Upload</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main ResourcesView Component ────────────────────────────
const ResourcesView = () => {
  const [searchQuery, setSearchQuery]   = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [typeFilter, setTypeFilter]     = useState('all')
  const [sortKey, setSortKey]           = useState('recent')
  const [isModalOpen, setIsModalOpen]   = useState(false)

  const SUBJECT_OPTIONS = [
    { value: 'all', label: 'All Subjects' },
    ...SUBJECTS_ORDER.map(s => ({ value: s, label: s })),
  ]
  const TYPE_OPTIONS = [
    { value: 'all',       label: 'All Types' },
    { value: 'PDF',       label: 'PDF' },
    { value: 'NOTES',     label: 'Notes' },
    { value: 'SLIDES',    label: 'Slides' },
    { value: 'RECORDING', label: 'Recording' },
    { value: 'LINK',      label: 'Link' },
    { value: 'DOC',       label: 'Document' },
  ]
  const SORT_OPTIONS = [
    { value: 'recent', label: 'Sort by: Recent' },
    { value: 'name',   label: 'Sort by: Name (A–Z)' },
    { value: 'type',   label: 'Sort by: Type' },
  ]

  const filtered = useMemo(() => {
    let list = [...RESOURCES]
    if (subjectFilter !== 'all') list = list.filter(r => r.subject === subjectFilter)
    if (typeFilter    !== 'all') list = list.filter(r => r.type === typeFilter)
    if (searchQuery.trim())      list = list.filter(r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (sortKey === 'name') list.sort((a, b) => a.title.localeCompare(b.title))
    if (sortKey === 'type') list.sort((a, b) => a.type.localeCompare(b.type))
    return list
  }, [subjectFilter, typeFilter, searchQuery, sortKey])

  const recentResources = RESOURCES.filter(r => RECENT_IDS.includes(r.id))

  // Group filtered resources by subject, preserving SUBJECTS_ORDER
  const grouped = useMemo(() => {
    return SUBJECTS_ORDER
      .map(subject => ({
        subject,
        items: filtered.filter(r => r.subject === subject),
      }))
      .filter(g => g.items.length > 0)
  }, [filtered])

  const isFiltering = subjectFilter !== 'all' || typeFilter !== 'all' || searchQuery.trim()
  const subjectLabel = SUBJECT_OPTIONS.find(o => o.value === subjectFilter)?.label ?? 'Subject'
  const typeLabel    = TYPE_OPTIONS.find(o => o.value === typeFilter)?.label ?? 'Resource Type'
  const sortLabel    = SORT_OPTIONS.find(o => o.value === sortKey)?.label ?? 'Sort by: Recent'

  return (
    <>
      {/* ================================================ */}
      {/* START: Resources Section — inner <main> content  */}
      {/* ================================================ */}
      <div className="w-full flex flex-col gap-8 font-inter pb-16">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <h1 className="text-display text-on-surface">Resources</h1>
            <p className="text-body-md text-[#737686]">Access all your study materials in one place.</p>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            {/* Inline search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#737686]" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-[#E2E8F0] rounded-md text-body-md text-on-surface placeholder:text-[#737686] focus:outline-none focus:border-primary focus:bg-white transition-colors w-44 shadow-ambient"
              />
            </div>
            <Dropdown label={subjectLabel} icon={null} options={SUBJECT_OPTIONS} value={subjectFilter} onChange={setSubjectFilter} />
            <Dropdown label={typeLabel}    icon={null} options={TYPE_OPTIONS}    value={typeFilter}    onChange={setTypeFilter} />
            <Dropdown label={sortLabel}    icon={ArrowUpDown} options={SORT_OPTIONS}   value={sortKey}       onChange={setSortKey} />
          </div>
        </div>

        {/* ── Recent Resources (hidden when actively filtering) ── */}
        {!isFiltering && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#737686]" />
              <h2 className="text-headline-md font-bold text-on-surface">Recent Resources</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {recentResources.map(r => <RecentCard key={r.id} resource={r} />)}
            </div>
          </section>
        )}

        {/* ── Subject Folders ── */}
        {grouped.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-16 text-center flex flex-col items-center gap-3 shadow-ambient">
            <div className="w-12 h-12 bg-[#eeefff] text-primary rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-headline-md font-semibold text-on-surface">No resources found</p>
            <p className="text-body-md text-[#737686]">Try adjusting your filters or upload a new resource.</p>
          </div>
        ) : (
          <section className="flex flex-col gap-10">
            {!isFiltering && (
              <h2 className="text-headline-md font-bold text-on-surface -mb-6">Subject Folders</h2>
            )}

            {grouped.map(({ subject, items }) => (
              <div key={subject} className="flex flex-col gap-4">
                {/* Section header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-body-lg font-bold text-on-surface">{subject}</h3>
                  <button className="text-label-md font-bold text-primary hover:underline cursor-pointer transition-colors">
                    View All
                  </button>
                </div>

                {/* Resource cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map(r => <ResourceCard key={r.id} resource={r} />)}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* ── Floating Action Button ── */}
      <button
        onClick={() => setIsModalOpen(true)}
        title="Upload Resource"
        className="fixed lg:bottom-8 bottom-20 right-8 w-14 h-14 bg-[#004ac6] hover:bg-[#003ea8] active:scale-95 text-white rounded-full shadow-xl flex items-center justify-center transition-all z-30 cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ── Upload Modal ── */}
      {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} />}

      {/* ============================================== */}
      {/* END: Resources Section                         */}
      {/* ============================================== */}
    </>
  )
}

export default ResourcesView
