import { Car, Bike, Truck, Hash, Caravan, HardHat, Store } from "lucide-react";

const iconMatchers = [
  { pattern: /motercycle|motorcycle/i, icon: Bike },
  { pattern: /heavy|equipment/i, icon: HardHat },
  { pattern: /special number/i, icon: Hash },
  { pattern: /buggy/i, icon: Truck },
  { pattern: /carvaan|caravan/i, icon: Caravan },
  { pattern: /commercial/i, icon: Truck },
  { pattern: /showroom|dealer/i, icon: Store },
];

const CategoryIcon = ({ name, size = 22, className = "" }) => {
  const match = iconMatchers.find((item) => item.pattern.test(name || ""));
  const Icon = match?.icon || Car;

  return <Icon size={size} className={className} />;
};

export default CategoryIcon;
