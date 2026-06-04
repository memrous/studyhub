import { FileText, ExternalLink, Download } from 'lucide-react'

const getMobileResourceTypeStyles = (type) => {
  switch (type) {
    case 'PDF': return { bg: 'bg-red-50 text-red-600', label: 'PDF' };
    case 'SLIDES': return { bg: 'bg-blue-50 text-blue-600', label: 'Slides' };
    case 'LINK': return { bg: 'bg-emerald-50 text-emerald-600', label: 'URL' };
    case 'NOTES': return { bg: 'bg-indigo-50 text-indigo-600', label: 'Notes' };
    default: return { bg: 'bg-slate-50 text-slate-600', label: 'Doc' };
  }
};

const MobileRecentMaterials = ({ resources, subjects }) => {
  // Sort resources by uploadDate descending and show top 2
  const recentList = [...resources]
    .sort((a, b) => b.uploadDate.localeCompare(a.uploadDate))
    .slice(0, 2);

  return (
    <section className="flex flex-col gap-3 font-inter">
      <h3 className="text-headline-md text-on-surface font-semibold">Recent Materials</h3>
      
      <div className="flex flex-col gap-3">
        {recentList.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-lg text-center text-body-md text-[#737686] italic">
            No resources available.
          </div>
        ) : (
          recentList.map(res => {
            const subject = subjects.find(s => s.id === res.subjectId);
            const subCode = subject ? subject.code : '';
            const styles = getMobileResourceTypeStyles(res.type);
            const isExternal = res.type === 'LINK';

            return (
              <div 
                key={res.id} 
                className="bg-white border border-[#E2E8F0] p-4 rounded-lg shadow-ambient flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 ${styles.bg} flex items-center justify-center rounded-md shrink-0`}>
                    {isExternal ? <ExternalLink className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-label-md text-on-surface font-semibold truncate" title={res.title}>
                      {res.title}
                    </h4>
                    <span className="text-label-sm text-[#737686] block mt-0.5 truncate">
                      {subCode} • {styles.label}
                    </span>
                  </div>
                </div>
                
                <a 
                  href={res.url}
                  target={isExternal ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="p-2 border border-[#E2E8F0] hover:bg-surface-container rounded-sm text-[#737686] hover:text-on-surface shrink-0 transition-colors cursor-pointer ml-2"
                >
                  {isExternal ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                </a>
              </div>
            );
          })
        )}
      </div>
    </section>
  )
}

export default MobileRecentMaterials
