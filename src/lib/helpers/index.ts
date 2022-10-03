export const formatUrlSlug = (s: string) => {
  return s.trim().toLowerCase().replace(/[.,]/g, '').replace(/[\s]/g, '-');
};
