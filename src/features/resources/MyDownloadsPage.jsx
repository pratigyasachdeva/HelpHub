import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Download } from 'lucide-react';
import { db } from '../../firebase/config';
import { useAuth } from '../authentication/AuthContext';
import { formatTimestamp } from '../../utils/pricingAndDates';

export default function MyDownloadsPage() {
  const { userProfile } = useAuth();
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    if (!userProfile?.uid) return;
    const q = query(collection(db, 'downloads'), where('userId', '==', userProfile.uid));
    return onSnapshot(q, (snap) => {
      setDownloads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [userProfile?.uid]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Downloaded PDFs</h1>
        <p className="text-sm text-slate-600">Verified downloads eligible for rating and helpfulness feedback.</p>
      </div>

      {downloads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          No PDFs downloaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {downloads.map((dl) => (
            <div key={dl.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
              <div>
                <Link to={`/dashboard/resources/${dl.resourceId}`} className="font-bold text-slate-900 hover:text-indigo-900">
                  {dl.resourceTitle}
                </Link>
                <p className="text-xs text-slate-500 mt-1">
                  {dl.subject} • Downloaded {dl.downloadCount}x • Last: {formatTimestamp(dl.lastDownloadedAt)}
                </p>
              </div>
              <Link
                to={`/dashboard/resources/${dl.resourceId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200"
              >
                <Download className="w-3.5 h-3.5" /> Open / Rate
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
