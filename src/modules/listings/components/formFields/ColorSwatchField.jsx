const ColorSwatchField = ({ value, onChange, swatches, error }) => {
  const hexLabelMap = {
    "#ffffff": "White",
    "#0f172a": "Black",
    "#64748b": "Dark Grey",
    "#94a3b8": "Grey",
    "#1e3a8a": "Navy Blue",
    "#2563eb": "Blue",
    "#0891b2": "Cyan",
    "#dc2626": "Red",
    "#7c2d12": "Brown",
    "#16a34a": "Green",
    "#166534": "Dark Green",
    "#ca8a04": "Gold",
    "#facc15": "Yellow",
    "#ea580c": "Orange",
    "#7c3aed": "Purple",
  };

  const getSwatchLabel = (color) => {
    const rawValue = typeof color === "string" ? color : color.value;
    const label = typeof color === "string" ? color : color.label;
    const normalizedHex = String(rawValue || "").toLowerCase();

    return label || hexLabelMap[normalizedHex] || rawValue;
  };

  const getSwatchColor = (color) => {
    const rawValue = typeof color === "string" ? color : color.value;
    const label = getSwatchLabel(color);
    const explicitColor = typeof color === "string" ? "" : color.color;
    const normalized = String(label || rawValue || "").toLowerCase();

    if (explicitColor) return explicitColor;
    if (String(rawValue || "").startsWith("#")) return rawValue;

    const colorMap = {
      beige: "#d6bf98",
      black: "#0f172a",
      blue: "#2563eb",
      bronze: "#b45309",
      brown: "#92400e",
      burgundy: "#7f1d1d",
      camel: "#c58b45",
      "carbon black": "#111827",
      "carbon grey": "#4b5563",
      "carbon gray": "#4b5563",
      champagne: "#d9c6a5",
      charcoal: "#374151",
      chrome: "#d1d5db",
      cognac: "#9a4f13",
      cream: "#f3ead7",
      gold: "#eab308",
      green: "#15803d",
      grey: "#94a3b8",
      gray: "#94a3b8",
      ivory: "#f8f1df",
      khaki: "#a3a380",
      maroon: "#7f1d1d",
      "matte black": "#020617",
      "matte grey": "#64748b",
      "matte gray": "#64748b",
      "metallic blue": "#1d4ed8",
      "metallic grey": "#94a3b8",
      "metallic gray": "#94a3b8",
      "metallic red": "#dc2626",
      mocha: "#6b3f25",
      navy: "#172554",
      "navy blue": "#172554",
      "olive green": "#556b2f",
      orange: "#f97316",
      pearl: "#f8fafc",
      "pearl black": "#111827",
      "pearl white": "#f8fafc",
      pink: "#f9a8d4",
      purple: "#7c3aed",
      "racing blue": "#1d4ed8",
      "racing green": "#166534",
      "racing red": "#b91c1c",
      red: "#ef4444",
      sand: "#d8c19f",
      silver: "#cbd5e1",
      tan: "#c19a6b",
      titanium: "#8b8c89",
      white: "#ffffff",
      yellow: "#eab308",
    };

    return (
      colorMap[normalized] ||
      colorMap[normalized.replace(/^dark\s+/, "")] ||
      colorMap[normalized.replace(/^light\s+/, "")] ||
      "#e5e7eb"
    );
  };

  return (
    <div className={`flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 ${error ? "ring-2 ring-red-400 ring-offset-1" : ""}`}>
      {swatches.map((color) => {
        const optionValue = typeof color === "string" ? color : color.value;
        const label = getSwatchLabel(color);
        const isSelected = value === label || value === optionValue;
        const fillColor = getSwatchColor(color);

        return (
          <span key={optionValue} className="group relative inline-flex flex-col items-center">
            <button
              type="button"
              onClick={() => onChange(label)}
              style={{ backgroundColor: fillColor }}
              className={`h-8 w-8 shrink-0 rounded-full border-2 shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSelected ? "border-white ring-2 ring-blue-600 ring-offset-2" : "border-slate-300 hover:scale-105 hover:border-slate-400"
              }`}
              aria-label={label}
              title={label}
            />
            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[11px] font-semibold text-white shadow-lg group-hover:block group-focus-within:block">
              {label}
            </span>
          </span>
        );
      })}
      {value ? (
        <span className="ml-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          {value}
        </span>
      ) : null}
    </div>
  );
};

export default ColorSwatchField;
