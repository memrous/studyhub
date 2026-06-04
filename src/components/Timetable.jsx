
const SUBJECT_COLORS = {
  'KMI/DBS': { border: 'border-[#004ac6]', bg: 'bg-[#eeefff]', text: 'text-[#004ac6]' },
  'KMI/WA': { border: 'border-[#bc4800]', bg: 'bg-[#ffede6]', text: 'text-[#bc4800]' },
  'KMI/PROG': { border: 'border-emerald-600', bg: 'bg-[#e6f4ea]', text: 'text-emerald-800' },
  'KMI/OS': { border: 'border-purple-600', bg: 'bg-purple-50', text: 'text-purple-800' },
  'KMI/SE': { border: 'border-red-600', bg: 'bg-[#ffdad6]', text: 'text-red-800' },
  'KMI/NET': { border: 'border-blue-600', bg: 'bg-[#eeefff]', text: 'text-[#004ac6]' }
};

const Timetable = ({ events, subjects }) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sun, 1 = Mon...
  
  // Calculate current week (Monday to Friday)
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  monday.setHours(0,0,0,0);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((name, index) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);
    const dateStr = dayDate.toISOString().split('T')[0];
    
    // Get lectures on this date
    const dayLectures = events
      .filter(e => e.type === 'Lecture' && e.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));

    const isToday = today.toISOString().split('T')[0] === dateStr;

    return {
      name,
      isToday,
      lectures: dayLectures
    };
  });

  return (
    <section className="flex flex-col gap-4 font-inter">
      <div className="flex justify-between items-center">
        <h2 className="text-headline-md text-on-surface font-semibold">Weekly Timetable</h2>
      </div>

      {/* Timetable Grid (5 Columns for Mon-Fri) */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-ambient grid grid-cols-5 gap-4">
        {days.map((day) => (
          <div key={day.name} className="flex flex-col gap-3">
            {/* Day Header Badge */}
            <div className="flex justify-center">
              {day.isToday ? (
                <span className="text-label-sm bg-[#004ac6] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold text-center">
                  {day.name}
                </span>
              ) : (
                <span className="text-label-sm text-[#737686] uppercase tracking-wider text-center block font-semibold">
                  {day.name}
                </span>
              )}
            </div>

            {/* Lecture Cards */}
            <div className="flex flex-col gap-2 min-h-[110px]">
              {day.lectures.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-100 rounded-md flex-1 min-h-[96px] flex items-center justify-center text-[10px] text-slate-400 italic text-center p-1 select-none">
                  No lectures
                </div>
              ) : (
                day.lectures.map(lec => {
                  const subject = subjects.find(s => s.id === lec.subjectId);
                  const subCode = subject ? subject.code : 'GEN 101';
                  const subName = subject ? subject.name : lec.title;
                  const colorConfig = SUBJECT_COLORS[subCode] || { border: 'border-slate-300', bg: 'bg-slate-50', text: 'text-slate-700' };
                  
                  // Extract start hour, e.g. "10:00 – 11:30" -> "10:00"
                  const startHour = lec.time.split(' – ')[0];

                  return (
                    <div 
                      key={lec.id}
                      title={`${subName} (${lec.time})`}
                      className={`${colorConfig.bg} border-l-4 ${colorConfig.border} px-3 py-2 rounded-r-md flex flex-col justify-center min-h-[48px] shadow-sm`}
                    >
                      <span className={`text-[11px] font-bold ${colorConfig.text}`}>
                        {subCode.split('/')[1] || subCode}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        {startHour}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Timetable
