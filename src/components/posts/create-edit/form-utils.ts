export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// export const generateTableOfContents = (content: string) => {
//   const headingRegex = /^(#{1,6})\s+(.+)$/gm;
//   const toc = [];
//   let match;

//   while ((match = headingRegex.exec(content)) !== null) {
//     const level = match[1].length;
//     const text = match[2].trim();
//     const id = generateSlug(text);

//     toc.push({
//       level,
//       text,
//       id,
//     });
//   }

//   return toc;
// };