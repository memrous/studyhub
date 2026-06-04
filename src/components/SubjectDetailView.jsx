// ============================================================
// START: SubjectDetailView.jsx — Subject Detail Page
// Integrates into <main> via App.jsx activeTab === 'subject-detail'
// Props: subject (object), onBack (function to return to subjects list)
// If no subject prop is passed, falls back to MOCK_SUBJECT
// ============================================================
import React, { useState } from 'react'
import {
  ArrowLeft,
  User,
  BookOpen,
  ShieldCheck,
  Play,
  Download,
  MoreVertical,
  FileText,
  Code2,
  CheckCircle2,
  Circle,
  CalendarDays,
  ClipboardList,
  CheckCheck,
  Minus,
  ChevronRight,
  Info,
  Clock,
  BarChart2,
  Settings,
} from 'lucide-react'

// ─── Mock Data (used as fallback when no subject prop is provided) ───
export const MOCK_SUBJECT = {
  code: 'CS 302',
  semester: 5,
  title: 'Database Systems',
  instructor: 'Dr. Emily Carter',
  credits: 6,
  type: 'Mandatory',
  color: 'blue',
  description:
    'Exploration of relational databases, SQL optimization, and data modeling. This course covers the fundamental concepts required to design and implement efficient, scalable data storage solutions. Key topics include normalization, transaction management, and noSQL alternatives.',
  learningHours: 120,
  difficulty: 'Intermediate',
  progress: 65,
  modules: [
    { id: 1, title: 'Module 1: Relational Model',   completed: true },
    { id: 2, title: 'Module 2: SQL Advanced',        completed: true },
    { id: 3, title: 'Module 3: Indexing & Tuning',   completed: false },
  ],
  lectures: [
    {
      id: 1,
      title: 'Introduction to SQL',
      module: 'Module 1',
      date: 'Oct 5, 2023',
      attachments: [
        { name: 'Intro_to_SQL.pdf',  type: 'pdf' },
        { name: 'exercise_1.sql',    type: 'code' },
      ],
    },
    {
      id: 2,
      title: 'Normalization Forms',
      module: 'Module 2',
      date: 'Oct 12, 2023',
      attachments: [
        { name: 'Normalization_Rules.pdf', type: 'pdf' },
      ],
    },
    {
      id: 3,
      title: 'Indexing Strategies',
      module: 'Module 3',
      date: 'Oct 20, 2023',
      attachments: [
        { name: 'Indexing_Slides.pdf', type: 'pdf' },
      ],
    },
  ],
  deadlines: [
    {
      id: 1,
      urgency: 'IN 3 DAYS',
      urgentColor: 'text-primary',
      title: 'Final Project Proposal',
      desc: 'Submit schema draft via LMS',
    },
    {
      id: 2,
      urgency: 'MAY 14',
      urgentColor: 'text-[#737686]',
      title: 'Midterm Exam',
      desc: 'Covers Modules 1-4 • Hall B',
    },
  ],
  assignments: [
    { id: 1, title: 'Project 1: Schema Design',      status: 'graded',      grade: '100/100' },
    { id: 2, title: 'Project 2: Query Optimization',  status: 'in-progress', grade: null },
  ],
}

// ─── Tabs definition ─────────────────────────────────────────
const TABS = ['Overview', 'Lectures', 'Assignments', 'Tests & Exams', 'Materials', 'Grades']

