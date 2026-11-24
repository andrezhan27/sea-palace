import { useState } from "react";
import { menuCategories } from "../lib/menu-categories";
import type { Language, RestaurantCopy } from "../lib/restaurant";
import { MenuCategoryPicker, MenuDishCard } from "./menu-ui";
import { Icon } from "./site-ui";

const dishesPerPage = 4;
const menuPages = menuCategories.flatMap((category) => {
  const pageCount = Math.ceil(category.dishes.length / dishesPerPage);

  return Array.from({ length: pageCount }, (_, page) => ({
    category,
    pageNumber: page + 1,
    pageCount,
    dishes: category.dishes.slice(page * dishesPerPage, (page + 1) * dishesPerPage),
  }));
});

export function MenuPreview({ copy, language }: { copy: RestaurantCopy; language: Language }) {
  const [pageIndex, setPageIndex] = useState(0);
  const { category, pageNumber, pageCount, dishes } = menuPages[pageIndex];

  function changeCategory(id: string) {
    const firstPage = menuPages.findIndex((page) => page.category.id === id);
    if (firstPage >= 0) setPageIndex(firstPage);
  }

  function movePage(direction: number) {
    setPageIndex((current) => (current + direction + menuPages.length) % menuPages.length);
  }

  return (
    <div className="shell menu-preview">
      <div className="menu-preview-toolbar">
        <MenuCategoryPicker label={copy.menuCategories} language={language} value={category.id} onChange={changeCategory} />
        <div className="menu-preview-pagination">
          <button
            type="button"
            className="round-button prev"
            aria-label={copy.previous}
            onClick={() => movePage(-1)}
          >
            <Icon name="right" />
          </button>
          <p role="status" aria-atomic="true">
            <span className="sr-only">{category[language]}. {copy.menuPreviewPage} </span>
            {pageNumber} / {pageCount}
          </p>
          <button
            type="button"
            className="round-button"
            aria-label={copy.next}
            onClick={() => movePage(1)}
          >
            <Icon name="right" />
          </button>
        </div>
      </div>
      <div className="menu-dishes">
        {dishes.map((dish) => <MenuDishCard key={dish[0]} dish={dish} language={language} />)}
      </div>
    </div>
  );
}
