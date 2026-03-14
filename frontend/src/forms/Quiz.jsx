import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import toast from "react-hot-toast";
import { QUIZ_QUESTIONS, QUIZ_CONFIG } from "../constants/Questions.js";
import { useAuth } from "../utils/AuthProvider.jsx";

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const TimerRing = ({ seconds, total }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - seconds / total);
  const color = seconds > total * 0.5 ? "#6366f1" : seconds > total * 0.25 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="3" />
        <circle cx="28" cy="28" r={radius} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={dashoffset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
      </svg>
      <span className="text-sm font-bold tabular-nums" style={{ color }}>{seconds}</span>
    </div>
  );
};

export default function BudgetQuiz() {

  if (!QUIZ_CONFIG.quiz_open) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 py-8 px-4 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-500 px-8 py-8 text-white text-center">
            <h1 className="text-2xl font-bold">{QUIZ_CONFIG.title}</h1>
            <p className="text-slate-200 text-sm mt-1">Status: Closed</p>
          </div>
          <div className="px-8 py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-3">Quiz is Closed</h2>
            <p className="text-slate-500 leading-relaxed">
              This quiz is currently not accepting any more responses.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-all"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // ── Auth guard ──────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !currentUser) navigate("/login");
  }, [currentUser, authLoading, navigate]);

  // ── Already-submitted check ─────────────────────────────────────
  const [checkingSubmission, setCheckingSubmission] = useState(true);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const check = async () => {
      try {
        const res = await api.get("/quiz/api/budget-quiz/check");
        if (res.data?.submitted) setAlreadySubmitted(true);
      } catch (err) {
        // If check fails, allow quiz to proceed
        console.error("Submission check failed:", err);
      } finally {
        setCheckingSubmission(false);
      }
    };
    check();
  }, [currentUser]);

  // ── Quiz state ──────────────────────────────────────────────────
  const [phase, setPhase] = useState("quiz"); // quiz | form | done
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_CONFIG.timerPerQuestion); // 10s
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const quizData = useMemo(() =>
    QUIZ_QUESTIONS.map((q) => {
      const shuffled = shuffleArray(q.options);
      return { question: q.question, options: shuffled, correctIndex: shuffled.indexOf(q.correctAnswer) };
    }), []);

  const totalQ = quizData.length;

  const score = useMemo(() =>
    Object.keys(answers).reduce(
      (acc, i) => acc + (answers[i] === quizData[i].correctIndex ? 1 : 0), 0
    ), [answers, quizData]);

  const percent = Math.round((score / totalQ) * 100);

  const advanceQuestion = useCallback(() => {
    if (currentQ < totalQ - 1) {
      setCurrentQ((q) => q + 1);
      setTimeLeft(QUIZ_CONFIG.timerPerQuestion);
      setTimedOut(false);
    } else {
      setPhase("form");
    }
  }, [currentQ, totalQ]);

  useEffect(() => {
    if (phase !== "quiz") return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTimedOut(true);
          setTimeout(advanceQuestion, 600);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQ, phase, advanceQuestion]);

  const selectAnswer = (optionIndex) => {
    if (timedOut || answers[currentQ] !== undefined) return;
    clearInterval(timerRef.current);
    setAnswers((prev) => ({ ...prev, [currentQ]: optionIndex }));
    setTimeout(advanceQuestion, 300);
  };

  const handleSkip = () => {
    clearInterval(timerRef.current);
    advanceQuestion();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const answersArray = quizData.map((q, i) =>
      answers[i] !== undefined ? q.options[answers[i]] : "Skipped"
    );

    const payload = {
      fullName,
      mobile,
      email: currentUser?.email || "",
      answers: answersArray,
      score,
      percentage: percent,
    };

    try {
      const res = await api.post("/quiz/api/budget-quiz", payload);
      if (res.status === 201) {
        setPhase("done");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        // Already submitted — caught at submission time too
        setAlreadySubmitted(true);
      } else {
        toast.error("Submission failed. Please try again.");
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading states ──────────────────────────────────────────────
  if (authLoading || checkingSubmission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!currentUser) return null;

  // ── Already submitted wall ──────────────────────────────────────
  if (alreadySubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 py-8 px-4 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 px-8 py-8 text-white text-center">
            <h1 className="text-2xl font-bold">{QUIZ_CONFIG.title}</h1>
            <p className="text-indigo-200 text-sm mt-1">{QUIZ_CONFIG.subtitle}</p>
          </div>
          <div className="px-8 py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-3">Already Submitted!</h2>
            <p className="text-slate-500 leading-relaxed">
              You have already submitted this quiz with your account.
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Each account can only attempt this quiz once.
            </p>
            <p className="mt-2 text-xs text-slate-300 italic">
              Logged in as: {currentUser.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const q = quizData[currentQ];
  const answered = answers[currentQ] !== undefined;
  const progressPct = (currentQ / totalQ) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 py-8 px-4 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* ── QUIZ PHASE ── */}
        {phase === "quiz" && (
          <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 px-8 pt-8 pb-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">{QUIZ_CONFIG.title}</h1>
                  <p className="text-indigo-200 text-xs mt-0.5">{QUIZ_CONFIG.subtitle}</p>
                </div>
                <TimerRing seconds={timeLeft} total={QUIZ_CONFIG.timerPerQuestion} />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }} />
                </div>
                <span className="text-white/70 text-xs tabular-nums whitespace-nowrap">
                  {currentQ + 1} / {totalQ}
                </span>
              </div>
            </div>

            <div className="px-8 py-6">
              <p className="text-lg font-semibold text-slate-800 leading-relaxed mb-6">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mr-2 shrink-0">
                  {currentQ + 1}
                </span>
                {q.question}
              </p>

              {timedOut && (
                <div className="mb-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-medium text-center">
                  ⏱ Time's up! Moving on…
                </div>
              )}

              <div className="grid gap-3">
                {q.options.map((option, j) => (
                  <button
                    key={j}
                    onClick={() => selectAnswer(j)}
                    disabled={answered || timedOut}
                    className={`flex items-center gap-3 w-full text-left p-4 rounded-2xl border-2 font-medium transition-all duration-150
                      ${answered || timedOut
                        ? "border-slate-100 bg-slate-50 text-slate-400 cursor-default"
                        : "border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 active:scale-[0.98] cursor-pointer"
                      }`}
                  >
                    <span className="w-7 h-7 rounded-full border-2 border-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + j)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              {!answered && !timedOut && (
                <div className="mt-4 flex justify-end">
                  <button onClick={handleSkip}
                    className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors px-3 py-1">
                    Skip →
                  </button>
                </div>
              )}
            </div>

            <div className="px-8 pb-6 flex gap-1 flex-wrap">
              {quizData.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < currentQ ? "bg-indigo-400 w-4"
                    : i === currentQ ? "bg-indigo-600 w-6"
                      : "bg-slate-100 w-2"
                  }`} />
              ))}
            </div>
          </div>
        )}

        {/* ── FORM PHASE ── */}
        {phase === "form" && (
          <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 px-8 py-8 text-white text-center">
              <h1 className="text-2xl font-bold">{QUIZ_CONFIG.title}</h1>
              <p className="text-indigo-200 text-sm mt-1">{QUIZ_CONFIG.subtitle}</p>
            </div>
            <div className="px-8 py-8">
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Almost done! ✍️</h2>
                <p className="text-slate-500 text-sm mt-1">Enter your details to submit the quiz</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                    <input
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-800 focus:border-indigo-400 outline-none transition-colors bg-slate-50"
                      placeholder="Your full name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Mobile Number</label>
                    <input
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-800 focus:border-indigo-400 outline-none transition-colors bg-slate-50"
                      placeholder="10-digit number"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/, ""))}
                      disabled={submitting}
                    />
                  </div>
                </div>

                {currentUser?.email && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                    <input
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-slate-400 bg-slate-50 outline-none cursor-not-allowed"
                      value={currentUser.email}
                      readOnly
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-indigo-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting…
                    </>
                  ) : "Submit Quiz"}
                </button>
              </form>

              <hr className="my-6 border-slate-100" />
              <p className="text-[10px] text-slate-400 text-center italic leading-relaxed">
                <strong>Disclaimer:</strong> For educational and awareness purposes only. Financial markets involve risks.
              </p>
            </div>
          </div>
        )}

        {/* ── DONE PHASE ── */}
        {phase === "done" && (
          <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 px-8 py-8 text-white text-center">
              <h1 className="text-2xl font-bold">{QUIZ_CONFIG.title}</h1>
              <p className="text-indigo-200 text-sm mt-1">{QUIZ_CONFIG.subtitle}</p>
            </div>
            <div className="px-8 py-16 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-3">
                Thank you, {fullName.split(" ")[0]}! 🙏
              </h2>
              <p className="text-slate-500 text-lg">Your response has been recorded.</p>
              <p className="text-slate-400 mt-2 text-base">Have a wonderful day ahead! ☀️</p>
              <p className="mt-12 text-[10px] text-slate-300 italic leading-relaxed">
                <strong>Disclaimer:</strong> Educational and awareness purposes only. Financial markets involve risks.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}