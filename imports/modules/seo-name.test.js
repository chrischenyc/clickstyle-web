import { assert } from 'meteor/practicalmeteor:chai';

import services from './services-addons.json';
import {
  ServiceNameToSEOName,
  SEONameToServiceName,
  SuburbNameToSEOName,
  SEONameToSuburbName,
} from './seo-name';

describe('ServiceNameToSEOName', () => {
  services.forEach((service) => {
    it(`should convert service name '${service.name}' -> '${service.seoNames[0]}'`, () => {
      assert.equal(ServiceNameToSEOName(service.name), service.seoNames[0]);
    });

    service.addons.forEach((addon) => {
      it(`should convert addon name '${addon.name}' -> '${addon.seoNames[0]}'`, () => {
        assert.equal(ServiceNameToSEOName(addon.name), addon.seoNames[0]);
      });
    });
  });
});

describe('SEONameToServiceName', () => {
  services.forEach((service) => {
    service.seoNames.forEach((seoName) => {
      it(`should convert service SEO name '${seoName}' -> '${service.name}'`, () => {
        assert.equal(SEONameToServiceName(seoName), service.name);
      });
    });

    service.addons.forEach((addon) => {
      addon.seoNames.forEach((seoName) => {
        it(`should convert addon SEO name '${seoName}' -> '${addon.name}'`, () => {
          assert.equal(SEONameToServiceName(seoName), addon.name);
        });
      });
    });
  });
});

const suburbs = [
  { name: 'South Yarra', seo: 'south-yarra' },
  { name: 'Melbourne', seo: 'melbourne' },
];

describe('SuburbNameToSEOName', () => {
  suburbs.forEach((suburb) => {
    it(`should convert suburb name '${suburb.name}' -> '${suburb.seo}'`, () => {
      assert.equal(SuburbNameToSEOName(suburb.name), suburb.seo);
    });
  });
});

describe('SEONameToSuburbName', () => {
  suburbs.forEach((suburb) => {
    it(`should convert suburb SEO name '${suburb.seo}' -> '${suburb.name}'`, () => {
      assert.equal(SEONameToSuburbName(suburb.seo), suburb.name);
    });
  });
});
