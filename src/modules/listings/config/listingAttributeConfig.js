const normalizeToken = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const normalizeListingAttributeOption = (option) => {
  if (typeof option === "string") {
    return { value: normalizeToken(option), label: option };
  }

  return {
    value: option?.value || normalizeToken(option?.label || ""),
    label: option?.label || option?.value || "",
    color: option?.color,
  };
};

const buildAttributeMap = (attributes = []) =>
  new Map((attributes || []).filter((attribute) => attribute?.key).map((attribute) => [attribute.key, attribute]));

const mergeField = (field, attributeMap) => {
  const attribute = attributeMap.get(field.name);

  if (!attribute) return field;

  const options = (attribute.options || []).map(normalizeListingAttributeOption).filter((option) => option.value);
  const nextField = {
    ...field,
    label: attribute.label || field.label,
    required: Boolean(attribute.isRequired),
  };

  if (!options.length) return nextField;

  if (field.type === "colorSwatch") {
    return { ...nextField, swatches: options };
  }

  if (["select", "toggle2", "toggle3"].includes(field.type)) {
    return { ...nextField, options };
  }

  return nextField;
};

export const mergeListingAttributesIntoConfig = (config, attributes = []) => {
  const attributeMap = buildAttributeMap(attributes);

  return {
    ...config,
    vehicleInfoFields: (config.vehicleInfoFields || []).map((field) => mergeField(field, attributeMap)),
    specsFields: (config.specsFields || []).map((field) => mergeField(field, attributeMap)),
    featureGroups: (config.featureGroups || []).map((group) => {
      const attribute = attributeMap.get(group.key);
      if (!attribute) return group;

      const options = (attribute.options || [])
        .map(normalizeListingAttributeOption)
        .filter((option) => option.value);

      return {
        ...group,
        label: attribute.label || group.label,
        required: Boolean(attribute.isRequired),
        options: options.length ? options : group.options,
      };
    }),
  };
};

export const getOptionDisplayLabel = (options = [], value) => {
  if (value === undefined || value === null || value === "") return "";

  const normalizedValue = normalizeToken(value);
  const match = (options || []).map(normalizeListingAttributeOption).find((option) => {
    return (
      option.value === value ||
      option.value === normalizedValue ||
      normalizeToken(option.value) === normalizedValue ||
      normalizeToken(option.label) === normalizedValue
    );
  });

  return match?.label || String(value);
};
