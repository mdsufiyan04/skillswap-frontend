import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/navbar/Navbar';
import { getMyRequests, updateRequest } from '../api/services';

const Requests = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('incoming');
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRequests()
      .then(res => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await updateRequest(id, 'accepted');
      const exchangeId = res.data?.exchangeId || res.data?.exchange?.id;
      toast.success('Request accepted! Opening exchange workspace...');
      const updated = await getMyRequests();
      setRequests(updated.data);
      if (exchangeId) {
        navigate(`/exchange/${exchangeId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept request');
    }
  };

  const handleDecline = async (id) => {
    try {
      await updateRequest(id, 'rejected');
      toast.success('Request declined');
      const res = await getMyRequests();
      setRequests(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to decline request');
    }
  };

  const incoming = requests.incoming;
  const outgoing = requests.outgoing;
  const currentList = activeTab === 'incoming' ? incoming : outgoing;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-apple-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-apple-black font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-[48px] font-bold text-apple-black tracking-[-0.02em] leading-tight mb-8">Exchange Requests</h1>

        <div className="flex gap-6 border-b border-apple-border mb-8">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`pb-4 px-2 text-[14px] uppercase tracking-[0.08em] font-medium relative ${activeTab === 'incoming' ? 'text-apple-black' : 'text-apple-gray hover:text-apple-black'}`}
          >
            Incoming ({incoming.length})
            {activeTab === 'incoming' && (
              <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-apple-black" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`pb-4 px-2 text-[14px] uppercase tracking-[0.08em] font-medium relative ${activeTab === 'outgoing' ? 'text-apple-black' : 'text-apple-gray hover:text-apple-black'}`}
          >
            Outgoing ({outgoing.length})
            {activeTab === 'outgoing' && (
              <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-apple-black" />
            )}
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {currentList.map((req, i) => {
              const otherUser = activeTab === 'incoming' ? req.fromUser : req.toUser;

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="bg-white p-6 rounded-[18px] border border-apple-border flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.username}`} className="w-12 h-12 rounded-full border border-apple-border" alt="" />
                      <div>
                        <h3 className="font-semibold text-apple-black text-[17px]">{otherUser?.name || 'Unknown User'}</h3>
                        <p className="text-[12px] text-apple-gray uppercase tracking-[0.08em] flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-3 py-1.5 bg-apple-bg border border-apple-border text-apple-black rounded-[980px] text-[12px] uppercase tracking-[0.08em] font-medium">
                        <span className="text-apple-gray mr-1">Target Skill:</span> {req.skill?.name}
                      </div>
                    </div>

                    <p className="text-[14px] text-apple-gray leading-relaxed p-4 rounded-[12px] bg-apple-bg border border-apple-border italic">"{req.message}"</p>
                  </div>

                  <div className="w-full md:w-auto">
                    {activeTab === 'incoming' && req.status === 'pending' ? (
                      <div className="flex flex-col sm:flex-row md:flex-col gap-3">
                        <button onClick={() => handleAccept(req.id)} className="w-full md:w-32 py-3 bg-apple-black text-white hover:bg-[#333333] rounded-[980px] text-[14px] font-medium flex items-center justify-center gap-2 transition-colors">
                          <CheckCircle className="w-4 h-4" /> Accept
                        </button>
                        <button onClick={() => handleDecline(req.id)} className="w-full md:w-32 py-3 bg-white border border-apple-border hover:bg-apple-bg text-apple-black rounded-[980px] text-[14px] font-medium flex items-center justify-center gap-2 transition-colors">
                          <XCircle className="w-4 h-4" /> Decline
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center md:justify-end">
                        {req.status === 'pending' && <span className="px-4 py-2 bg-white border border-apple-border text-apple-gray uppercase tracking-[0.08em] font-medium text-[12px] rounded-[980px] flex items-center gap-2"><Clock className="w-4 h-4" /> Pending</span>}
                        {req.status === 'accepted' && <span className="px-4 py-2 bg-apple-black text-white uppercase tracking-[0.08em] font-medium text-[12px] rounded-[980px] flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Accepted</span>}
                        {req.status === 'rejected' && <span className="px-4 py-2 bg-white border border-apple-border text-apple-gray uppercase tracking-[0.08em] font-medium text-[12px] rounded-[980px] flex items-center gap-2 line-through"><XCircle className="w-4 h-4" /> Rejected</span>}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {currentList.length === 0 && (
            <div className="text-center py-12 text-[17px] text-apple-gray">No requests found.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Requests;
