import { menuCategories, type MenuDish } from "../lib/menu-categories";
import type { Language } from "../lib/restaurant";
import { Icon } from "./site-ui";

export function MenuCategoryPicker({ label, language, value, onChange }: {
  label: string;
  language: Language;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="menu-category-picker">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {menuCategories.map((category) => (
          <option value={category.id} key={category.id}>{category[language]}</option>
        ))}
      </select>
      <Icon name="chevron" />
    </label>
  );
}

export function MenuDishCard({ dish: [image, pt, en], language, eager = false }: {
  dish: MenuDish;
  language: Language;
  eager?: boolean;
}) {
  return (
    <article className="menu-dish">
      <img src={`/assets/menu/dishes/${image}.webp`} alt="" decoding="async" loading={eager ? "eager" : "lazy"} />
      <h3>{language === "pt" ? pt : en}</h3>
    </article>
  );
}
