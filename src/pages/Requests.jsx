import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { getMyRequests, updateRequest } from '../api/services';

const Requests = () => {
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
      await updateRequest(id, 'accepted');
      const res = await getMyRequests();
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await updateRequest(id, 'rejected');
      const res = await getMyRequests();
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const incoming = requests.incoming;
  const outgoing = requests.outgoing;
  const currentList = activeTab === 'incoming' ? incoming : outgoing;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7FF]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Exchange Requests</h1>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('incoming')}
            className={`pb-4 px-2 text-sm font-bold relative ${activeTab === 'incoming' ? 'text-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Incoming ({incoming.length})
            {activeTab === 'incoming' && (
              <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('outgoing')}
            className={`pb-4 px-2 text-sm font-bold relative ${activeTab === 'outgoing' ? 'text-violet-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Outgoing ({outgoing.length})
            {activeTab === 'outgoing' && (
              <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
            )}
          </button>
        </div>

        {/* List */}
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
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={otherUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'} className="w-12 h-12 rounded-full border border-gray-100" />
                      <div>
                        <h3 className="font-bold text-gray-900">{otherUser?.name || 'Unknown User'}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                        <span className="text-xs text-indigo-400 uppercase mr-1">Target Skill:</span> {req.skill?.name}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl italic">"{req.message}"</p>
                  </div>

                  <div className="w-full md:w-auto">
                    {activeTab === 'incoming' && req.status === 'pending' ? (
                      <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                        <button onClick={() => handleAccept(req.id)} className="w-full md:w-32 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                          <CheckCircle className="w-4 h-4" /> Accept
                        </button>
                        <button onClick={() => handleDecline(req.id)} className="w-full md:w-32 py-2.5 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                          <XCircle className="w-4 h-4" /> Decline
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center md:justify-end">
                        {req.status === 'pending' && <span className="px-4 py-2 bg-yellow-50 text-yellow-700 font-bold text-sm rounded-xl flex items-center gap-2"><Clock className="w-4 h-4" /> Pending</span>}
                        {req.status === 'accepted' && <span className="px-4 py-2 bg-green-50 text-green-700 font-bold text-sm rounded-xl flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Accepted</span>}
                        {req.status === 'rejected' && <span className="px-4 py-2 bg-red-50 text-red-700 font-bold text-sm rounded-xl flex items-center gap-2"><XCircle className="w-4 h-4" /> Rejected</span>}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {currentList.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No requests found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Requests;
