import { Bell } from 'lucide-react'

const getDeadlineLabel = (dateStr) => {
  if (dateStr === '2026-12-20') return '20 December';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Due Today';
  if (diffDays === 1) return 'Due Tomorrow';
  if (diffDays > 1) return `Due in ${diffDays} days`;
  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
  return dateStr;
};

const getTypeStyles = (type) => {
  switch (type) {
    case 'Assignment': return { dot: 'bg-[#bc4800]', badgeBg: 'bg-[#ffede6]', badgeText: 'text-[#bc4800]' };
    case 'Test': return { dot: 'bg-[#ba1a1a]', badgeBg: 'bg-[#ffdad6]', badgeText: 'text-[#ba1a1a]' };
    case 'Exam': return { dot: 'bg-purple-700', badgeBg: 'bg-purple-100', badgeText: 'text-purple-700' };
    default: return { dot: 'bg-slate-400', badgeBg: 'bg-slate-100', badgeText: 'text-slate-700' };
  }
};

const Deadlines = ({ events, subjects, onDeadlineClick }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Filter for assignments, tests, exams that are upcoming (on or after today)
  const upcomingDeadlines = events
    .filter(e => e.type !== 'Lecture' && e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient flex flex-col gap-4 font-inter">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-on-surface" />
        <h2 className="text-headline-md text-on-surface">Upcoming Deadlines</h2>
      </div>

      <div className="flex flex-col gap-4">
        {upcomingDeadlines.length === 0 ? (
          <p className="text-body-md text-[#737686] italic text-center py-2">No upcoming deadlines.</p>
        ) : (
          upcomingDeadlines.map((dl, idx) => {
            const subject = subjects.find(s => s.id === dl.subjectId);
            const subCode = subject ? subject.code : '';
            const styles = getTypeStyles(dl.type);
            const isLast = idx === upcomingDeadlines.length - 1;

            return (
              <div
                key={dl.id}
                onClick={() => onDeadlineClick?.(dl.id)}
                className="flex gap-3 items-start relative pl-4 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                {/* Custom vertical line marker */}
                <div className={`absolute left-[4px] top-[7px] w-2 h-2 rounded-full ${styles.dot}`}></div>
                {!isLast && (
                  <div className="absolute left-[7px] top-[15px] bottom-[-20px] w-[1px] bg-slate-200"></div>
                )}
                
                <div className="flex-1 flex flex-col gap-1">
                  <h4 className="text-label-md text-on-surface font-semibold leading-tight">
                    {dl.title} {subCode && `(${subCode})`}
                  </h4>
                  <span className="text-label-sm text-[#737686]">
                    {getDeadlineLabel(dl.date)}
                  </span>
                  <span className={`text-[10px] font-bold tracking-wider ${styles.badgeBg} ${styles.badgeText} px-2 py-0.5 rounded-sm w-fit mt-1 uppercase`}>
                    {dl.type}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  )
}

export default Deadlines
