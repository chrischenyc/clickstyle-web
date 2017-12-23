import './products';
import './services';
import './suburbs';
import './featured';
// import './demo_stylists';

// normalise Profiles.name -> Stylists.name
import Stylists from '../../../api/stylists/stylists';
import Profiles from '../../../api/profiles/profiles';

const stylists = Stylists.find().fetch();
stylists.forEach((stylist) => {
  const { owner } = stylist;
  const { name } = Profiles.findOne({ owner });
  Stylists.update({ owner }, { $set: { name } });
});
