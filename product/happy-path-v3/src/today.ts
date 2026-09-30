import { thisWeek } from "@/data";
import type { Walk } from "@/walk";

export const words = ["No", "One", "Two", "Three", "Four", "Five", "Six"];

/** How many of the six are still going out, once Jenna's skips are taken off. */
export const going = (walk: Walk) => thisWeek.filter((h) => !walk.skipped.includes(h.id)).length;
