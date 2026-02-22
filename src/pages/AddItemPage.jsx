import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AddItemPage() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("checklist_hostel")
      .select("*")
      .order("created_at", { ascending: true });

    setItems(data || []);

    const uniqueCategories = [
      ...new Set((data || []).map((item) => item.category)),
    ];
    setCategories(uniqueCategories);
  };

  const formatCategory = (value) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const addItem = async () => {
    if (!text || !category) return;

    const formattedCategory = formatCategory(category);
    const formattedText = text.trim();

    const { data: existing } = await supabase
      .from("checklist_hostel")
      .select("*")
      .ilike("text", formattedText);

    if (existing.length > 0) {
      alert("Item already exists!");
      return;
    }

    await supabase.from("checklist_hostel").insert([
      {
        text: formattedText,
        category: formattedCategory,
        completed: false,
      },
    ]);

    setText("");
    setCategory("");
    fetchItems();
  };

  const deleteItem = async (id) => {
    await supabase
      .from("checklist_hostel")
      .delete()
      .eq("id", id);

    fetchItems();
  };

  // GROUP ITEMS BY CATEGORY
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">

      <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
        ✨ Manage Checklist
      </h2>

      {/* ADD SECTION */}
      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mb-16">

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Item name"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-4 rounded-xl bg-white/10 outline-none"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 p-4 rounded-xl bg-white/10"
          >
            <option value="">Select category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Or new category"
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 p-4 rounded-xl bg-white/10"
          />
        </div>

        <button
          onClick={addItem}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-[1.02] transition"
        >
          Add Item
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="space-y-12">
        {Object.keys(grouped).map((cat) => (
          <div key={cat} className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">

            <h3 className="text-xl font-semibold mb-6 flex justify-between">
              <span>{cat}</span>
              <span className="text-white/50 text-sm">
                {grouped[cat].length} items
              </span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-white/50 text-sm border-b border-white/10">
                    <th className="py-3">Item</th>
                    <th className="py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {grouped[cat].map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-3">{item.text}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-400 hover:text-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}