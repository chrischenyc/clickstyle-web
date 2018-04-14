import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { validateEditProfile } from '../../../../modules/validate';
import GeoSuggestToAddress from '../../../../modules/geo-suggest-to-address';
import EditProfilePage from './EditProfilePage';

const availableProducts = (products, selectedProducts) => {
  if (!selectedProducts || selectedProducts.length === 0) {
    return products;
  }

  const selectedNames = selectedProducts.map(selectedProduct => selectedProduct.name.toLowerCase());

  return products.filter(product => selectedNames.indexOf(product.name.toLowerCase()) === -1);
};

const searchProducts = (products, keyword) => {
  if (!keyword || keyword === '' || !products) {
    return [];
  }

  return products.filter(product => product.name.toLowerCase().includes(keyword.toLowerCase()));
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
      products: [],
      productsAvailable: [],
      productsMatched: [],
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
    this.handleSelectProduct = this.handleSelectProduct.bind(this);
    this.handleDeselectProduct = this.handleDeselectProduct.bind(this);
  }

  componentDidMount() {
    Meteor.call('products.list', (error, products) => {
      if (error) {
        this.setState({ errors: { message: error.reason } });
      } else {
        this.setState({
          products,
          productsAvailable: availableProducts(
            products,
            this.props.profile ? this.props.profile.products : [],
          ),
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    this.setState({
      pristine: true,
      profile: _.cloneDeep(nextProps.profile),
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
          this.setState({
            photoUploading: false,
            photoError: uploadError.reason,
          });
        } else {
          // attach cloudinary url to profile
          Meteor.call(
            'profiles.photo.add',
            downloadUrl.replace('http://', 'https://'),
            (callError) => {
              this.setState({ photoUploading: false, photoError: '' });

              if (callError) {
                this.setState({ photoError: callError.reason });
              } else {
                this.setState({ photoPristine: true });
              }
            },
          );
        }
      });
    }
  }

  handleChange(event) {
    if (event.target.name === 'productsSearch') {
      this.setState({
        productsSearch: event.target.value,
        productsMatched: searchProducts(this.state.productsAvailable, event.target.value),
      });
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

  handleSelectProduct(selectedProduct) {
    if (selectedProduct.name === undefined || selectedProduct.name.length === 0) {
      return;
    }

    const { products: currentProducts } = this.state.profile;

    let updatedProducts = [selectedProduct];

    if (currentProducts) {
      const matchedProducts = currentProducts.filter(product => product.name.toLowerCase() === selectedProduct.name.toLowerCase());
      if (matchedProducts.length === 0) {
        updatedProducts = [...currentProducts, selectedProduct];
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
      productsMatched: [],
      pristine: _.isEqual(newProfile, this.props.profile),
      productsAvailable: availableProducts(this.state.products, newProfile.products),
    });
  }

  handleDeselectProduct(deselectedProduct) {
    const newProfile = {
      ...this.state.profile,
      products: this.state.profile.products.filter(product => product.name.toLowerCase() !== deselectedProduct.name.toLowerCase()),
    };
    this.setState({
      profile: newProfile,
      pristine: _.isEqual(newProfile, this.props.profile),
      productsAvailable: availableProducts(this.state.products, newProfile.products),
    });
  }

  render() {
    return (
      <EditProfilePage
        onPhotoSelected={this.handlePhotoSelected}
        onPhotoUpload={this.handlePhotoUpload}
        onPhotoRemove={this.handlePhotoRemove}
        photoUploading={this.state.photoUploading}
        photoPristine={this.state.photoPristine}
        photoError={this.state.photoError}
        profile={this.state.profile}
        productsMatched={this.state.productsMatched}
        productsSearch={this.state.productsSearch}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onAddressSuggest={this.handleAddressSuggest}
        onSelectProduct={this.handleSelectProduct}
        onDeselectProduct={this.handleDeselectProduct}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

EditProfile.propTypes = {
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.user.profile,
});

export default connect(mapStateToProps)(EditProfile);
