// import server startup through a single index entry point
import { WebApp } from 'meteor/webapp';

import './log';
import './api';
import './oauth';
import './email';
import './accounts';
import './email-templates';
import '../slingshot-restrictions';
import './slingshot-directives';
import './cloudinary';

import './fixtures/products';
import './fixtures/services';
import './fixtures/demo_stylists';

WebApp.addHtmlAttributeHook(() => ({ lang: 'en' }));
