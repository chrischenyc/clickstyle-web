import services from './services-addons.json';
import { ServiceNameToSEOName, SEONameToServiceName } from './seo-name';

test('ServiceNameToSEOName', () => {
  expect(ServiceNameToSEOName('Make-Up').toBe('make-up'));
});