// ─── Attachment chip ─────────────────────────────────────────
const AttachmentChip = ({ attachment }) => {
  const isPdf  = attachment.type === 'pdf'
  const isCode = attachment.type === 'code'
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-sm border ${
      isPdf  ? 'bg-[#ffdad6]/50 text-[#ba1a1a] border-[#ffdad6]' :
      isCode ? 'bg-[#eeefff]/60 text-[#004ac6] border-[#dbe1ff]' :
               'bg-[#eceef0]   text-[#434655] border-[#E2E8F0]'
    }`}>
      {isPdf  && <FileText className="w-3 h-3" />}
      {isCode && <Code2    className="w-3 h-3" />}
      {!isPdf && !isCode && <FileText className="w-3 h-3" />}
      {attachment.name}
    </span>
  )
}

// ─── Lecture row ─────────────────────────────────────────────
const LectureRow = ({ lecture }) => (
  <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-ambient p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Play button */}
        <div className="w-9 h-9 bg-[#eeefff] text-primary flex items-center justify-center rounded-md shrink-0">
          <Play className="w-4 h-4 fill-current" />
        </div>
        <div className="min-w-0">
          <p className="text-label-md font-bold text-on-surface leading-tight">{lecture.title}</p>
          <p className="text-[11px] text-[#737686] mt-0.5">{lecture.module} • {lecture.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button className="text-[#737686] hover:text-on-surface transition-colors cursor-pointer p-1" title="Download">
          <Download className="w-4 h-4" />
        </button>
        <button className="text-[#737686] hover:text-on-surface transition-colors cursor-pointer p-1">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
    {/* Attachments */}
    {lecture.attachments.length > 0 && (
      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#f2f4f6]">
        {lecture.attachments.map(a => <AttachmentChip key={a.name} attachment={a} />)}
      </div>
    )}
  </div>
)

// ─── Overview Tab Content ─────────────────────────────────────
const OverviewTab = ({ subject }) => (
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

    {/* ── Left column ── */}
    <div className="flex flex-col gap-6">

      {/* Subject Description Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-ambient p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <h3 className="text-label-md font-bold text-on-surface">Subject Description</h3>
        </div>
        <p className="text-body-md text-[#434655] leading-relaxed">{subject.description}</p>
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#F2F4F6] border border-[#E2E8F0] rounded-md p-4">
            <p className="text-label-sm text-[#737686] uppercase tracking-wider font-bold mb-1">Learning Hours</p>
            <p className="text-headline-md font-bold text-on-surface">{subject.learningHours} Total</p>
          </div>
          <div className="bg-[#F2F4F6] border border-[#E2E8F0] rounded-md p-4">
            <p className="text-label-sm text-[#737686] uppercase tracking-wider font-bold mb-1">Difficulty Level</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-headline-md font-bold text-on-surface">{subject.difficulty}</p>
              <div className="flex gap-0.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="w-2 h-2 rounded-full bg-[#E0E3E5]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Lectures */}
      <div className="flex flex-col gap-4">
        <h3 className="text-headline-md font-bold text-on-surface">Recent Lectures</h3>
        <div className="flex flex-col gap-3">
          {subject.lectures.slice(0, 2).map(lecture => (
            <LectureRow key={lecture.id} lecture={lecture} />
          ))}
        </div>
      </div>
    </div>

    {/* ── Right column ── */}
    <div className="flex flex-col gap-5">

      {/* Course Progress */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-ambient p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-label-md font-bold text-on-surface">Course Progress</h3>
          <span className="text-label-md font-extrabold text-primary">{subject.progress}%</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-[#E0E3E5] rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${subject.progress}%` }}
          />
        </div>
        {/* Modules checklist */}
        <div className="flex flex-col gap-2.5 mt-1">
          {subject.modules.map(mod => (
            <div key={mod.id} className="flex items-center gap-2.5">
              {mod.completed
                ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                : <Circle       className="w-4 h-4 text-[#c3c6d7] shrink-0" />
              }
              <span className={`text-body-md leading-tight ${mod.completed ? 'text-on-surface font-medium' : 'text-[#737686]'}`}>
                {mod.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-ambient p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[#bc4800]" />
          <h3 className="text-label-md font-bold text-on-surface">Upcoming Deadlines</h3>
        </div>
        <div className="flex flex-col gap-4">
          {subject.deadlines.map((dl, idx) => (
            <div key={dl.id} className="flex flex-col gap-3">
              {/* Timeline dot + line */}
              <div className="flex flex-col items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                {idx < subject.deadlines.length - 1 && (
                  <div className="w-px h-6 bg-[#E2E8F0]" />
                )}
              </div>
              <div className="pb-2">
                <p className={`text-label-sm font-extrabold uppercase tracking-wider ${dl.urgentColor}`}>
                  {dl.urgency}
                </p>
                <p className="text-label-md font-bold text-on-surface mt-0.5">{dl.title}</p>
                <p className="text-[11px] text-[#737686] mt-0.5">{dl.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Assignments */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-ambient p-5 flex flex-col gap-4">
        <h3 className="text-label-md font-bold text-on-surface">Current Assignments</h3>
        <div className="flex flex-col gap-2">
          {subject.assignments.map(asgn => (
            <div key={asgn.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F2F4F6] border border-[#E2E8F0] rounded-md px-3 py-3">
              <div className="min-w-0">
                <p className="text-label-md font-bold text-on-surface leading-tight">{asgn.title}</p>
                {asgn.status === 'graded' ? (
                  <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider mt-0.5">
                    Graded: {asgn.grade}
                  </p>
                ) : (
                  <p className="text-[10px] font-extrabold text-[#bc4800] uppercase tracking-wider mt-0.5">
                    Status: In Progress
                  </p>
                )}
              </div>
              {asgn.status === 'graded'
                ? <CheckCheck className="w-4 h-4 text-primary shrink-0" />
                : <Minus      className="w-4 h-4 text-[#bc4800] shrink-0" />
              }
            </div>
          ))}
        </div>
        <button className="w-full sm:w-auto border border-[#E2E8F0] rounded-md py-2 text-label-md font-bold text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
          VIEW ALL ASSIGNMENTS
        </button>
      </div>

    </div>
  </div>
)

// ─── Lectures Tab Content ────────────────────────────────────
const LecturesTab = ({ subject }) => (
  <div className="flex flex-col gap-4 max-w-3xl">
    <p className="text-body-md text-[#737686]">{subject.lectures.length} lectures in this course</p>
    {subject.lectures.map(lecture => (
      <LectureRow key={lecture.id} lecture={lecture} />
    ))}
  </div>
)

// ─── Generic Placeholder Tab ─────────────────────────────────
const PlaceholderTab = ({ label }) => (
  <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-ambient p-16 flex flex-col items-center gap-3 text-center max-w-lg">
    <div className="w-12 h-12 bg-[#eeefff] text-primary rounded-full flex items-center justify-center">
      <BarChart2 className="w-6 h-6" />
    </div>
    <p className="text-headline-md font-semibold text-on-surface">{label}</p>
    <p className="text-body-md text-[#737686]">This section is coming soon.</p>
  </div>
)

// ─── Main SubjectDetailView Component ───────────────────────
const SubjectDetailView = ({ subject: subjectProp, onBack }) => {
  const subject = subjectProp ?? MOCK_SUBJECT
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <>
      {/* ================================================ */}
      {/* START: Subject Detail — inner <main> content     */}
      {/* ================================================ */}
      <div className="w-full flex flex-col gap-0 font-inter pb-16">

        {/* ── Back button ── */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-label-md font-semibold text-[#737686] hover:text-on-surface transition-colors cursor-pointer mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Subjects
          </button>
        )}

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
          <div className="flex flex-col gap-2">
            {/* Code badge + semester */}
            <div className="flex items-center gap-3">
              <span className="text-label-sm font-extrabold uppercase px-2.5 py-1 rounded-sm bg-[#eeefff] text-primary">
                {subject.code}
              </span>
              <span className="text-body-md text-[#737686] font-medium">Semester {subject.semester}</span>
            </div>
            {/* Title */}
            <h1 className="text-display text-on-surface">{subject.title}</h1>
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-body-md text-[#737686]">
              <span className="flex items-center gap-1.5">
                <User         className="w-3.5 h-3.5 shrink-0" /> {subject.instructor}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen     className="w-3.5 h-3.5 shrink-0" /> {subject.credits} Credits
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck  className="w-3.5 h-3.5 shrink-0" /> {subject.type}
              </span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#004ac6] hover:bg-[#003ea8] active:scale-[0.98] text-white rounded-md text-label-md font-semibold shadow-sm transition-all cursor-pointer">
              <Play className="w-4 h-4 fill-current" />
              Resume Learning
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] hover:bg-surface-container text-on-surface rounded-md text-label-md font-semibold shadow-ambient transition-colors cursor-pointer">
              <Settings className="w-4 h-4" />
              Course Settings
            </button>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="border-b border-[#E2E8F0] mb-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-0 min-w-max">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-label-md font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-[#737686] hover:text-on-surface hover:border-[#c3c6d7]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        {activeTab === 'Overview'      && <OverviewTab  subject={subject} />}
        {activeTab === 'Lectures'      && <LecturesTab  subject={subject} />}
        {activeTab === 'Assignments'   && <PlaceholderTab label="Assignments" />}
        {activeTab === 'Tests & Exams' && <PlaceholderTab label="Tests & Exams" />}
        {activeTab === 'Materials'     && <PlaceholderTab label="Materials" />}
        {activeTab === 'Grades'        && <PlaceholderTab label="Grades" />}

      </div>
      {/* ============================================ */}
      {/* END: Subject Detail Section                  */}
      {/* ============================================ */}
    </>
  )
}

export default SubjectDetailView
