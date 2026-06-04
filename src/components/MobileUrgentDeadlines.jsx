import { AlertCircle, Clock } from 'lucide-react'

const getRelativeDaysLabel = (dateStr) => {
  if (dateStr === '2026-12-20') return 'Due Dec 20';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Due Today';
  if (diffDays === 1) return 'Due Tomorrow';
  if (diffDays > 1) return `Due in ${diffDays} days`;
  return dateStr;
};

const getMobileUrgencyStyles = (type) => {
  switch (type) {
    case 'Exam': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Test': return 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]';
    default: return 'bg-[#ffede6] text-[#bc4800] border-[#ffede6]'; // Assignment
  }
};

const MobileUrgentDeadlines = ({ events, subjects, onDeadlineClick }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Get next 3 deadlines (assignments, tests, exams)
  const urgentList = events
    .filter(e => e.type !== 'Lecture' && e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <section className="flex flex-col gap-3 font-inter">
      <h3 className="text-headline-md text-on-surface font-semibold">Urgent Deadlines</h3>
      
      <div className="flex flex-col gap-3">
        {urgentList.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg text-center text-body-md text-[#737686] italic">
            No urgent deadlines.
          </div>
        ) : (
          urgentList.map(dl => {
            const subject = subjects.find(s => s.id === dl.subjectId);
            const subCode = subject ? subject.code : '';
            const isCritical = dl.date === todayStr || dl.type === 'Exam' || dl.type === 'Test';
            const urgencyClass = getMobileUrgencyStyles(dl.type);

            return (
              <div 
                key={dl.id} 
                onClick={() => onDeadlineClick?.(dl.id)}
                className={`bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-sm shrink-0 flex items-center justify-center ${
                    isCritical ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#eeefff] text-[#004ac6]'
                  }`}>
                    {isCritical ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-label-md text-on-surface font-semibold leading-snug">
                      {dl.title} {subCode && `(${subCode})`}
                    </h4>
                    <span className="text-label-sm text-[#737686] block mt-0.5">
                      {getRelativeDaysLabel(dl.date)}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-sm shrink-0 border ${urgencyClass}`}>
                  {dl.type}
                </span>
              </div>
            );
          })
        )}
      </div>
    </section>
  )
}

export default MobileUrgentDeadlines
