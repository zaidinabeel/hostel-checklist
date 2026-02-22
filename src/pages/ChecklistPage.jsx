import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function ChecklistPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const { width, height } = useWindowSize();

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

  const toggleItem = async (item) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, completed: !i.completed } : i
      )
    );

    const { error } = await supabase
      .from("checklist_hostel")
      .update({ completed: !item.completed })
      .eq("id", item.id);

    if (error) fetchItems();
  };

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.text
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "" || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Group by category
  const grouped = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const total = items.length;
  const completed = items.filter((i) => i.completed).length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 relative">

      {percentage === 100 && <Confetti width={width} height={height} />}

      {/* Header */}
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

      {/* Search + Filter */}
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
          {[...new Set(items.map((i) => i.category))].map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="grid md:grid-cols-2 gap-8">
        {Object.keys(grouped).map((category) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:scale-[1.02] transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
              <span>{category}</span>
              <span className="text-sm text-white/50">
                {grouped[category].length} items
              </span>
            </h2>

            <ul className="space-y-3">
              {grouped[category].map((item) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
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
        ))}
      </div>
    </div>
  );
}