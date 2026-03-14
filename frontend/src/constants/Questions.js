// ============================================================
//  QUIZ QUESTIONS CONFIG
//  Edit questions, options, and correct answers here freely.
//  correctAnswer must exactly match one of the options strings.
// ============================================================

export const QUIZ_CONFIG = {
  title: "Kalyan Smart Investor Quiz Challenge",
  subtitle: "Kalyan Education Charitable Trust",
  timerPerQuestion: 10, // seconds per question
  passingScore: 50,     // % to be considered passing
  quiz_open: false,
};
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Stock Market માં “Share” નો અર્થ શું છે?",
    options: ["Loan", "Company નો ownership ભાગ", "Government bond", "Commodity"],
    correctAnswer: "Company નો ownership ભાગ",
  },
  {
    id: 2,
    question: "ભારતમાં મુખ્ય Stock Exchange કયો છે?",
    options: ["RBI", "NSE", "LIC", "IRDA"],
    correctAnswer: "NSE",
  },
  {
    id: 3,
    question: "Nifty 50 શું છે?",
    options: [
      "50 Banks નો index",
      "50 Large companies નો index",
      "50 IPO list",
      "50 Government bonds",
    ],
    correctAnswer: "50 Large companies નો index",
  },
  {
    id: 4,
    question: "Bull Market નો અર્થ શું છે?",
    options: ["Market down જાય", "Market stable રહે", "Market ઉપર જાય", "Market બંધ રહે"],
    correctAnswer: "Market ઉપર જાય",
  },
  {
    id: 5,
    question: "Bear Market નો અર્થ શું છે?",
    options: ["Market ઉપર જાય", "Market નીચે જાય", "Market sideways રહે", "Market close થાય"],
    correctAnswer: "Market નીચે જાય",
  },
  {
    id: 6,
    question: "IPO નો અર્થ શું છે?",
    options: [
      "Initial Public Offer",
      "Indian Public Option",
      "Investment Public Order",
      "Internal Price Order",
    ],
    correctAnswer: "Initial Public Offer",
  },
  {
    id: 7,
    question: "Demat Account શું માટે ઉપયોગ થાય છે?",
    options: ["Cash રાખવા", "Share digital form માં રાખવા", "Loan લેવા", "Insurance ખરીદવા"],
    correctAnswer: "Share digital form માં રાખવા",
  },
  {
    id: 8,
    question: "Intraday Trading શું છે?",
    options: ["1 વર્ષ investment", "Same day buy-sell", "5 દિવસ trading", "Long term investment"],
    correctAnswer: "Same day buy-sell",
  },
  {
    id: 9,
    question: "Stock Exchange ને કોણ regulate કરે છે?",
    options: ["RBI", "SEBI", "LIC", "SBI"],
    correctAnswer: "SEBI",
  },
  {
    id: 10,
    question: "Portfolio નો અર્થ શું છે?",
    options: ["Single stock", "Multiple investments નો collection", "Cash account", "Bank deposit"],
    correctAnswer: "Multiple investments નો collection",
  },
  {
    id: 11,
    question: "Support Level શું બતાવે છે?",
    options: ["Price ceiling", "Price floor", "Company profit", "Market news"],
    correctAnswer: "Price floor",
  },
  {
    id: 12,
    question: "Resistance Level શું બતાવે છે?",
    options: ["Price floor", "Price ceiling", "Company debt", "Dividend"],
    correctAnswer: "Price ceiling",
  },
  {
    id: 13,
    question: "Breakout શું હોય છે?",
    options: ["Price sideways", "Price support/resistance પાર કરે", "Price stable", "Market closed"],
    correctAnswer: "Price support/resistance પાર કરે",
  },
  {
    id: 14,
    question: "RSI indicator શું બતાવે છે?",
    options: ["Volume", "Overbought / Oversold condition", "Dividend", "Interest rate"],
    correctAnswer: "Overbought / Oversold condition",
  },
  {
    id: 15,
    question: "Candlestick Chart શું બતાવે છે?",
    options: ["Price movement", "Interest rate", "Company debt", "Inflation"],
    correctAnswer: "Price movement",
  },
  {
    id: 16,
    question: "Moving Average શું માટે ઉપયોગ થાય છે?",
    options: ["Price trend ઓળખવા", "Dividend check કરવા", "Loan calculate કરવા", "Market news"],
    correctAnswer: "Price trend ઓળખવા",
  },
  {
    id: 17,
    question: "Volume increase નો અર્થ શું હોઈ શકે?",
    options: ["Interest rate", "Strong buying/selling activity", "Dividend", "Tax increase"],
    correctAnswer: "Strong buying/selling activity",
  },
  {
    id: 18,
    question: "Stop Loss શું છે?",
    options: ["Profit target", "Loss limit", "Dividend", "Interest rate"],
    correctAnswer: "Loss limit",
  },
  {
    id: 19,
    question: "Golden Cross શું બતાવે છે?",
    options: ["Bearish trend", "Bullish signal", "Market crash", "Dividend"],
    correctAnswer: "Bullish signal",
  },
  {
    id: 20,
    question: "Doji Candlestick શું બતાવે છે?",
    options: ["Strong trend", "Market indecision", "High volume", "Breakout"],
    correctAnswer: "Market indecision",
  },
  {
    id: 21,
    question: "RBI Interest Rate વધે તો Market પર શું અસર?",
    options: ["Positive", "Negative pressure", "No impact", "Market close"],
    correctAnswer: "Negative pressure",
  },
  {
    id: 22,
    question: "Crude Oil price વધે તો કયા sector પર અસર?",
    options: ["IT", "Aviation", "Pharma", "FMCG"],
    correctAnswer: "Aviation",
  },
  {
    id: 23,
    question: "Dollar strong થાય તો કયો sector benefit?",
    options: ["IT Export companies", "Banking", "FMCG", "Cement"],
    correctAnswer: "IT Export companies",
  },
  {
    id: 24,
    question: "Budget Announcement Market ને કેવી રીતે અસર કરે?",
    options: ["No impact", "Sector wise impact", "Market close", "Stock freeze"],
    correctAnswer: "Sector wise impact",
  },
  {
    id: 25,
    question: "Dividend શું છે?",
    options: ["Company profit share to investors", "Loan", "Interest rate", "Tax"],
    correctAnswer: "Company profit share to investors",
  },
  {
    id: 26,
    question: "Long Term Investment નો અર્થ શું છે?",
    options: ["1 દિવસ", "1 અઠવાડિયું", "ઘણા વર્ષો સુધી investment", "1 કલાક"],
    correctAnswer: "ઘણા વર્ષો સુધી investment",
  },
  {
    id: 27,
    question: "Diversification શું છે?",
    options: ["Single stock investment", "Multiple sectors માં investment", "Cash holding", "Bond purchase"],
    correctAnswer: "Multiple sectors માં investment",
  },
  {
    id: 28,
    question: "Market Crash થાય ત્યારે સૌથી સારું શું કરવું?",
    options: ["Panic selling", "Analyse & disciplined decision", "Trading stop", "Random buy"],
    correctAnswer: "Analyse & disciplined decision",
  },
  {
    id: 29,
    question: "FOMO નો અર્થ શું છે?",
    options: ["Fear of Missing Out", "Fast Order Market Option", "Financial Market Order", "Fixed Option Method"],
    correctAnswer: "Fear of Missing Out",
  },
  {
    id: 30,
    question: "Successful Investor માટે સૌથી મહત્વની બાબત શું છે?",
    options: ["Luck", "Discipline & Patience", "Rumours", "Tips"],
    correctAnswer: "Discipline & Patience",
  },
];