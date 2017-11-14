// import server startup through a single index entry point
import { WebApp } from 'meteor/webapp';

import './log';
import './api';
import './fixtures';
import './migration';
import './oauth';
import './email';
import './accounts';
import './email-templates';
import '../slingshot-restrictions';
import './slingshot-directives';
import './cloudinary';

WebApp.addHtmlAttributeHook(() => ({ lang: 'en' }));
