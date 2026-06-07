import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';

// Barevná mapa pro styly uvnitř pop-up okna
const TYPE_COLOR_MAP = {
  'Lecture': { border: 'border-[#004ac6]', bg: 'bg-[#eeefff]', text: 'text-[#004ac6]' },
  'Lab': { border: 'border-[#004ac6]', bg: 'bg-[#eeefff]', text: 'text-[#004ac6]' },
  'Assignment': { border: 'border-[#117a3a]', bg: 'bg-[#e6f4ea]', text: 'text-[#117a3a]' },
  'Test': { border: 'border-[#bc4800]', bg: 'bg-[#ffede6]', text: 'text-[#bc4800]' },
  'Quiz': { border: 'border-[#bc4800]', bg: 'bg-[#ffede6]', text: 'text-[#bc4800]' },
  'Exam': { border: 'border-[#ba1a1a]', bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]' },
  'Deadline': { border: 'border-[#ba1a1a]', bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]' },
  'default': { border: 'border-[#737686]', bg: 'bg-[#eceef0]', text: 'text-[#737686]' }
};

const MobileTodaySchedule = ({ events, subjects, onOpenSubject }) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // Tvoje původní řádka
  
  // Format today's date, e.g. "Wed, Oct 25"
  const formattedToday = today.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  // State pro otevřené pop-up okno
  const [selectedDetailEvent, setSelectedDetailEvent] = useState(null);

  const todayLectures = events
    .filter(e => e.type === 'Lecture' && e.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <section className="flex flex-col gap-3 font-inter">
      <div className="flex justify-between items-center">
        <h3 className="text-headline-md text-on-surface font-semibold">Today's Schedule</h3>
        <span className="text-label-md text-[#004ac6] font-bold">{formattedToday}</span>
      </div>

      <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient flex flex-col gap-4">
        {todayLectures.length === 0 ? (
          <p className="text-body-md text-[#737686] italic text-center py-2">
            No classes scheduled for today.
          </p>
        ) : (
          todayLectures.map(lec => {
            const subject = subjects.find(s => s.id === lec.subjectId);
            const subCode = subject ? subject.code : 'GEN 101';
            const subName = subject ? subject.name : lec.title;
            const subLecturer = subject ? subject.lecturer : '';
            const roomInfo = subject ? (subject.code === 'KMI/DBS' ? 'Room 201' : 'Room 105') : 'Main Hall';

            return (
              <div 
                key={lec.id} 
                onClick={() => setSelectedDetailEvent({ ...lec, subject: subName, code: subCode })}
                className="flex items-center lg:items-start gap-4 relative pl-4 cursor-pointer hover:bg-slate-50/80 p-1.5 -mx-1.5 rounded-md transition-colors group"
              >
                {/* Custom Vertical timeline line */}
                <div className="absolute left-0 lg:top-1.5 w-1 h-8 lg:h-14 bg-[#2563eb] rounded-full group-hover:scale-y-105 transition-transform"></div>
                <span className="text-label-sm font-semibold text-on-surface shrink-0 lg:w-20 pt-0.5 ml-0.5">
                  {lec.time.split(' – ')[0] || lec.time}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-label-md text-on-surface font-bold leading-tight truncate group-hover:text-[#004ac6] transition-colors">
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

      {/* POP-UP MODAL: DETAIL UDÁLOSTI */}
      {selectedDetailEvent && (() => {
        const targetSubject = subjects.find(s => s.id === selectedDetailEvent.subjectId);
        const styleObj = TYPE_COLOR_MAP[selectedDetailEvent.type] || TYPE_COLOR_MAP['default'];
        
        return (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
            <div className="bg-white rounded-lg shadow-2xl border border-[#E2E8F0] w-full max-w-md overflow-hidden relative font-inter animate-in fade-in zoom-in-95 duration-150 text-left">
              
              <div className={`px-6 py-4 border-b border-[#E2E8F0] ${styleObj.bg} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-sm bg-white border border-black/5 ${styleObj.text}`}>
                    {selectedDetailEvent.code}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-sm bg-white/60 ${styleObj.text}`}>
                    {selectedDetailEvent.type}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedDetailEvent(null)}
                  className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer rounded-full hover:bg-black/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4.5">
                <div>
                  <h3 className="text-headline-md font-bold text-on-surface leading-tight">
                    {selectedDetailEvent.title || selectedDetailEvent.subject}
                  </h3>
                  <p className="text-body-md font-semibold text-primary mt-1">
                    {targetSubject ? targetSubject.name : 'Unknown Subject'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-[#F2F4F6] p-3 rounded-lg border border-[#E2E8F0]">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <CalendarIcon className="w-4 h-4 text-[#737686] shrink-0" />
                    <span className="text-label-md font-medium text-on-surface">
                      {new Date(selectedDetailEvent.date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Clock className="w-4 h-4 text-[#737686] shrink-0" />
                    <span className="text-label-md font-medium text-on-surface">
                      {selectedDetailEvent.time}
                    </span>
                  </div>
                </div>

                {targetSubject && (
                  <div className="flex flex-col gap-2.5 border-t border-[#E2E8F0] pt-4">
                    <div className="flex justify-between items-center text-body-md">
                      <span className="text-[#737686] font-medium">Lecturer:</span>
                      <span className="font-bold text-on-surface">{targetSubject.lecturer || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between items-center text-body-md">
                      <span className="text-[#737686] font-medium">Credits / Completion:</span>
                      <span className="font-semibold text-on-surface">
                        {targetSubject.credits} STAG Credits ({targetSubject.completionType})
                      </span>
                    </div>
                    {targetSubject.description && (
                      <div className="flex flex-col gap-1 mt-1 bg-slate-50 p-2.5 rounded border border-slate-100">
                        <span className="text-[11px] text-[#737686] font-bold uppercase tracking-wider">Subject Description:</span>
                        <p className="text-label-sm text-on-surface-variant leading-relaxed line-clamp-3">
                          {targetSubject.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => {
                      if (targetSubject && onOpenSubject) {
                        onOpenSubject(targetSubject.id);
                      }
                      setSelectedDetailEvent(null);
                    }}
                    className="w-full bg-[#004ac6] hover:bg-[#003ea8] text-white py-2 rounded-md font-semibold text-label-md transition-colors shadow-sm cursor-pointer text-center"
                  >
                    Open Subject Hub
                  </button>
                </div>

              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};

export default MobileTodaySchedule;