import type { WebPageSection } from "@/types/webpage.type";

export function getImagesFromSection(section?: WebPageSection | null) {
  if (!section) return [];

  return section.fields
    .filter((field) => field.type === "IMAGE")
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
    .map((field) => ({
      id: field.id,
      url: field.file?.url || field.value || "",
    }))
    .filter((image) => image.url);
}
