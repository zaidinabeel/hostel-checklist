import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function ChecklistPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [message, setMessage] = useState("");
  const [toggleConfetti, setToggleConfetti] = useState(false);

  const { width, height } = useWindowSize();

  /* ============================
     💖 MESSAGE POOLS
  ============================ */

  const romanticMessages = [
    "You’re glowing differently lately 💖",
    "Soft heart, strong future 🌷",
    "You make progress look pretty ✨",
    "Prepared girls are dangerous 💕",
    "This is your soft power era 🌸",
    "Future you is smiling right now 💌",
    "Baemax believes in you 🤍",
    "You’re building something beautiful 💫",
    "You deserve this calm confidence 🌷",
    "Organised and irresistible energy 💖"
  ];

  const motivationalMessages = [
    "Discipline > mood 💪",
    "Consistency is sexy 😌",
    "That’s how winners move 🏆",
    "Future doctor loading… 🩺",
    "You’re becoming unstoppable 💥",
    "Every tick builds your empire 📈",
    "Momentum unlocked ✨",
    "Small steps. Big glow-up.",
    "You’re ahead of most people already 💼",
    "Execution level: elite 👑"
  ];

  const chaoticMessages = [
    "CHECKLIST FEARS YOU NOW 😈",
    "PRODUCTIVITY QUEEN ACTIVATED 👑💅",
    "Baemax did a happy dance 🤍💃",
    "You just defeated procrastination 💥",
    "THE GLOW-UP IS REAL ✨🔥",
    "Hostel era can’t handle you 😌",
    "SLAYED. PERIOD. 💅",
    "Your ambition just got louder 📢",
    "LEVEL UP +100 XP 🎮",
    "WHO IS THIS ORGANISED LEGEND??"
  ];

  /* ============================
     🔄 FETCH + REALTIME
  ============================ */

  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel("realtime-checklist")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "checklist_hostel" },
        () => fetchItems()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("checklist_hostel")
      .select("*")
      .order("created_at", { ascending: true });

    setItems(data || []);
  };

  /* ============================
     ✅ TOGGLE WITH CONFETTI + EMOTION
  ============================ */

  const toggleItem = async (item) => {
    const newCompleted = !item.completed;

    // Optimistic UI
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, completed: newCompleted } : i
      )
    );

    if (newCompleted) {
      // 🎉 Confetti for 3 seconds
      setToggleConfetti(true);
      setTimeout(() => setToggleConfetti(false), 3000);

      // 💖 Emotional message
      let pool;
      const randomType = Math.random();

      if (randomType < 0.5) {
        pool = romanticMessages;
      } else if (randomType < 0.85) {
        pool = motivationalMessages;
      } else {
        pool = chaoticMessages;
      }

      const random =
        pool[Math.floor(Math.random() * pool.length)];

      setMessage(random);

      setTimeout(() => {
        setMessage("");
      }, 2500);
    }

    await supabase
      .from("checklist_hostel")
      .update({ completed: newCompleted })
      .eq("id", item.id);
  };

  /* ============================
     🔍 FILTERING
  ============================ */

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.text
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "" || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const grouped = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  /* ============================
     📊 GLOBAL PROGRESS
  ============================ */

  const total = items.length;
  const completed = items.filter((i) => i.completed).length;
  const percentage = total
    ? Math.round((completed / total) * 100)
    : 0;

  /* ============================
     UI
  ============================ */

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 relative">

      {/* 🎉 Confetti on every toggle (3s) */}
      {toggleConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={250}
          gravity={0.3}
          recycle={false}
        />
      )}

      {/* 🎉 Confetti at 100% */}
      {percentage === 100 && (
        <Confetti width={width} height={height} />
      )}

      {/* HEADER */}
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          🌸 Hostel Prep Checklist
        </h1>

        <div className="w-full bg-white/10 rounded-full h-5 backdrop-blur-xl">
          <div
            className="h-5 rounded-full transition-all duration-700 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="mt-4 text-white/70 text-lg">
          {percentage}% Completed ✨
        </p>
      </div>

      {/* Floating Encouragement */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 
                     bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20
                     backdrop-blur-2xl 
                     px-8 py-4 
                     rounded-full 
                     border border-white/20 
                     text-white 
                     shadow-2xl 
                     z-50"
        >
          {message}
        </motion.div>
      )}

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-white/10 outline-none"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-3 rounded-xl bg-white/10"
        >
          <option value="">All Categories</option>
          {[...new Set(items.map((i) => i.category))].map(
            (cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            )
          )}
        </select>
      </div>

      {/* CATEGORY CARDS */}
      <div className="grid md:grid-cols-2 gap-8">
        {Object.keys(grouped).map((category) => {
          const categoryItems = grouped[category];
          const catTotal = categoryItems.length;
          const catCompleted = categoryItems.filter(
            (i) => i.completed
          ).length;
          const catPercent = catTotal
            ? Math.round((catCompleted / catTotal) * 100)
            : 0;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] ${
                catPercent === 100
                  ? "ring-2 ring-pink-500"
                  : ""
              }`}
            >
              <h2 className="text-xl font-semibold mb-4 flex justify-between">
                <span>{category}</span>
                <span className="text-sm text-white/50">
                  {catTotal} items
                </span>
              </h2>

              {/* Category Progress */}
              <div className="mb-6">
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${catPercent}%` }}
                  />
                </div>
                <p className="text-sm text-white/50 mt-2">
                  {catPercent}% complete
                </p>
              </div>

              <ul className="space-y-3">
                {categoryItems.map((item) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(item)}
                      className="w-5 h-5 accent-pink-500 cursor-pointer"
                    />
                    <span
                      className={`transition-all duration-300 ${
                        item.completed
                          ? "line-through opacity-50 text-white/50"
                          : "hover:text-pink-300"
                      }`}
                    >
                      {item.text}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}