"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { RestaurantCopy } from "../lib/restaurant";
import { Icon } from "./site-ui";

type CarouselProps = {
  name: "food" | "review";
  label: string;
  copy: RestaurantCopy;
  speed: number;
  items: { key: string; content: ReactNode }[];
};

export function Carousel({ name, label, copy, speed, items }: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const controls = useRef<{ move: (direction: number) => void; pause: (paused: boolean) => void }>(null);
  const loops = items.length > 1;

  useEffect(() => {
    setPaused(false);
    if (!loops || !viewportRef.current || !trackRef.current) return;

    const viewport = viewportRef.current;
    const track = trackRef.current;
    const first = track.querySelector<HTMLElement>(".carousel-item");
    const firstClone = track.querySelector<HTMLElement>("[data-clone]");
    if (!first || !firstClone) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const listeners = new AbortController();
    const options = { signal: listeners.signal };

    let period = 0;
    let position = 0;
    let rendered = 0;
    let velocity = 0;
    let stepRemaining = 0;
    let lastFrame = 0;
    let frame = 0;
    let visible = false;
    let isPaused = false;
    let drag: { id: number; x: number; time: number } | null = null;

    function setPosition(value: number) {
      position = reduced.matches || period <= 0
        ? Math.max(0, Math.min(viewport.scrollWidth - viewport.clientWidth, value))
        : ((value % period) + period) % period;
      viewport.scrollLeft = position;
      rendered = viewport.scrollLeft;
    }

    function schedule() {
      if (!frame && visible && !document.hidden && !reduced.matches) {
        frame = requestAnimationFrame(animate);
      }
    }

    function animate(now: number) {
      frame = 0;
      const deltaTime = lastFrame ? Math.min(now - lastFrame, 34) : 16;
      lastFrame = now;

      if (Math.abs(viewport.scrollLeft - rendered) >= 1) {
        position = viewport.scrollLeft;
        velocity = 0;
        stepRemaining = 0;
      }

      if (!drag) {
        const step = stepRemaining * Math.min(deltaTime / 94, 1);
        stepRemaining -= step;
        if (Math.abs(stepRemaining) < 0.5) stepRemaining = 0;

        const autoplay = isPaused ? 0 : speed * deltaTime / 1000;
        setPosition(position + autoplay + velocity * deltaTime + step);
        velocity *= Math.exp(-deltaTime / 177);
        if (Math.abs(velocity) < 0.014) velocity = 0;
      }

      if (!isPaused || drag || velocity || stepRemaining) schedule();
      else lastFrame = 0;
    }

    function measure() {
      if (!first || !firstClone) return;
      period = firstClone.offsetLeft - first.offsetLeft;
      setPosition(viewport.scrollLeft);
      schedule();
    }

    function stopMotion() {
      velocity = 0;
      stepRemaining = 0;
      lastFrame = 0;
    }

    function move(direction: number) {
      if (!first) return;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      const distance = direction * (first.offsetWidth + gap);
      if (reduced.matches) {
        setPosition(viewport.scrollLeft + distance);
      } else {
        stepRemaining += distance;
        velocity = 0;
        schedule();
      }
    }

    controls.current = {
      move,
      pause(next) {
        isPaused = next;
        stopMotion();
        schedule();
      },
    };

    viewport.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    }, options);

    viewport.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, time: event.timeStamp };
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add("is-dragging");
      stopMotion();
      position = viewport.scrollLeft;
      schedule();
    }, options);

    viewport.addEventListener("pointermove", (event) => {
      if (!drag || drag.id !== event.pointerId) return;
      const distance = drag.x - event.clientX;
      const deltaTime = Math.max(8, event.timeStamp - drag.time);
      setPosition(position + distance);
      velocity = 0.55 * velocity + 0.45 * Math.max(-2, Math.min(2, distance / deltaTime));
      drag.x = event.clientX;
      drag.time = event.timeStamp;
    }, options);

    function release(event: PointerEvent) {
      if (!drag || drag.id !== event.pointerId) return;
      if (reduced.matches || event.type === "pointercancel" || event.timeStamp - drag.time > 95) velocity = 0;
      drag = null;
      viewport.classList.remove("is-dragging");
      schedule();
    }

    viewport.addEventListener("pointerup", release, options);
    viewport.addEventListener("pointercancel", release, options);
    viewport.addEventListener("lostpointercapture", release, options);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastFrame = 0;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      schedule();
    });
    intersection.observe(viewport);

    const resize = new ResizeObserver(measure);
    resize.observe(viewport);
    reduced.addEventListener("change", () => {
      cancelAnimationFrame(frame);
      frame = 0;
      stopMotion();
      measure();
    }, options);
    document.addEventListener("visibilitychange", () => {
      lastFrame = 0;
      schedule();
    }, options);

    measure();
    return () => {
      controls.current = null;
      listeners.abort();
      intersection.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      viewport.classList.remove("is-dragging");
    };
  }, [loops, speed]);

  const pausePlayback = () => {
    controls.current?.pause(!paused);
    setPaused(!paused);
  };

  return (
    <div className={`carousel shell ${name === "review" ? "review-carousel" : ""}`}>
      <div ref={viewportRef} className="carousel-viewport" tabIndex={0} role="region" aria-label={label}>
        <div ref={trackRef} className={`carousel-track flex items-stretch ${name}-track`}>
          {items.map(({ key, content }) => <div className="carousel-item" key={key}>{content}</div>)}
          {loops && items.map(({ key, content }) => (
            <div className="carousel-item" key={`clone-${key}`} data-clone="" aria-hidden="true" inert>
              {content}
            </div>
          ))}
        </div>
      </div>
      {loops && (
        <div className="carousel-controls mt-[17px] flex justify-end gap-[7px]">
          <button type="button" className="round-button prev" onClick={() => controls.current?.move(-1)} aria-label={copy.previous}>
            <Icon name="right" />
          </button>
          <button type="button" className="round-button" data-pause onClick={pausePlayback} aria-label={paused ? copy.play : copy.pause}>
            <Icon name={paused ? "play" : "pause"} />
          </button>
          <button type="button" className="round-button" onClick={() => controls.current?.move(1)} aria-label={copy.next}>
            <Icon name="right" />
          </button>
        </div>
      )}
    </div>
  );
}
