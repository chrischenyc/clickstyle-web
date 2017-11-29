const services = require('./services-addons.json');

/**
 * Convert service or add-on name to SEO friendly URL part
 * e.g.: "Full Face Makeup" -> "full-face-makeup", "Cut & Side Design" -> 'cut-and-side-design'
 *
 * @param {name name} original name
 */
export const ServiceNameToSEOName = (name) => {
  // look for raw data table
  let seoName = null;

  services.some((service) => {
    if (service.name === name && service.seoNames && service.seoNames.length > 0) {
      seoName = service.seoNames[0];
    }

    if (!seoName) {
      service.addons.some((addon) => {
        if (addon.name === name && addon.seoNames && addon.seoNames.length > 0) {
          seoName = addon.seoNames[0];
        }

        return seoName !== null;
      });
    }

    return seoName !== null;
  });

  // fallback
  if (!seoName) {
    seoName = name
      .replace(/ /g, '-')
      .replace(/---/g, '-')
      .replace(/&/g, 'and')
      .toLowerCase();
  }

  return seoName;
};

/**
 * reverse the previous conversion
 * e.g.: "full-face-makeup" -> "Full Face Makeup", 'cut-and-side-design' -> "Cut & Side Design"
 *
 * @param {seo seoName} seo name
 */
export const SEONameToServiceName = (seoName) => {
  // look for raw data table
  let originalName = null;

  services.some((service) => {
    if (service.seoNames) {
      service.seoNames.some((seo) => {
        if (seo === seoName) {
          originalName = service.name;
        }

        return originalName !== null;
      });
    }

    if (!originalName) {
      service.addons.some((addon) => {
        if (addon.seoNames) {
          addon.seoNames.some((seo) => {
            if (seo === seoName) {
              originalName = addon.name;
            }

            return originalName !== null;
          });
        }

        return originalName != null;
      });
    }

    return originalName !== null;
  });

  // fallback
  if (!originalName) {
    originalName = seoName
      .replace(/-/g, ' ')
      .replace(/and/g, '&')
      .toLowerCase();
  }

  return originalName;
};

/**
 * Convert suburb name to SEO friendly URL part
 * e.g.: "South Yarra" -> "south-yarra"
 *
 * @param {name name} original name
 */
export const SuburbNameToSEOName = name => name.replace(/ /g, '-').toLowerCase();

/**
 * reverse the previous conversion
 * e.g.: "south-yarra" -> "South Yarra"
 *
 * @param {seo seoName} seo name
 */
export const SEONameToSuburbName = seoName =>
  seoName.replace(/-/g, ' ').replace(/(^| )(\w)/g, x => x.toUpperCase());
