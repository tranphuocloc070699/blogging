import { TocItem } from "@/types/posts";

export const generateTOC = (content: string): TocItem[] => {
  if (!content) return [];
  try {
    const parsed = JSON.parse(content);
    const toc: TocItem[] = [];

    if (parsed.content) {
      parsed.content.forEach((node: any) => {
        if (node.type === 'heading' && node.content) {
          const title = node.content.map((c: any) => c.text).join('');
          const anchor = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

          toc.push({
            title,
            anchor,
            level: node.attrs?.level || 2,
          });
        }
      });
    }
    return toc;
  } catch {
    return [];
  }
};
