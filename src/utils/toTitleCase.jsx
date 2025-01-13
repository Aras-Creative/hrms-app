export function toTitleCase(str) {
  if (!str) return null;
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      if (word.length > 1 && !["and", "or", "the", "in", "on", "at", "a", "an", "of", "for"].includes(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word.toLowerCase();
      }
    })
    .join(" ");
}
