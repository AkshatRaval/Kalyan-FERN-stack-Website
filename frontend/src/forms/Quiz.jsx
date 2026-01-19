import React, { useState, useMemo } from "react";

// Utility to shuffle options reliably
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const rawQuestions = [
  { q: "ભારતનું Union Budget ક્યારે રજૂ થાય છે?", correct: "1 ફેબ્રુઆરી", options: ["1 ફેબ્રુઆરી", "15 ઓગસ્ટ", "26 જાન્યુઆરી"] },
  { q: "SIP નો full form શું છે?", correct: "Systematic Investment Plan", options: ["Systematic Investment Plan", "Secure Income Plan", "Share Investment Policy"] },
  { q: "Sensex કેટલા શેરથી બનેલો છે?", correct: "30", options: ["30", "50", "100"] },
  { q: "Inflation વધે તો સામાન્ય રીતે શું થાય?", correct: "વસ્તુઓ મોંઘી થાય", options: ["વસ્તુઓ મોંઘી થાય", "વસ્તુઓ સસ્તી થાય", "ફેર નથી"] },
  { q: "Demat Account શે માટે ઉપયોગ થાય છે?", correct: "શેર digital form માં રાખવા", options: ["શેર digital form માં રાખવા", "લોન માટે", "ટેક્સ માટે"] },
  { q: "Budget માં Capex વધે તો કયો sector benefit?", correct: "Infrastructure", options: ["Infrastructure", "FMCG", "IT"] },
  { q: "Interest rate ઘટે તો સામાન્ય રીતે?", correct: "Banking & Real Estate", options: ["Banking & Real Estate", "Gold", "Agriculture"] },
  { q: "Defence budget વધે તો?", correct: "Defence Manufacturing", options: ["Defence Manufacturing", "Retail", "FMCG"] },
  { q: "Direct tax cut થી કયો sector benefit?", correct: "Consumption sector", options: ["Consumption sector", "PSU Banks", "Power"] },
  { q: "Budget knowledge useful કેમ?", correct: "Economic understanding", options: ["Economic understanding", "Tips", "Guaranteed profit"] }
];

export default function BudgetFinanceTest() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [demat, setDemat] = useState("");

  // FIX: Memoize shuffled questions so they don't change on every render
  const quizData = useMemo(() => {
    return rawQuestions.map((q) => {
      const shuffledOptions = shuffleArray(q.options);
      return {
        question: q.q,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(q.correct),
      };
    });
  }, []);

  const score = Object.keys(answers).reduce((acc, index) => {
    return acc + (answers[index] === quizData[index].correctIndex ? 1 : 0);
  }, 0);

  const percent = Math.round((score / quizData.length) * 100);
  
  const getLevel = () => {
    if (percent >= 90) return { label: "Smart Investor", color: "text-green-600", bg: "bg-green-100" };
    if (percent >= 70) return { label: "Average Investor", color: "text-blue-600", bg: "bg-blue-100" };
    return { label: "Beginner", color: "text-orange-600", bg: "bg-orange-100" };
  };

  const currentLevel = getLevel();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* HEADER */}
        <div className="bg-indigo-700 p-8 text-white text-center">
          <h1 className="text-3xl font-bold tracking-tight">Budget & Finance IQ 2026</h1>
          <p className="opacity-80 mt-2 font-medium">Kalyan Education Charitable Trust</p>
          {!submitted && (
             <div className="mt-4 bg-indigo-800/50 rounded-full h-2 w-full">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(Object.keys(answers).length / quizData.length) * 100}%` }}
                ></div>
             </div>
          )}
        </div>

        <div className="p-8">
          {!submitted ? (
            <>
              <div className="space-y-8">
                {quizData.map((q, i) => (
                  <div key={i} className="group">
                    <p className="text-lg font-semibold mb-4 text-slate-800">
                      <span className="text-indigo-600 mr-2">{i + 1}.</span> {q.question}
                    </p>
                    <div className="grid gap-3">
                      {q.options.map((op, j) => (
                        <label
                          key={j}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            answers[i] === j 
                            ? "border-indigo-600 bg-indigo-50 shadow-sm" 
                            : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q${i}`}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            onChange={() => setAnswers({ ...answers, [i]: j })}
                            checked={answers[i] === j}
                          />
                          <span className="ml-3 font-medium">{op}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(answers).length < quizData.length}
                className="mt-12 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
              >
                View My Results
              </button>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* RESULTS CARD */}
              <div className={`text-center p-8 rounded-2xl ${currentLevel.bg} mb-8`}>
                <p className="text-slate-600 uppercase tracking-widest text-sm font-bold">Your Score</p>
                <h2 className="text-6xl font-black my-2 text-slate-900">{percent}%</h2>
                <p className={`text-xl font-bold ${currentLevel.color}`}>{currentLevel.label}</p>
              </div>

              {/* LEAD FORM */}
              <form 
                onSubmit={(e) => { e.preventDefault(); window.location.href = "/budget-sector-focus-2026.pdf"; }} 
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">Get Your Free Budget Guide</h3>
                  <p className="text-slate-500">Fill details to download the Sector Focus 2026 PDF</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="w-full border-slate-200 border-2 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all" placeholder="Full Name" required />
                  <input className="w-full border-slate-200 border-2 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all" placeholder="Mobile Number" required />
                </div>
                
                <select
                  className="w-full border-slate-200 border-2 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                  required
                  onChange={(e) => setDemat(e.target.value)}
                >
                  <option value="">Do you have Demat Account?</option>
                  <option value="angel">Yes - Angel One</option>
                  <option value="other">Yes - Other Broker</option>
                  <option value="no">No Demat Account</option>
                </select>

                <label className="flex items-start gap-3 text-sm text-slate-600 py-2">
                  <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" required />
                  <span>I agree to receive educational & awareness related updates.</span>
                </label>

                <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                  Download Free Guide
                </button>

                {demat === "no" && (
                  <div className="mt-6 p-6 bg-orange-50 border-2 border-orange-100 rounded-2xl text-center">
                    <p className="font-medium text-orange-800 mb-4">
                      Start your investment journey today!
                    </p>
                    <a href="https://a.aonelink.in/ANGOne/2irVEKF" target="_blank" rel="noreferrer" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all shadow-md">
                      Open FREE Angel One Account
                    </a>
                  </div>
                )}
              </form>
            </div>
          )}

          <hr className="my-8 border-slate-100" />
          <p className="text-[10px] leading-relaxed text-slate-400 text-center italic">
            <strong>Disclaimer:</strong> This initiative is strictly for educational and awareness purposes only. 
            Financial markets involve risks. No buy/sell/hold recommendations are provided.
          </p>
        </div>
      </div>
    </div>
  );
}