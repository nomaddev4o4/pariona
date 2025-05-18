import { BadgePercent } from "lucide-react";

export default function BrandLogo() {
  return (
    <span className="flex items-center justify-center shrink-0 gap-1 text-2xl font-brand">
      <BadgePercent strokeWidth={1.5} />
      Pariona
    </span>
  );
}
