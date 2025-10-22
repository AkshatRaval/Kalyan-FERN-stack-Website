import { Calendar, Clock, FileText, MapPin, Users, X, IndianRupee, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DetailsModal = ({ isOpen, onClose, activity }) => {
  if (!activity) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-100 dark:border-slate-800">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
                
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 z-100 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-semibold uppercase tracking-wider border border-blue-400/30">
                          {activity.category}
                        </span>
                        <Award className="w-4 h-4 text-yellow-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                        {activity.title}
                      </h2>
                      <p className="text-slate-300 text-base leading-relaxed">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-240px)] space-y-8">
                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 p-5 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-semibold text-blue-900 dark:text-blue-300 uppercase tracking-wide">Date</span>
                    </div>
                    <p className="text-gray-900 dark:text-white font-bold text-lg ml-1">{activity.date}</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 p-5 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wide">Duration</span>
                    </div>
                    <p className="text-gray-900 dark:text-white font-bold text-lg ml-1">{activity.duration}</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 p-5 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide">Participants</span>
                    </div>
                    <p className="text-gray-900 dark:text-white font-bold text-lg ml-1">{activity.participants}</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 p-5 rounded-2xl border border-orange-200/50 dark:border-orange-800/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm font-semibold text-orange-900 dark:text-orange-300 uppercase tracking-wide">Location</span>
                    </div>
                    <p className="text-gray-900 dark:text-white font-bold text-lg ml-1">{activity.location}</p>
                  </motion.div>
                </div>

                {/* Fee Information */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-slate-900 dark:bg-slate-700 rounded-lg">
                        <IndianRupee className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Registration Fee</h3>
                    </div>
                    <div className="flex items-baseline gap-3 ml-1">
                      <p className="text-4xl font-black text-slate-900 dark:text-white">
                        {activity.fee === 0 ? 'Free' : `₹${activity.fee}`}
                      </p>
                      {activity.isTeamBased && (
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full">
                          Per Team
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Team Information */}
                {activity.isTeamBased && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/30 dark:to-indigo-900/20 p-6 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/30"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="font-bold text-indigo-900 dark:text-indigo-200 text-lg">Team Information</h3>
                    </div>
                    <div className="space-y-3 ml-1">
                      <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">Event Type</p>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">Team-based Competition</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">Maximum Team Size</p>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">{activity.maxTeamSize} members including team leader</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Requirements */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-slate-900 dark:bg-slate-700 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Required Documents</h3>
                  </div>
                  <div className="grid gap-3 ml-1">
                    {[
                      { icon: "📷", text: "Recent passport-size photograph" },
                      { icon: "🪪", text: "Valid ID proof (Aadhar card)" },
                      { icon: "📄", text: "Academic records/mark sheets" },
                      { icon: "✍️", text: "Guardian consent form" }
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 + (index * 0.05) }}
                        className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl hover:shadow-md transition-all duration-200"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailsModal;