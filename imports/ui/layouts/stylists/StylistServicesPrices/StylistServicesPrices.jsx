import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';

import Products from '../../../../api/products/products';
import { validateEditProfile } from '../../../../modules/validate';
import StylistServicesPricesPage from './StylistServicesPricesPage';

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
class StylistServicesPrices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: _.cloneDeep(props.profile),
      productsAvailable: availableProducts(props.products, props.profile.products),
      productsMatched: [],
      productsSearch: '',
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectProduct = this.handleSelectProduct.bind(this);
    this.handleDeselectProduct = this.handleDeselectProduct.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    this.setState({
      pristine: true,
      profile: _.cloneDeep(nextProps.profile),
      productsAvailable: availableProducts(nextProps.products, nextProps.profile.products),
    });
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
      productsAvailable: availableProducts(this.props.products, newProfile.products),
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
      productsAvailable: availableProducts(this.props.products, newProfile.products),
    });
  }

  render() {
    return (
      <StylistServicesPricesPage
        profile={this.state.profile}
        productsMatched={this.state.productsMatched}
        productsSearch={this.state.productsSearch}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onSelectProduct={this.handleSelectProduct}
        onDeselectProduct={this.handleDeselectProduct}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

StylistServicesPrices.defaultProps = {
  products: [],
};

StylistServicesPrices.propTypes = {
  profile: PropTypes.object.isRequired,
  products: PropTypes.array,
};

export default compose(
  connect(state => ({
    profile: state.profile,
  })),
  withTracker(() => {
    Meteor.subscribe('products');

    return {
      products: Products.find().fetch(),
    };
  }),
)(StylistServicesPrices);
