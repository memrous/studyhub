import React, { useState, useMemo } from 'react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';

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

const Timetable = ({ events, subjects, onOpenSubject }) => {
  // Definujeme výchozí datum (červen 2026 podle tvých mock dat)
  const DEFAULT_DATE = useMemo(() => new Date(2026, 5, 7), []);
  const today = new Date(); 

  const [currentDate, setCurrentDate] = useState(DEFAULT_DATE);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState(null);

  const currentDay = currentDate.getDay();
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  monday.setHours(0, 0, 0, 0);

  // Výpočet referenčního (výchozího) pondělí pro kontrolu limitů zámku
  const defaultMonday = useMemo(() => {
    const dMon = new Date(DEFAULT_DATE);
    const dDay = DEFAULT_DATE.getDay();
    dMon.setDate(DEFAULT_DATE.getDate() - (dDay === 0 ? 6 : dDay - 1));
    dMon.setHours(0, 0, 0, 0);
    return dMon;
  }, [DEFAULT_DATE]);

  // Výpočet časového rozdílu v týdnech oproti výchozímu týdnu
  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksDiff = Math.round((monday.getTime() - defaultMonday.getTime()) / msInWeek);

  // Podmínky pro zamknutí šipek (povolený rozsah: -1, 0, +1 týden)
  const isPrevDisabled = weeksDiff <= -1;
  const isNextDisabled = weeksDiff >= 1;

  const handlePrevWeek = () => {
    if (isPrevDisabled) return;
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    if (isNextDisabled) return;
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    // Vrátí kalendář zpět do výchozího testovacího týdnu (nebo na reálný dnešek, pokud bys změnil DEFAULT_DATE)
    setCurrentDate(DEFAULT_DATE);
  };

  const formattedDateRange = monday.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const formatDateKey = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((name, index) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);
    const dateStr = formatDateKey(dayDate);
    
    const dayLectures = (events || [])
      .filter(e => (e.type === 'Lecture' || e.type === 'Lab') && e.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));

    const isToday = formatDateKey(today) === dateStr;

    return {
      name,
      isToday,
      lectures: dayLectures
    };
  });

  return (
    <section className="flex flex-col gap-4 font-inter text-on-surface">
      {/* Záhlaví s ovládáním */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h2 className="text-headline-md text-on-surface font-semibold">Weekly Timetable</h2>
          <span className="text-sm text-slate-500 capitalize">{formattedDateRange}</span>
        </div>
        
        <div className="flex items-center gap-2 bg-[#F2F4F6] p-1 rounded-lg border border-[#E2E8F0]">
          <button 
            onClick={handlePrevWeek}
            disabled={isPrevDisabled}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-all shadow-sm ${
              isPrevDisabled 
                ? 'opacity-40 text-slate-400 bg-transparent' 
                : 'hover:bg-white text-slate-600 hover:text-slate-900 cursor-pointer'
            }`}
          >
            ← Prev
          </button>
          <button 
            onClick={handleToday}
            className="px-2 py-1 text-xs font-bold rounded-md bg-white text-[#004ac6] border border-[#E2E8F0] shadow-sm cursor-pointer"
          >
            Current
          </button>
          <button 
            onClick={handleNextWeek}
            disabled={isNextDisabled}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-all shadow-sm ${
              isNextDisabled 
                ? 'opacity-40 text-slate-400 bg-transparent' 
                : 'hover:bg-white text-slate-600 hover:text-slate-900 cursor-pointer'
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Mřížka kalendáře */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-ambient grid grid-cols-5 gap-4">
        {days.map((day) => (
          <div key={day.name} className="flex flex-col gap-3">
            {/* Day Header */}
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

            {/* Karetky s výukou */}
            <div className="flex flex-col gap-2 min-h-[110px]">
              {day.lectures.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-100 rounded-md flex-1 min-h-[96px] flex items-center justify-center text-[10px] text-slate-400 italic text-center p-1 select-none">
                  No classes
                </div>
              ) : (
                day.lectures.map(lec => {
                  const subject = (subjects || []).find(s => s.id === lec.subjectId);
                  const subCode = subject ? subject.code : 'GEN 101';
                  const subName = subject ? subject.name : lec.title;
                  
                  const colorConfig = TYPE_COLOR_MAP[lec.type] || TYPE_COLOR_MAP['default'];
                  const startHour = lec.time.split(/[–-]/)[0].trim();

                  return (
                    <div 
                      key={lec.id}
                      onClick={() => setSelectedDetailEvent({ ...lec, subject: subName, code: subCode })}
                      title={`${subName} (${lec.time})`}
                      className={`${colorConfig.bg} border-l-4 ${colorConfig.border} px-3 py-2 rounded-r-md flex flex-col justify-center min-h-[48px] shadow-sm hover:brightness-95 transition-all cursor-pointer`}
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

      {/* POP-UP MODAL: DETAIL UDÁLOSTI */}
      {selectedDetailEvent && (() => {
        const targetSubject = (subjects || []).find(s => s.id === selectedDetailEvent.subjectId);
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
                    {selectedDetailEvent.title}
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

export default Timetable;