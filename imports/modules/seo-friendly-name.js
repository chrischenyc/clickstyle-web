/**
 * Convert service or add-on name to SEO friendly URL part
 * e.g.: "Full Face Makeup" -> "full-face-makeup", "Cut & Side Design" -> 'cut-and-side-design'
 *
 * @param {original name} name
 */
const SEOFriendlyName = name =>
  name
    .replace(/ /g, '-')
    .replace(/---/g, '-')
    .replace(/&/g, 'and')
    .toLowerCase();

export default SEOFriendlyName;
