import {HighlightProps} from "../models";

export const getParentWithClass = (element: HTMLElement, className: string): HTMLElement | null => {
  if (element.classList.contains(className)) return element;
  if (element.parentElement) return getParentWithClass(element.parentElement, className);
  return null;
}

export const isWithinHighlight = (element: HTMLElement, highlight: HighlightProps): boolean => {
  const elementRect = element.getBoundingClientRect();
  const highlightRect = {
    top: highlight.y,
    left: highlight.x,
    bottom: highlight.y + highlight.height,
    right: highlight.x + highlight.width
  }

  return elementRect.top <= highlightRect.bottom && elementRect.bottom >= highlightRect.top && elementRect.left <= highlightRect.right && elementRect.right >= highlightRect.left
}
