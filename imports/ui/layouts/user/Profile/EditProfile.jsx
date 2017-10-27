import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';

import Brands from '../../../../api/brands/brands';
import { validateEditProfile } from '../../../../modules/validate';
import GeoSuggestToAddress from '../../../../modules/geo-suggest-to-address';
import EditProfilePage from './EditProfilePage';

const availableBrands = (brands, selectedBrands) => {
  if (!selectedBrands || selectedBrands.length === 0) {
    return brands;
  }

  const selectedNames = selectedBrands.map(selectedBrand => selectedBrand.name.toLowerCase());

  return brands.filter(brand => selectedNames.indexOf(brand.name.toLowerCase()) === -1);
};

// platform-independent stateful container component
// to handle edit user profile logic
class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoError: '',
      photoUploading: false,
      photoPristine: true,
      profile: _.cloneDeep(props.profile),
      availableBrands: availableBrands(props.brands, props.profile.products),
      productsSearch: '',
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handlePhotoSelected = this.handlePhotoSelected.bind(this);
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
    this.handlePhotoRemove = this.handlePhotoRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddressSuggest = this.handleAddressSuggest.bind(this);
    this.handleSelectBrand = this.handleSelectBrand.bind(this);
    this.handleDeselectBrand = this.handleDeselectBrand.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    this.setState({
      pristine: true,
      profile: _.cloneDeep(nextProps.profile),
      availableBrands: availableBrands(nextProps.brands, nextProps.profile.products),
    });
  }

  handlePhotoSelected() {
    this.setState({ photoPristine: false });
  }

  handlePhotoRemove() {
    Meteor.call('profiles.photo.remove', (callError) => {
      if (callError) {
        this.setState({ photoError: callError.reason });
      }
    });
  }

  handlePhotoUpload(file) {
    this.setState({ photoError: '' });

    const upload = new Slingshot.Upload(Meteor.settings.public.SlingshotCloudinaryImage);
    const validateError = upload.validate(file);

    if (validateError) {
      this.setState({ photoError: validateError.reason });
    } else {
      this.setState({ photoUploading: true });

      upload.send(file, (uploadError, downloadUrl) => {
        if (uploadError) {
          this.setState({ photoUploading: false, photoError: uploadError.reason });
        } else {
          // update user profile.photo.original
          Meteor.call('profiles.photo.add', downloadUrl, (callError) => {
            this.setState({ photoUploading: false, photoError: '' });

            if (callError) {
              this.setState({ photoError: callError.reason });
            } else {
              this.setState({ photoPristine: true });
            }
          });
        }
      });
    }
  }

  handleChange(event) {
    if (event.target.name === 'productsSearch') {
      this.setState({ productsSearch: event.target.value });
    } else {
      let newProfile = _.cloneDeep(this.state.profile);
      newProfile = _.set(newProfile, event.target.name, event.target.value);

      if (event.target.name === 'address.raw' && _.isEmpty(event.target.value)) {
        newProfile.address = {};
      }

      this.setState({
        profile: newProfile,
        pristine: _.isEqual(newProfile, this.props.profile),
      });
    }
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    const errors = validateEditProfile(this.state.profile);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ saving: true });

      Meteor.call('profiles.update', this.state.profile, (error) => {
        this.setState({ saving: false, errors: {}, pristine: true });

        if (error) {
          this.setState({ errors: { message: error.reason } });
        }
      });
    }
  }

  handleAddressSuggest(suggest) {
    const address = GeoSuggestToAddress(suggest);

    this.setState({
      profile: { ...this.state.profile, address },
    });
  }

  handleSelectBrand(brand) {
    if (brand.name === undefined || brand.name.length === 0) {
      return;
    }

    const { products: currentProducts } = this.state.profile;

    let updatedProducts = [brand];

    if (currentProducts) {
      const matchedProducts = currentProducts.filter(product => product.name.toLowerCase() === brand.name.toLowerCase());
      if (matchedProducts.length === 0) {
        updatedProducts = [...currentProducts, brand];
      } else {
        updatedProducts = currentProducts;
      }
    }

    const newProfile = {
      ...this.state.profile,
      products: updatedProducts,
    };

    this.setState({
      profile: newProfile,
      productsSearch: '',
      pristine: _.isEqual(newProfile, this.props.profile),
      availableBrands: availableBrands(this.props.brands, newProfile.products),
    });
  }

  handleDeselectBrand(brand) {
    const newProfile = {
      ...this.state.profile,
      products: this.state.profile.products.filter(product => product.name.toLowerCase() !== brand.name.toLowerCase()),
    };
    this.setState({
      profile: newProfile,
      pristine: _.isEqual(newProfile, this.props.profile),
      availableBrands: availableBrands(this.props.brands, newProfile.products),
    });
  }

  render() {
    return (
      <EditProfilePage
        photo={this.props.profile.photo}
        onPhotoSelected={this.handlePhotoSelected}
        onPhotoUpload={this.handlePhotoUpload}
        onPhotoRemove={this.handlePhotoRemove}
        photoUploading={this.state.photoUploading}
        photoPristine={this.state.photoPristine}
        photoError={this.state.photoError}
        profile={this.state.profile}
        brands={this.state.availableBrands}
        productsSearch={this.state.productsSearch}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onAddressSuggest={this.handleAddressSuggest}
        onSelectBrand={this.handleSelectBrand}
        onDeselectBrand={this.handleDeselectBrand}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

EditProfile.defaultProps = {
  brands: [],
};

EditProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  brands: PropTypes.array,
};

export default compose(
  connect(state => ({
    profile: state.profile,
  })),
  withTracker(() => {
    Meteor.subscribe('brands');

    return {
      brands: Brands.find().fetch(),
    };
  }),
)(EditProfile);
