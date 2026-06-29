export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

export const truncate = (text, maxLength = 150) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const calculateReadingTime = (content) => {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / 200);
};
