import { content } from "@/repositories/content.repository";

export function getHistoryCopy() {
  return content.history;
}

export function getMilestones() {
  return [...content.milestones].sort((a, b) => a.order - b.order);
}

export function getHistoricalImages() {
  return [...content.historicalImages].sort((a, b) => a.order - b.order);
}
