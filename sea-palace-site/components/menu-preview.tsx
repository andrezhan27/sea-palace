import { useEffect, useRef, useState } from "react";
import { menuCategories } from "../lib/menu-categories";
import type { Language, RestaurantCopy } from "../lib/restaurant";
import { MenuCategoryPicker, MenuDishCard, menuDishImage } from "./menu-ui";
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

function adjacentPage(index: number, direction: number) {
  return (index + direction + menuPages.length) % menuPages.length;
}

export function MenuPreview({ copy, language }: { copy: RestaurantCopy; language: Language }) {
  const preview = useRef<HTMLDivElement>(null);
  const [isNearby, setIsNearby] = useState(false);
  const [{ pageIndex, animate }, setPage] = useState({ pageIndex: 0, animate: false });
  const { category, pageNumber, pageCount, dishes } = menuPages[pageIndex];

  useEffect(() => {
    if (!preview.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsNearby(true);
      observer.disconnect();
    }, { rootMargin: "240px 0px" });
    observer.observe(preview.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isNearby) return;
    for (const direction of [-1, 1]) {
      for (const [id] of menuPages[adjacentPage(pageIndex, direction)].dishes) {
        const image = new Image();
        image.fetchPriority = "low";
        image.src = menuDishImage(id);
      }
    }
  }, [isNearby, pageIndex]);

  function changeCategory(id: string) {
    const firstPage = menuPages.findIndex((page) => page.category.id === id);
    if (firstPage >= 0 && firstPage !== pageIndex) setPage({ pageIndex: firstPage, animate: true });
  }

  function movePage(direction: number) {
    setPage(({ pageIndex }) => ({ pageIndex: adjacentPage(pageIndex, direction), animate: true }));
  }

  return (
    <div className="shell menu-preview" ref={preview}>
      <div className="menu-preview-toolbar">
        <MenuCategoryPicker label={copy.menuCategories} language={language} value={category.id} onChange={changeCategory} />
        <div className="menu-preview-pagination">
          <button
            type="button"
            className="icon-button prev"
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
            className="icon-button"
            aria-label={copy.next}
            onClick={() => movePage(1)}
          >
            <Icon name="right" />
          </button>
        </div>
      </div>
      <div className={animate ? "menu-dishes menu-dishes-enter" : "menu-dishes"} key={pageIndex}>
        {dishes.map((dish) => <MenuDishCard key={dish[0]} dish={dish} language={language} eager={animate} />)}
      </div>
    </div>
  );
}
