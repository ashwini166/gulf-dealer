import { useEffect, useMemo, useState } from "react";

import { getListingAttributeOptionsApi } from "../api/catalogApi";
import { mergeListingAttributesIntoConfig } from "../config/listingAttributeConfig";

export const useListingAttributeConfig = (categoryId, baseConfig) => {
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    let isMounted = true;

    if (!categoryId) {
      const timeoutId = window.setTimeout(() => {
        if (isMounted) setAttributes([]);
      }, 0);

      return () => {
        isMounted = false;
        window.clearTimeout(timeoutId);
      };
    }

    getListingAttributeOptionsApi({ categoryId, isActive: true })
      .then((data) => {
        if (isMounted) setAttributes(data || []);
      })
      .catch(() => {
        if (isMounted) setAttributes([]);
      });

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  const config = useMemo(
    () => mergeListingAttributesIntoConfig(baseConfig, attributes),
    [baseConfig, attributes],
  );

  return { config, attributes };
};
