import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

const CollapsibleFeatureGroup = ({ title, options, selectedValues, onToggle, defaultOpen = true }) => {
  const selected = Array.isArray(selectedValues) ? selectedValues : [];
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [search, setSearch] = useState("");
  const getOptionValue = (option) => (typeof option === "string" ? option : option.value);
  const getOptionLabel = (option) => (typeof option === "string" ? option : option.label);

  const filteredOptions = (options || []).filter((option) =>
    getOptionLabel(option).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-150 hover:bg-slate-50"
      >
        <span className="text-sm font-semibold text-slate-900">
          {title}
          {selected.length > 0 && (
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {selected.length}
            </span>
          )}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      <div className="grid transition-all duration-300 ease-in-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-4 py-4">
            <div className="relative mb-3">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search features..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filteredOptions.map((option) => {
                const optionValue = getOptionValue(option);
                const optionLabel = getOptionLabel(option);
                const isSelected = selected.includes(optionValue);
                return (
                  <button
                    key={optionValue}
                    type="button"
                    onClick={() => onToggle(optionValue)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95 ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {optionLabel}
                  </button>
                );
              })}
              {filteredOptions.length === 0 && (
                <p className="text-xs text-slate-400">No matching features</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleFeatureGroup;
