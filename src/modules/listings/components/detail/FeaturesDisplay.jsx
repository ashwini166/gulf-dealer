const FeaturesDisplay = ({ config, features }) => {
  if (!config || !features) return null;
  const getOptionValue = (option) => (typeof option === "string" ? option : option.value);
  const getFeatureLabel = (group, value) =>
    (group.options || []).find((option) => getOptionValue(option) === value)?.label || value;

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e5eaf1] bg-white">
      <div className="flex min-h-12 items-center border-b border-[#edf1f6] px-5 py-3">
        <h3 className="text-[13px] font-black text-[#202a3b]">Features &amp; Options</h3>
      </div>

      <div className="px-5 py-5">

      {config.featureGroups.map((group) => {
        const groupFeatures = features[group.key] || [];
        if (groupFeatures.length === 0) return null;

        return (
          <div key={group.key} className="mb-4 last:mb-0">
            <p className="mb-2 text-xs font-black text-[#202a3b]">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {groupFeatures.map((feature) => (
                <span
                  key={feature}
                  className="rounded-[7px] border border-[#e6ebf2] bg-[#f7f9fc] px-3 py-1.5 text-xs font-semibold text-[#657387]"
                >
                  {getFeatureLabel(group, feature)}
                </span>
              ))}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default FeaturesDisplay;
