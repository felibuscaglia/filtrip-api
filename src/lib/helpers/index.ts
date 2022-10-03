export const formatUrlSlug = (s: string) => {
  return s.toLowerCase().split(' ').join('-');
};
