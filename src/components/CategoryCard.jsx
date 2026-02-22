import { motion } from "framer-motion";

export default function CategoryCard({ category, checkedItems, toggleItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-5">
        {category.title}
      </h2>

      <ul className="space-y-3 text-sm sm:text-base">
        {category.items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={checkedItems.includes(item)}
              onChange={() => toggleItem(item)}
              className="accent-purple-500 w-4 h-4"
            />
            <span
              className={`transition-all ${
                checkedItems.includes(item)
                  ? "line-through opacity-50"
                  : ""
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}