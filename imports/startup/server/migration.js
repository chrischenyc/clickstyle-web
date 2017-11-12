import Profiles from '../../api/profiles/profiles';
import Stylists from '../../api/stylists/stylists';

// move profile.stylist to a new Profiles record
// then remove profile.stylist
Profiles.find({})
  .fetch()
  .forEach((profile) => {
    if (profile.stylist) {
      Stylists.upsert(
        { owner: profile.owner },
        { $set: { ...profile.stylist, owner: profile.owner } },
      );
    }
  });
