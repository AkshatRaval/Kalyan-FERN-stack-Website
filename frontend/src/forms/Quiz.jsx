import React, { useState, useEffect, useRef } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../lib/api";

const PASSING_SCORE = 1;

const questions = [
  {
    id: 1,
    q: "Q1. તમે ક્યારેય “શેર માર્કેટ” વિશે સાંભળ્યું છે?",
    type: "mcq",
    options: ["હા", "ના"],
    required: true,
  },
  {
    id: 2,
    q: "Q2. નીચે પૈકી કઈ વસ્તુમાં રોકાણ કરવામાં આવે છે?",
    type: "mcq",
    options: ["Fixed Deposit", "Gold", "Shares / Stocks", "ઉપરના બધા"],
    required: true,
  },
  {
    id: 3,
    q: "Q3. “Option Trading” તમને કઇ વાત સમજાવે છે?",
    type: "mcq",
    options: [
      "ખાતરીવાળો નફો આપતી ટ્રેડિંગ",
      "શોર્ટ-ટર્મ રિસ્કવાળી ટ્રેડિંગ",
      "બેંકના લોન સંબંધિત વસ્તુ",
      "ખબર નથી",
    ],
    required: true,
  },
  {
    id: 4,
    q: "Q4. રોકાણ કરતા પહેલા સૌથી અગત્યની બાબત કઈ છે?",
    type: "mcq",
    options: [
      "Proper Knowledge",
      "મિત્રની સલાહ",
      "Luck",
      "Social Media ટ્રેન્ડ",
    ],
    required: true,
  },
  {
    id: 5,
    q: "Q5. Mutual Fund શું છે?",
    type: "mcq",
    options: [
      "એક પ્રકારનું ઈન્વેસ્ટમેન્ટ ફંડ",
      "બેંક લોન",
      "ઈન્શ્યોરન્સ સ્કીમ",
      "ખબર નથી",
    ],
    required: true,
  },
  {
    id: 6,
    q: "Q6. તમે દર મહિને પૈસામાંથી બચત / ઈન્વેસ્ટ કરો છો?",
    type: "mcq",
    options: ["હા", "ના"],
    required: true,
  },
  {
    id: 7,
    q: "Q7. તમે ક્યારેય શેર માર્કેટ અથવા IPOમાં રોકાણ કર્યું છે?",
    type: "mcq",
    options: [
      "હા, હું નિયમિત રીતે રોકાણ કરું છું",
      "હા, પણ નિયમિત નથી",
      "ના, ક્યારેય નહીં",
    ],
    required: true,
  },
  {
    id: 8,
    q: "Q8. જો કોઈ સ્કીમ “Double Money in 1 Month” કહે તો તમે શું કરશો?",
    type: "mcq",
    options: [
      "તપાસી પછી રોકાણ કરું",
      "તરત જ રોકાણ કરી દઉં",
      "મિત્રો પાસે પૂછું",
      "રોકાણ ન કરું",
    ],
    required: true,
  },
  {
    id: 9,
    q: "Q9. તમારું Demat Account છે?",
    type: "mcq",
    options: ["હા", "ના"],
    required: true,
  }, // branch
  {
    id: 10,
    q: "Q10. ફાઇનાન્સ શીખવામાં તમારો રસ કેટલો છે?",
    type: "mcq",
    options: ["ખૂબ રસ છે", "થોડો રસ છે", "નહીં રસ"],
    required: true,
  },
];

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;

