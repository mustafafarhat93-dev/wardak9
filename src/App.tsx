import { useState, useRef, useEffect } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Map, 
  BookOpen, 
  Heart, 
  Calendar, 
  User, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Search, 
  Compass, 
  Flag, 
  X, 
  Send, 
  Loader2, 
  Languages, 
  Coins, 
  Info, 
  MapPin, 
  ChevronLeft,
  BookOpenCheck
} from "lucide-react";

import { Province, CultureItem, HistoryEvent, HistoricHero, ChatMessage } from "./types";
import { generalStats, provincesData, cultureData, historyEvents, historicHeroes, literatureMasters } from "./data";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [provinceSearch, setProvinceSearch] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  
  // Chat States
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "سلام او نیکه ورځ ولرئ! زه د افغانستان د هراړخیزې پوهنغونډ هوښیار مرستندوی یم. تاسو کولی شئ د هېواد د تاریخ، نامتو شخصیتونو، د ۳۴ ولایتونو جغرافيوي بډاینې او کلتور په اړه هر ډول پوښتنه له ما څخه په پښتو ژبه وپوښتئ. په څه کې درسره مرسته وکړم؟"
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Recommended questions for fast navigation
  const sampleQuestions = [
    "د احمدشاه بابا د زېږېدو او پاچهۍ په اړه ووایه؟",
    "کابلي پلاو یا افغاني خواړه څنګه جوړېږي؟",
    "د غزنوي امپراتورۍ د وخت د منارونو تاریخ څه دی؟",
    "د بند امیر رنګ ولې دومره شین او زړه راښکونکی دی؟",
    "په پښتو ادبیاتو کې د رحمان بابا پر ونډه خبرې وکړه."
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // Filter provinces based on search text (Pashto or English)
  const filteredProvinces = provincesData.filter(p => 
    p.name.includes(provinceSearch) || 
    p.capital.includes(provinceSearch) ||
    p.id.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  // Send message to Gemini server
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    setChatError(null);
    const userMessage: ChatMessage = { role: "user", text: textToSend };
    setChatMessages(prev => [...prev, userMessage]);
    
    if (!customMessage) {
      setChatInput("");
    }

    setIsChatLoading(true);

    try {
      // Map our React ChatMessage structure to what the server expects
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatMessages.slice(-6) // Send up to last 6 messages of context
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "تخنیکي ستونزه رامنځته شوه.");
      }

      setChatMessages(prev => [...prev, { role: "assistant", text: data.reply }]);
    } catch (e: any) {
      console.error(e);
      setChatError("بښنه غواړم، د ځواب ترلاسه کولو کې ستونزه راغله. مهرباني وکړئ لږ ځنډ وروسته بیا هڅه وکړئ.");
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans rtl-dir pb-16 flex flex-col" dir="rtl">
      
      {/* 🇦🇫 Gorgeous Banner / Header */}
      <header className="bg-gradient-to-r from-emerald-800 via-rose-700 to-slate-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <span className="bg-emerald-600 text-white p-2 rounded-lg text-sm font-bold tracking-widest animate-pulse border border-emerald-500">
                🇦🇫 د افغانستان ویاړ
              </span>
              <span className="text-sm text-yellow-400">په پښتو ژبه علمي او کلتوري پوهنغونډ</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 drop-shadow-md">
              افغانستان هراړخیزه پوهنغونډ
            </h1>
            <p className="text-emerald-100 text-sm md:text-base max-w-2xl font-light leading-relaxed">
              د ګران هېواد افغانستان د تاریخ، شانداره ۳۴ ولایتونو، بډایه کلتوري دودونو، ملي سمبولونو او رنګین ادبیات او هنر په اړه هر څه په یو ځای کې ولولئ.
            </p>
          </div>
          
          <div className="flex gap-3 bg-black/30 p-4 rounded-2xl border border-white/10 backdrop-blur-sm self-center">
            <div className="text-center px-4 border-l border-white/10 last:border-0">
              <div className="text-yellow-400 font-bold text-xl md:text-2xl">۳۴</div>
              <div className="text-xs text-slate-300">ولایتونه</div>
            </div>
            <div className="text-center px-4 border-l border-white/10 last:border-0">
              <div className="text-yellow-400 font-bold text-xl md:text-2xl">۵۰۰۰+</div>
              <div className="text-xs text-slate-300">کلن تاریخ</div>
            </div>
            <div className="text-center px-4">
              <div className="text-yellow-400 font-bold text-xl md:text-2xl">۴۲م.</div>
              <div className="text-xs text-slate-300">نفوس</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-3 no-scrollbar">
            {[
              { id: "overview", label: "عمومي معلومات", icon: Flag },
              { id: "provinces", label: "د ولایتونو لارښود", icon: Map },
              { id: "culture", label: "کلتور او دودونه", icon: Heart },
              { id: "history", label: "تاریخ او پاچاهان", icon: Calendar },
              { id: "literature", label: "شعر او ادبیات", icon: BookOpenCheck },
              { id: "qa", label: "هوښیار ملګری (AI)", icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // Clear selected province mode if switching tabs
                    if (tab.id !== "provinces") setSelectedProvince(null);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all text-sm whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/10 scale-105"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-yellow-400" : "text-slate-500"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 mt-8 flex-1 w-full">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <motion.div
              key="overview-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left & Middle Column: Stats and core facts */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Introduction speech */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-emerald-900">افغانستان په لږو کلمو کې</h2>
                  <p className="text-slate-700 leading-relaxed text-base mb-6">
                    افغانستان په سویل د مرکزي اسیا او منځني ختیځ په څلورلارې کې پروت غره ییز هېواد دی. دا هېواد د تاریخ په اوږدو کې د وریښمو د لارې او د لویو امپراتوریو د تېرېدو او نښلېدو اساسي ځای و، چې د همدې له امله د 'جرګو او مېړانیو وطن' بلل کېږي. د بېلابېلو کلتورونو، ژبو او قومونو په غېږ کې نږدې بې ساري یووالی لري.
                  </p>
                  
                  {/* Three pillars of national identity */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                      <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Flag className="w-5 h-5 text-yellow-300" />
                      </div>
                      <h4 className="font-bold text-emerald-900 mb-1">ملي یووالی</h4>
                      <p className="text-xs text-slate-600">افغانان د سختو تاریخي شيبو سره سره په خپل کلتور او مذهب یو لاس پاتې شوي.</p>
                    </div>
                    
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center">
                      <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Heart className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-rose-900 mb-1">میلمه پالنه</h4>
                      <p className="text-xs text-slate-600">د مېلمه درناوی د کوره نیولې تر دفتره د افغاني ژوند د بقا تر ټولو سپیڅلی قانون دی.</p>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                      <div className="w-10 h-10 bg-amber-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Award className="w-5 h-5 text-yellow-100" />
                      </div>
                      <h4 className="font-bold text-amber-900 mb-1">خپلواکي او مېړانه</h4>
                      <p className="text-xs text-slate-600">تاریخ ثابته کړې چې د افغانانو ننګ او د ازادۍ مینه د تسخیر وړ نه ده.</p>
                    </div>
                  </div>
                </div>

                {/* Sub Facts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Languages */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex gap-4 items-start">
                    <div className="bg-indigo-100 p-3 rounded-xl text-indigo-700">
                      <Languages className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">رسمي او ملي ژبې</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        د هېواد تر ټولو لویې او کلتوري ژبې <strong>پښتو</strong> او <strong>دري</strong> دي. پښتو د اکثریت خلکو د افهام او تفهیم، حماسي شعرونو او د جرګو ژبه ده چې بډای تاریخ لري.
                      </p>
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex gap-4 items-start">
                    <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
                      <Coins className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">ملي اسعار او بانکداري</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        د افغانستان پولي واحد <strong>افغانۍ (AFN)</strong> ده. د هېواد د معاملو او مرکزي بانک لخوا کنټرولېږي، چې نښه یې په بهرنیو اسعارو کې 'AFN' لیکل کېږي.
                      </p>
                    </div>
                  </div>

                  {/* Area */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex gap-4 items-start">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">جغرافیه او حدود</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        افغانستان <strong>۶۵۲,۸۶۴ تربع کلومیټره</strong> مساحت لري او یو وچې ایسار هیواد دی. دا هیواد د لوړو هندوکش، پامیر او بابا د غرونو لړۍ په ځان کې لري.
                      </p>
                    </div>
                  </div>

                  {/* Anthem / Core Icon */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex gap-4 items-start">
                    <div className="bg-rose-100 p-3 rounded-xl text-rose-700">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">ملي سمبولونه</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        د افغانستان ځانګړي سمبولونه عبارت دي له: د دښتې ملي ګل <strong>ريډی</strong> (لاله)، ملي ژوی <strong>ببر برفي</strong> او عاقل الوتونکی <strong>شاهین (عقاب)</strong>.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: General Snapshot Table */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <div className="text-center pb-6 border-b border-slate-100 mb-6">
                    <div className="inline-block bg-slate-100 rounded-2xl p-4 text-emerald-800 mb-1">
                      <Flag className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl text-slate-900">سریع ارقام او حقایق</h3>
                    <p className="text-xs text-slate-500">مهم ارقام په لنډه توګه</p>
                  </div>

                  {/* Stats list */}
                  <div className="space-y-4">
                    {[
                      { label: "پلازمېنه (مرکز)", value: generalStats.capital },
                      { label: "مساحت (ځمکه)", value: generalStats.area },
                      { label: "نفوس (نفوس اټکل)", value: generalStats.population },
                      { label: "رسمي ژبې", value: generalStats.languages },
                      { label: "دین", value: generalStats.religion },
                      { label: "د کرنې اسعار", value: generalStats.currency },
                      { label: "د خپلواکۍ کلیزه", value: generalStats.nationalDay },
                      { label: "دښتي ملي ګل", value: generalStats.nationalFlower },
                      { label: "ملي مرغه", value: generalStats.nationalBird },
                      { label: "ملي وحشي ژوی", value: generalStats.nationalAnimal },
                      { label: "ملي سپورت بډایه", value: generalStats.nationalSport },
                      { label: "ملي کلتوري رقص", value: generalStats.nationalDance },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-slate-100 last:border-0 last:pb-0">
                        <span className="text-slate-500">{item.label}</span>
                        <span className="font-bold text-slate-800 text-left">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Helper Banner */}
                <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-emerald-800">
                  <div className="absolute right-0 bottom-0 opacity-10">
                    <Sparkles className="w-40 h-40" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-yellow-400">لا زیات معلومات غواړئ؟</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    زموږ ځانګړی هوښیار مرستندوی ملګری کولای شي د افغانستان د بېلابېلو کلتوري رازونو په اړه ستاسو ټولو پوښتنو ته په پښتو ژبه مستند ځواب ووایي.
                  </p>
                  <button 
                    onClick={() => setActiveTab("qa")}
                    className="bg-emerald-600 hover:bg-emerald-500 transition-all text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <span>خبرې اترې پیل کړئ</span>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: PROVINCES GUIDE */}
          {activeTab === "provinces" && (
            <motion.div
              key="provinces-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col md:flex-row items-stretch gap-6 mb-8">
                {/* Search Province Control */}
                <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-3">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="د غوښتل شوي ولایت نوم ولیکئ (مثلاً: کابل، کندهار، بامیان...)"
                    value={provinceSearch}
                    onChange={(e) => setProvinceSearch(e.target.value)}
                    className="w-full bg-transparent border-0 outline-none focus:ring-0 text-slate-800 placeholder-slate-400 font-sans"
                  />
                  {provinceSearch && (
                    <button 
                      onClick={() => setProvinceSearch("")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Visual stats label */}
                <div className="bg-slate-150 py-4 px-6 rounded-2xl flex items-center gap-3 text-slate-700 bg-white border border-slate-200">
                  <MapPin className="w-5 h-5 text-emerald-800" />
                  <span className="text-sm font-medium">ښودل شوي ولایتونه: <strong className="text-emerald-800 text-lg font-bold">{filteredProvinces.length}</strong></span>
                </div>
              </div>

              {/* Grid of provinces */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProvinces.map((prov) => (
                  <motion.div
                    key={prov.id}
                    layoutId={`prov-card-${prov.id}`}
                    onClick={() => setSelectedProvince(prov)}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover:border-emerald-600 transition-all cursor-pointer hover:shadow-md group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg text-xs font-semibold">
                          مرکز: {prov.capital}
                        </span>
                        <MapPin className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
                        د {prov.name} ولایت
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                        {prov.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                      <span className="text-xs text-slate-400">نفوس: {prov.population}</span>
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                        تفصیل لیدل <ChevronLeft className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}

                {filteredProvinces.length === 0 && (
                  <div className="col-span-full py-16 text-center">
                    <p className="text-slate-500 text-lg">په دې نوم ولایت پیدا نه شو.</p>
                    <p className="text-xs text-slate-400 mt-1">مهرباني وکړئ د نوم د لیکلو بڼه بیا وګورئ.</p>
                  </div>
                )}
              </div>

              {/* Province Details Overlay Drawer / Modal card */}
              <AnimatePresence>
                {selectedProvince && (
                  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                      layoutId={`prov-card-${selectedProvince.id}`}
                      className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 text-slate-800 max-h-[85vh] flex flex-col"
                    >
                      {/* Modal header with colors */}
                      <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white p-6 relative">
                        <button
                          onClick={() => setSelectedProvince(null)}
                          className="absolute left-6 top-6 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <span className="text-xs text-yellow-300 tracking-wider font-bold mb-1 block">د افغانستان ولایتونه</span>
                        <h2 className="text-2xl md:text-3xl font-bold">د {selectedProvince.name} ولایت هراړخیزه پېژندنه</h2>
                      </div>

                      {/* Modal content area */}
                      <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
                        
                        {/* Summary description */}
                        <div>
                          <h4 className="font-bold text-emerald-900 mb-2 border-b border-emerald-100 pb-1 text-lg">عمومي پس منظر</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{selectedProvince.description}</p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-400 block mb-1">د ولایت مرکز (پلازمېنه)</span>
                            <strong className="text-slate-800 font-bold text-sm block">{selectedProvince.capital}</strong>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-400 block mb-1">د نفوس کچه</span>
                            <strong className="text-slate-800 font-bold text-sm block">{selectedProvince.population}</strong>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-400 block mb-1">طبیعي اقلیم</span>
                            <strong className="text-slate-800 font-bold text-sm block">{selectedProvince.climate}</strong>
                          </div>
                        </div>

                        {/* Agricultural wealth */}
                        <div>
                          <h4 className="font-bold text-emerald-900 mb-2 border-b border-emerald-100 pb-1 text-lg">عمده کرنیز محصولات او لاسته راوړنې</h4>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {selectedProvince.agriculturalProducts.map((prod, index) => (
                              <span key={index} className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-3.5 py-1.5 rounded-xl text-xs font-medium">
                                🌾 {prod}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Historic & Tourist Sites */}
                        <div>
                          <h4 className="font-bold text-emerald-900 mb-2 border-b border-emerald-100 pb-1 text-lg">تاریخي ابدات او د لیدلو ځایونه</h4>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {selectedProvince.historicSites.map((site, index) => (
                              <span key={index} className="bg-rose-50 text-rose-800 border border-rose-100 px-3.5 py-1.5 rounded-xl text-xs font-medium">
                                🕌 {site}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Modal footer */}
                      <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                        <button
                          onClick={() => {
                            const query = `د ${selectedProvince.name} ولایت د موندنو او تاریخ په اړه ډېر معلومات راکړه؟`;
                            setActiveTab("qa");
                            setSelectedProvince(null);
                            handleSendMessage(query);
                          }}
                          className="bg-emerald-800 hover:bg-emerald-700 text-white transition-all text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          د دې ولایت په اړه له AI وپوښتئ
                        </button>
                        
                        <button
                          onClick={() => setSelectedProvince(null)}
                          className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                        >
                          بیرته ګرځېدل
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

          {/* TAB 3: CULTURE & HERITAGE */}
          {activeTab === "culture" && (
            <motion.div
              key="culture-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-emerald-900 text-center">غني او رنګین افغاني کلتور</h2>
                <p className="text-slate-600 text-center text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
                  افغاني کلتور د پیړیو په اوږدو کې د مېړانې، اسلامي اصولو، او د مېلمه پالنې د عالي قوانینو تر چتر لاندې بڼه غوره کړې ده. پر افغانانو د کلتور ساتنه او پالنه د یو ستر مسؤلیت په توګه فرض ګڼل کیږي.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cultureData.map((culture) => {
                  return (
                    <div 
                      key={culture.id}
                      className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl border border-emerald-100">
                          {culture.iconName === "TrendingUp" && <TrendingUp className="w-6 h-6" />}
                          {culture.iconName === "Award" && <Award className="w-6 h-6" />}
                          {culture.iconName === "Heart" && <Heart className="w-6 h-6" />}
                          {culture.iconName === "Compass" && <Compass className="w-6 h-6" />}
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block">{culture.shortDescription}</span>
                          <h3 className="font-bold text-xl text-slate-900">{culture.title}</h3>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {culture.fullContent}
                      </p>

                      <button
                        onClick={() => {
                          setActiveTab("qa");
                          handleSendMessage(`د ${culture.title} په اړه نور کلتوري یا تاریخي معلومات راکړه؟`);
                        }}
                        className="text-emerald-800 hover:text-emerald-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        د دې کلتور د نورو رازونو په اړه له AI څخه غوښتنه <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 4: HISTORY & HEROES */}
          {activeTab === "history" && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              
              {/* Left & Center: Timeline of key events */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                  <h2 className="text-2xl font-bold text-emerald-950 mb-6 border-b border-slate-100 pb-3">تاریخي مهمې پړاوونه</h2>
                  
                  {/* Timeline representation */}
                  <div className="space-y-8 relative border-r-2 border-emerald-800/20 pr-4 mr-2">
                    {historyEvents.map((event, index) => (
                      <div key={index} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute right-[-23px] top-1 w-4 h-4 rounded-full bg-emerald-800 border-2 border-white shadow-sm" />
                        <div>
                          <span className="inline-block bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg px-2.5 py-0.5 text-xs font-bold mb-1.5 font-mono">
                            {event.year}
                          </span>
                          <h3 className="font-bold text-lg text-slate-900 mb-1">{event.title}</h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Note on Independence */}
                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex flex-col md:flex-row items-start gap-4">
                  <span className="text-3xl shrink-0">Independence</span>
                  <div>
                    <h4 className="font-bold text-rose-900 text-lg mb-1">د انګرېز له ښکېلاک څخه د مېړانې ازادي</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      افغانستان هیڅکله د بل لوی استعمار مستعمره پاتې نشو. غازي امان الله خان د زمري په ۲۸ مه په ۱۹۱۹ هـ ش کال کې د انګریزانو پروړاندې د دریم برید بریا اعلان او د هیواد برخلیک یې پخپلو منډو مستقل جوړ کړ.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right panel: Historic figures/heroes */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-slate-100 pb-2">تاریخي ویاړلي مشاهیر</h3>
                  
                  <div className="space-y-6">
                    {historicHeroes.map((hero, index) => (
                      <div key={index} className="group border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">{hero.name}</h4>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">{hero.lifeSpan}</span>
                        </div>
                        <span className="text-xs text-emerald-800 block mb-2 font-medium">{hero.role}</span>
                        <p className="text-slate-500 text-xs leading-relaxed mb-2">{hero.description}</p>
                        <p className="text-slate-600 text-xs font-semibold bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50">
                          {hero.achievements}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 5: LITERATURE & POETRY */}
          {activeTab === "literature" && (
            <motion.div
              key="literature-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-emerald-900">د پښتو شعر او الهام بڼ</h2>
                <p className="text-slate-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
                  پښتانه د تاریخ په اوږدو کې د تورو تر څنګ د قلم او کلام لوی خاوندان دي. د رحمان بابا او د خوشحال خان خټک کلمې نه یوازې حماسي دي بلکې د مخلصې کلتوري ځوانۍ او تصوفي راز لرونکي دي.
                </p>
              </div>

              {/* Master Poets Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {literatureMasters.map((poet, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs text-emerald-800 font-bold">{poet.role}</span>
                          <h3 className="font-bold text-xl text-slate-900 mt-1">{poet.name}</h3>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-xl font-mono">{poet.era}</span>
                      </div>

                      <div className="mb-4">
                        <strong className="text-xs text-slate-400 block mb-1">د شعر فلسفه:</strong>
                        <span className="text-sm font-medium text-slate-700">{poet.philosophy}</span>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative italic">
                        <span className="absolute right-4 top-2 text-3xl text-emerald-200/50 font-serif">“</span>
                        <p className="text-emerald-900 text-base leading-relaxed text-center py-2 relative z-10">
                          {poet.exampleVerse}
                        </p>
                        <span className="absolute left-4 bottom-2 text-3xl text-emerald-200/50 font-serif">”</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab("qa");
                        handleSendMessage(`د لوی شاعر ${poet.name} د ژوند کیسه، تګلاره او د هغه د دیوان په اړه لا ډېر معلومات راکړه؟`);
                      }}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors text-xs font-bold py-2.5 px-4 rounded-xl mt-6 text-center shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      د {poet.name} په اړه د AI څخه ډېر څه زده کړئ
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 6: AI CHAT ASSISTANT (Q&A) */}
          {activeTab === "qa" && (
            <motion.div
              key="qa-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              
              {/* Left Column: Quick queries suggestions */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-800" />
                    وړاندیز شوې پوښتنې
                  </h4>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    د چټ لپاره د چټک پیل بټن؛ په لاندې وړاندیز شویو غوښتنو کلیک وکړئ ترڅو سمدستي معتبر معلومات ومومئ:
                  </p>
                  
                  <div className="flex flex-col gap-2.5">
                    {sampleQuestions.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(query)}
                        disabled={isChatLoading}
                        className="text-right text-xs text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-200 transition-all p-3 rounded-xl border border-slate-100 disabled:opacity-50 cursor-pointer text-ellipsis overflow-hidden leading-normal"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Disclaimer box */}
                <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-5 text-slate-600 text-xs leading-relaxed">
                  <strong>پاملرنه:</strong> ځوابونه زموږ د هوښیار ملګري (Gemini AI) لخوا په ریښتیني وخت (Real-time) کې رامینځته کیږي. مهرباني وکړئ تل د تاریخي او ملي اثارو د کره والي تصدیق په اکاډمیک مأخذونو څخه وکړئ.
                </div>
              </div>

              {/* Chat Interface Column */}
              <div className="lg:col-span-3 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 h-[600px] overflow-hidden">
                
                {/* Chat header */}
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-600 p-2 rounded-xl text-yellow-300">
                      <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "3s" }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">هوښیار پوهنغونډ مرستندوی</h3>
                      <span className="text-[10px] text-emerald-400">آنلاین چمتو دی (پښتو ژبه)</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-400">Gemini 3.5 AI</span>
                </div>

                {/* Messages Body Scroll space */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                          msg.role === "user"
                            ? "bg-emerald-800 text-white rounded-br-none"
                            : "bg-white text-slate-800 border border-slate-100 rounded-bl-none text-right"
                        }`}
                      >
                        <div className="font-bold text-[10px] opacity-75 mb-1 text-slate-400">
                          {msg.role === "user" ? "تاسو (کاروونکی)" : "هوښیار ملګری"}
                        </div>
                        {/* Print answer with linebreaks to keep layout clean */}
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex justify-end">
                      <div className="bg-white text-slate-500 border border-slate-100 rounded-2xl rounded-bl-none p-4 max-w-[85%] shadow-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-800" />
                        <span className="text-xs">هوښیار ملګری ځواب تلواله کوي...</span>
                      </div>
                    </div>
                  )}

                  {chatError && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-xl text-xs text-center">
                      ⚠️ {chatError}
                    </div>
                  )}

                  {/* Ref point for scroll */}
                  <div ref={chatEndRef} />
                </div>

                {/* Message input footer */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-4 bg-white border-t border-slate-100 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="د افغانستان په اړه خپله پوښتنه په پښتو دلته ولیکئ..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none rounded-2xl py-3 px-4 text-sm text-slate-800 font-sans"
                    disabled={isChatLoading}
                  />
                  
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white transition-all p-3 rounded-2xl disabled:opacity-50 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </form>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer copyright */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div>د افغانستان هراړخیزه پښتو پوهنغونډ © ۲۰۲۶ م کال. ټول حقوق خوندي دي.</div>
          <div className="text-[10px] text-slate-300">جوړ شوی د علم، تاریخ او کلتور مینوالو لپاره.</div>
        </div>
      </footer>

    </div>
  );
}
