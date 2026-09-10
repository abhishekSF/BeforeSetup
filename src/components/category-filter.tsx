import type { CategoryId } from "@/data/types";
import { categories } from "@/data/categories";
import { categoryHex } from "@/lib/category-colors";

export function CategoryFilter({ value, onChange }: {
  value: CategoryId | null;
  onChange: (value: CategoryId | null) => void;
}) {
  return <div className="category-filter" role="group" aria-label="Filter by area">
    <button type="button" aria-pressed={value === null} onClick={() => onChange(null)}>All areas</button>
    {categories.map((category) => <button type="button" key={category.id}
      data-category={category.id} aria-pressed={value === category.id}
      onClick={() => onChange(value === category.id ? null : category.id)}>
      <span aria-hidden="true" style={{ background: categoryHex[category.id] }} />{category.label}
    </button>)}
  </div>;
}
