import { Folder, FileText, ExternalLink } from 'lucide-react'

const getResourceTypeStyles = (type) => {
  switch (type) {
    case 'PDF': return { bg: 'bg-red-50 text-red-600', label: 'PDF' };
    case 'SLIDES': return { bg: 'bg-blue-50 text-blue-600', label: 'Slides' };
    case 'LINK': return { bg: 'bg-emerald-50 text-emerald-600', label: 'URL' };
    case 'NOTES': return { bg: 'bg-indigo-50 text-indigo-600', label: 'Notes' };
    default: return { bg: 'bg-slate-50 text-slate-600', label: 'Doc' };
  }
};

const RecentMaterials = ({ resources, subjects }) => {
  // Sort resources by uploadDate descending and show top 3
  const recentList = [...resources]
    .sort((a, b) => b.uploadDate.localeCompare(a.uploadDate))
    .slice(0, 3);

  return (
    <div className="bg-white border border-[#E2E8F0] p-5 rounded-lg shadow-ambient flex flex-col gap-4 relative font-inter">
      <div className="flex items-center gap-2">
        <Folder className="w-5 h-5 text-on-surface" />
        <h2 className="text-headline-md text-on-surface font-semibold">Recent Materials</h2>
      </div>

      <div className="flex flex-col gap-3">
        {recentList.length === 0 ? (
          <p className="text-body-md text-[#737686] italic text-center py-2">No resources available.</p>
        ) : (
          recentList.map(res => {
            const subject = subjects.find(s => s.id === res.subjectId);
            const subName = subject ? subject.name : '';
            const styles = getResourceTypeStyles(res.type);
            const isExternal = res.type === 'LINK';

            return (
              <a 
                key={res.id} 
                href={res.url} 
                target={isExternal ? '_blank' : '_self'}
                rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-surface rounded-md border border-[#E2E8F0] hover:bg-surface-container transition-colors cursor-pointer"
              >
                <div className={`w-9 h-9 ${styles.bg} flex items-center justify-center rounded-md shrink-0`}>
                  {isExternal ? <ExternalLink className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-label-md text-on-surface font-semibold truncate" title={res.title}>
                    {res.title}
                  </h4>
                  <span className="text-label-sm text-[#737686]">
                    {res.size || 'Attachment'} • {styles.label} {subName && `• ${subName}`}
                  </span>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  )
}

export default RecentMaterials
