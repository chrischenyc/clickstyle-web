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
import './fixtures';

import Profiles from '../../api/profiles/profiles';

WebApp.addHtmlAttributeHook(() => ({ lang: 'en' }));

// TODO: remove after deploy
Profiles.update(
  { timezone: { $exists: false } },
  { $set: { timezone: 'Australia/Melbourne' } },
  { multi: true },
);
