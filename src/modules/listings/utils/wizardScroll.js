export const scrollElementIntoWizardView = (target) => {
  if (!target) return;

  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    window.setTimeout(() => {
      const focusTarget =
        target.matches?.("input, select, textarea, button") ?
          target :
          target.querySelector?.("input:not([type='hidden']), select, textarea, button");

      focusTarget?.focus?.({ preventScroll: true });
    }, 250);
  });
};

export const scrollFirstWizardError = (refs, orderedKeys, errors) => {
  const firstErrorKey = orderedKeys.find((key) => errors[key]);
  if (firstErrorKey) {
    scrollElementIntoWizardView(refs.current?.[firstErrorKey]);
  }
};