function NameScreen({ onStart }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!fullName.trim()) {
      setError("કૃપા કરી તમારું નામ દાખલ કરો.");
      return;
    }
    if (!email.trim()) {
      setError("કૃપા કરી ઈમેલ દાખલ કરો.");
      return;
    }
    if (!phone.trim()) {
      setError("કૃપા કરી ફોન નંબર દાખલ કરો.");
      return;
    }
    setError("");
    onStart({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <div className="relative">
      <div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Check Your Financial Awareness — Fill the Form
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please provide the following information.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Eg. Jayant Shah"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="+91 9xxxxxxxxx"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            onClick={handleStart}
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizQuestion({ qObj, onAnswer }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{qObj.q}</h2>
      <div className="space-y-2 mt-4">
        {qObj.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(qObj.id, opt)}
            className="w-full text-left p-3 bg-gray-100 rounded hover:bg-blue-50 border"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Q9aFields({ values, onChange, errors }) {
  return (
    <div className="mt-4 space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">
          Q9a. તમારું Demat કયા બ્રોકર પાસે છે?
        </label>
        <select
          value={values.broker}
          onChange={(e) => onChange("broker", e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">– પસંદ કરો –</option>
          <option>Zerodha</option>
          <option>Angel One</option>
          <option>Groww</option>
          <option>Kotak</option>
          <option>Other</option>
        </select>
        {errors.broker && (
          <div className="text-red-500 text-sm">{errors.broker}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">PAN નંબર</label>
        <input
          value={values.pan}
          onChange={(e) => onChange("pan", e.target.value)}
          placeholder="AAAPL1234C"
          className="w-full px-3 py-2 border rounded"
        />
        {errors.pan && <div className="text-red-500 text-sm">{errors.pan}</div>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Client ID</label>
        <input
          value={values.clientId}
          onChange={(e) => onChange("clientId", e.target.value)}
          placeholder="તમારું Client ID"
          className="w-full px-3 py-2 border rounded"
        />
        {errors.clientId && (
          <div className="text-red-500 text-sm">{errors.clientId}</div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="regularTrading"
          type="checkbox"
          checked={values.regularTrading}
          onChange={(e) => onChange("regularTrading", e.target.checked)}
        />
        <label htmlFor="regularTrading">Regular trading</label>
      </div>
    </div>
  );
}

export const CertificateScreen = ({ userName, onDownload }) => {
  const [pdfUri, setPdfUri] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generate = async (name) => {
      try {
        const exBytes = await fetch("/files/cert2.pdf").then((r) =>
          r.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(exBytes);
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const pages = pdfDoc.getPages();
        const p = pages[0];

        p.drawText(name, {
          x: 350,
          y: 313,
          size: 30,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });

        const uri = await pdfDoc.saveAsBase64({ dataUri: true });
        setPdfUri(uri);
      } catch (err) {
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    };
    generate(userName);
  }, [userName]);

  const handleDownload = () => {
    if (!pdfUri) return;
    const link = document.createElement("a");
    link.href = pdfUri;
    link.download = `Certificate-${userName.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onDownload) onDownload();
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">અભિનંદન!</h2>
      <p className="mb-4">તમારું સર્ટિફિકેટ તૈયાર છે.</p>

      {isGenerating ? (
        <div>Generating your certificate...</div>
      ) : (
        <>
          <div className="w-full max-w-4xl mx-auto shadow">
            <iframe
              src={pdfUri}
              title="Certificate"
              className="w-full aspect-[8.5/11] border-0"
            />
          </div>

          <button
            onClick={handleDownload}
            className="mt-6 bg-green-600 text-white py-3 px-6 rounded"
          >
            Download Certificate (.pdf)
          </button>
        </>
      )}
    </div>
  );
};

export default function QuizLayout() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState("name"); // name, quiz, failure, certificate
  const [user, setUser] = useState({}); // { fullName, email, phone }
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // keys by question id
  const [score, setScore] = useState(0);

  // Q9a fields and validation errors
  const [q9a, setQ9a] = useState({
    broker: "",
    pan: "",
    clientId: "",
    regularTrading: false,
  });
  const [q9aErrors, setQ9aErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // start quiz from Name screen
  const handleStart = (userInfo) => {
    setUser(userInfo);
    setScreen("quiz");
    setQIndex(0);
    setAnswers({});
    setScore(0);
    setQ9a({ broker: "", pan: "", clientId: "", regularTrading: false });
    setQ9aErrors({});
  };

  const handleAnswer = (qid, value) => {
    // save answer
    setAnswers((prev) => ({ ...prev, [qid]: value }));

    const newScore = Object.keys({ ...answers, [qid]: value }).length;
    setScore(newScore);

    // special: if Q9 answered 'હા' or 'ના' we may show Q9a or Q9b after selecting.
    // Move to next
    const nextIndex = qIndex + 1;
    if (nextIndex < questions.length) {
      setQIndex(nextIndex);
    } else {
      // end of question list: handle Q9 branching validation if needed and submit
      finishQuiz({ ...answers, [qid]: value });
    }
  };

  const handleQ9aChange = (field, value) => {
    setQ9a((prev) => ({ ...prev, [field]: value }));
  };

  const validateQ9a = () => {
    const errs = {};
    if (!q9a.broker) errs.broker = "કૃપા કરી બ્રોકરની પસંદગી કરો.";
    if (!q9a.pan) errs.pan = "PAN જરૂરિયાત છે.";
    else if (!PAN_REGEX.test(q9a.pan.toUpperCase()))
      errs.pan = "PAN ફોર્મેટ યોગ્ય નથી. ઉદાહરણ: AAAPL1234C";
    if (!q9a.clientId) errs.clientId = "Client ID આપવા જરૂરી છે.";
    setQ9aErrors(errs);
    return Object.keys(errs).length === 0;
  };
const finishQuiz = async (finalAnswers) => {
    setIsLoading(true); // Start loading

    if (finalAnswers[9] === "હા") {
      if (!validateQ9a()) {
        setIsLoading(false);
        setScreen("q9a");
        return;
      }
    }

    await submitToSheets(finalAnswers);

    if (finalAnswers[9] === "ના") {
      window.open("https://a.aonelink.in/ANGOne/JAJrFEz", "_blank");
    }

    if (Object.keys(finalAnswers).length >= PASSING_SCORE) {
      setScreen("certificate");
    } else {
      setScreen("failure");
    }

    setIsLoading(false); // Stop loading
  };
  const normalizeAnswers = (answersObj) => {
    if (Array.isArray(answersObj)) return answersObj; // already array
    if (typeof answersObj === "object" && answersObj !== null) {
      return Object.keys(answersObj)
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => answersObj[key]);
    }
    return [];
  };
  const submitToSheets = async (finalAnswers) => {
    try {
      // Basic sanity checks
      console.log("finalAnswers:", finalAnswers);
      // Make sure finalAnswers is an array
      const normalizedAnswers = normalizeAnswers(finalAnswers);
      if (!Array.isArray(normalizedAnswers)) {
        throw new Error("finalAnswers must be an array");
      }

      // Choose index that corresponds to the question you expect.
      // finalAnswers[9] means the 10th answer. Adjust if needed.
      const wantsQ9a = finalAnswers[9] === "હા";

      const payload = {
        timestamp: new Date().toISOString(),
        user: user || {}, // ensure user is an object
        answers: normalizedAnswers,
        // send an object {} instead of null when not applicable, to avoid server null access
        q9a: wantsQ9a ? q9a : {},
      };

      console.log("Payload to send:", payload);

      const res = await api.post("/quiz/api/upload", payload);
      console.log("Server response:", res.data || res);
      return res.data;
    } catch (error) {
      // axios error handling - prints server response body if available
      if (error.response) {
        console.error("Request failed - status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else {
        console.error("Request error:", error.message || error);
      }
      throw error; // rethrow if caller needs it
    }
  };

  const renderCurrent = () => {
    // special screen for Q9a (if validation failed)
    if (screen === "q9a") {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-3">Q9a નોંધણી (જરૂરી)</h2>
          <Q9aFields
            values={q9a}
            onChange={handleQ9aChange}
            errors={q9aErrors}
          />
          <div className="flex mt-4 gap-2">
            <button
              onClick={() => {
                if (validateQ9a()) {
                  // attach q9a into answers and then submit
                  const finalAnswers = answers;
                  // ensure Q9 is set to 'હા'
                  finalAnswers[9] = "હા";
                  finishQuiz(finalAnswers);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              સબમિટ અને આગળ
            </button>

            <button
              onClick={() => setScreen("quiz")}
              className="px-4 py-2 border rounded"
            >
              પાછળ
            </button>
          </div>
        </div>
      );
    }

    switch (screen) {
      case "name":
        return <NameScreen onStart={handleStart} />;

      case "quiz":
        const qObj = questions[qIndex];
        return (
          <div>
            <QuizQuestion qObj={qObj} onAnswer={handleAnswer} />
            {/* If current is Q9 and answer 'ના' we provide immediate "open account" link*/}
            {qObj.id === 9 && answers[9] === "ના" && (
              <div className="mt-4">
                <p className="mb-2">
                  જો તમારે Demat ખોલવું હોય તો નીચે દિખાવવામાં આવેલ લિંકથી ખોલી
                  શકો છો:
                </p>
                <a
                  href="https://a.aonelink.in/ANGOne/JAJrFEz"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  Demat ખાતું અહીંથી ખોલો (ઉદાહરણ લિંક)
                </a>
              </div>
            )}
          </div>
        );

      case "certificate":
        return <CertificateScreen userName={user.fullName} />;

      case "failure":
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">માફ કરશો</h2>
            <p className="mb-4">
              તમારા જવાબોના આધારે તમે પાસ ન થતા. તમે સબમિટ કરેલા જવાબો સાચવવામાં
              આવ્યા છે.
            </p>
            <button
              onClick={() => {
                // restart
                setScreen("name");
                setUser({});
                setAnswers({});
                setQIndex(0);
                setQ9a({
                  broker: "",
                  pan: "",
                  clientId: "",
                  regularTrading: false,
                });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              ફરીથી પ્રયાસ કરો
            </button>
          </div>
        );

      default:
        return <div>Unknown screen</div>;
    }
  };

  return (
    <>
      <Link
        className="absolute left-5 top-5 flex items-center gap-2 bg-accent text-accent-foreground p-2 px-3 rounded-2xl border"
        to={"/"}
      >
        <ArrowLeft size={15} />
        Back To Home
      </Link>
      <div className="bg-gray-100 font-sans flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 transition-all">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
              <p className="mt-4 text-lg font-medium text-gray-700">
                Submitting your answers...
              </p>
            </div>
          )}
          {renderCurrent()}
        </div>
      </div>
    </>
  );
}
