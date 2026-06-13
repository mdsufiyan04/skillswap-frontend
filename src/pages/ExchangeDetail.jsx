import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, Calendar as CalendarIcon, CheckCircle, AlertCircle, PlayCircle, XCircle } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { activeExchanges } from '../data/dummyData';

const ExchangeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const exchange = activeExchanges.find(e => e.id === parseInt(id)) || activeExchanges[0];

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img src={exchange.user.avatar} className="w-20 h-20 rounded-full border-4 border-gray-50 shadow-sm" />
            <div>
              <div className="inline-flex px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg mb-3">Active Exchange</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{exchange.user.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
                <span className="text-violet-600">{exchange.mySkill}</span>
                <span className="text-gray-400">↔</span>
                <span className="text-indigo-600">{exchange.theirSkill}</span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/chat')} className="px-6 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors">
            Go to Chat
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            
            {/* Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Exchange Progress</h2>
              <div className="flex justify-between text-sm font-bold text-gray-900 mb-2">
                <span>Overall Completion</span>
                <span className="text-violet-600">{exchange.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-3 rounded-full" style={{ width: `${exchange.progress}%` }}></div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-violet-50 border border-violet-100 rounded-xl text-violet-800 text-sm font-medium">
                <CheckCircle className="w-5 h-5 text-violet-500" />
                <span>{exchange.sessionsCompleted} of {exchange.totalSessions} sessions completed. Keep it up!</span>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Manage Exchange</h3>
              <button className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Mark Next Session Complete
              </button>
              <button className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> End Exchange Early
              </button>
              <button className="w-full py-3 bg-white text-gray-500 rounded-xl text-sm font-bold hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" /> Report Issue
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Next Session */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 bg-indigo-50 rounded-bl-full -mr-4 -mt-4"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 relative z-10">Next Session</h2>
              
              <div className="flex items-start gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{exchange.nextSession}</h4>
                  <p className="text-sm text-gray-500">Topic: Docker + CI/CD Walkthrough</p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <button className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Video className="w-5 h-5" /> Join Video Call
                </button>
                <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                  Reschedule
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ExchangeDetail;
