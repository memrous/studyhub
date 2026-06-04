
const MobileTodaySchedule = ({ events, subjects }) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Format today's date, e.g. "Wed, Oct 25"
  const formattedToday = today.toLocaleDateString('default', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  const todayLectures = events
    .filter(e => e.type === 'Lecture' && e.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <section className="flex flex-col gap-3 font-inter">
      <div className="flex justify-between items-center">
        <h3 className="text-headline-md text-on-surface font-semibold">Today's Schedule</h3>
        <span className="text-label-sm text-[#004ac6] font-bold">{formattedToday}</span>
      </div>

      <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient flex flex-col gap-4">
        {todayLectures.length === 0 ? (
          <p className="text-body-md text-[#737686] italic text-center py-2">
            No classes scheduled for today.
          </p>
        ) : (
          todayLectures.map(lec => {
            const subject = subjects.find(s => s.id === lec.subjectId);
            const subName = subject ? subject.name : lec.title;
            const subLecturer = subject ? subject.lecturer : '';
            const roomInfo = subject ? (subject.code === 'KMI/DBS' ? 'Room 201' : 'Room 105') : 'Main Hall';

            return (
              <div key={lec.id} className="flex items-start gap-4 relative pl-3">
                {/* Custom Vertical timeline line */}
                <div className="absolute left-0 top-1.5 w-1 h-14 bg-[#2563eb] rounded-full"></div>
                <span className="text-label-sm font-semibold text-on-surface shrink-0 w-20 pt-0.5">
                  {lec.time.split(' – ')[0] || lec.time}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-label-md text-on-surface font-bold leading-tight truncate">
                    {subName}
                  </h4>
                  <span className="text-label-sm text-[#737686] mt-0.5 block truncate">
                    {roomInfo} • {subLecturer}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  )
}

export default MobileTodaySchedule
