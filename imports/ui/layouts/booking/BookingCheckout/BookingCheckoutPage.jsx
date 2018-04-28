import React, { Component } from 'react';
import { Button, Responsive, Checkbox, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe,
} from 'react-stripe-elements';
import classNames from 'classnames';
import { connect } from 'react-redux';

import SemanticGeoSuggest from '../../../components/SemanticGeoSuggest/SemanticGeoSuggest';
import ModalLink from '../../../components/ModalLink';
import Login from '../../user/Login/Login';
import BookingCheckoutPageSummarySection from './BookingCheckoutPageSummarySection';
import { FormInputField, FormFieldErrorMessage } from '../../../components/FormInputField';
import { withMediaQuery } from '../../../components/HOC';
import { openModal, closeModal } from '../../../../modules/client/redux/ui';
import BookingDateTimePicker from '../../../components/BookingDateTimePicker';

class BookingCheckoutPage extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = { errors: {}, loading: false };
  }

  componentDidMount() {
    if (_.isEmpty(this.props.cart.date) || _.isEmpty(this.props.cart.time)) {
      // on mobile screen, pop up date/time picker modal if date or time hasn't been set
      this.props.openModal(<BookingDateTimePicker />, 'Pick booking time', false);
    }
  }

  componentWillReceiveProps(nextProps) {
    // a way to detect user has picked booking date and time
    if (
      this.props.modalOpen &&
      (_.isEmpty(this.props.cart.date) || _.isEmpty(this.props.cart.time)) &&
      (!_.isEmpty(nextProps.cart.date) && !_.isEmpty(nextProps.cart.time))
    ) {
      this.props.closeModal();
    }
  }

  async handleSubmit() {
    // validate form
    const errors = this.props.onValidate();
    this.setState({ errors });

    if (_.isEmpty(errors)) {
      if (!this.props.cart.useSavedCard) {
        this.setState({ loading: true });
        // get Stripe token for new card then submit
        if (this.props.stripe) {
          try {
            const payload = await this.props.stripe.createToken();

            this.setState({ loading: false });

            if (_.isNil(payload.error)) {
              // 3. inform container component to handle payment
              this.props.onSubmit(payload);
            } else {
              this.setState({
                errors: { ...this.state.errors, stripe: payload.error.message },
              });
            }
          } catch (error) {
            this.setState({
              loading: false,
              errors: { ...this.state.errors, stripe: error.message },
            });
          }
        } else {
          this.setState({
            errors: { ...this.state.errors, stripe: "Stripe.js hasn't loaded yet." },
          });
        }
      } else {
        this.props.onSubmit();
      }
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row margin-top-50 margin-bottom-50">
          <div
            className={classNames({
              'col-lg-8 col-md-8 padding-right-30': this.props.screenWidth > 1024,
              'col-12': this.props.screenWidth <= 1024,
            })}
          >
            <Responsive maxWidth={1024} className="margin-bottom-20">
              <BookingCheckoutPageSummarySection cart={this.props.cart} />
            </Responsive>

            <Form error={!_.isEmpty(this.state.errors) || !_.isEmpty(this.props.error)}>
              <h3 className="margin-top-0 margin-bottom-30">Personal Details</h3>

              {!this.props.authenticated && (
                <div className="margin-top-10 margin-bottom-20">
                  Already a user?&nbsp;
                  <Responsive
                    minWidth={1025}
                    as={ModalLink}
                    to="/login"
                    component={<Login modal />}
                    title="Log in to continue"
                  >
                    Log In
                  </Responsive>
                  <Responsive maxWidth={1024} as={Link} to="/login">
                    Log In
                  </Responsive>
                  &nbsp;to continue
                </div>
              )}

              <div className="row">
                <div className="col-md-4 margin-bottom-15">
                  <label>First Name</label>
                  <FormInputField
                    name="firstName"
                    type="text"
                    onChange={this.props.onChange}
                    errors={this.state.errors}
                    value={this.props.cart.firstName}
                  />
                </div>

                <div className="col-md-4 margin-bottom-15">
                  <label>Last Name</label>
                  <FormInputField
                    name="lastName"
                    type="text"
                    onChange={this.props.onChange}
                    errors={this.state.errors}
                    value={this.props.cart.lastName}
                  />
                </div>

                <div className="col-md-4 margin-bottom-15">
                  <label>Mobile</label>
                  <FormInputField
                    name="mobile"
                    type="text"
                    onChange={this.props.onChange}
                    errors={this.state.errors}
                    value={this.props.cart.mobile}
                  />
                </div>

                {!this.props.authenticated && (
                  <div className="col-md-12 margin-bottom-15">
                    <label>Email</label>
                    <FormInputField
                      disabled={this.props.authenticated}
                      name="email"
                      type="text"
                      onChange={this.props.onChange}
                      errors={this.state.errors}
                      value={this.props.cart.email}
                    />
                  </div>
                )}

                <div className="col-md-12 margin-bottom-15">
                  <label>Address</label>
                  <SemanticGeoSuggest
                    placeholder="type to search your address"
                    country="au"
                    name="address"
                    initialValue={this.props.cart.address}
                    onChange={(value) => {
                      // convert to generic onChange param
                      this.props.onChange({ target: { name: 'address', value } });
                    }}
                    onSuggestSelect={(suggest) => {
                      // force onChange as well
                      this.props.onChange({ target: { name: 'address', value: suggest.label } });
                    }}
                    error={
                      !_.isNil(this.state.errors.address) && !_.isEmpty(this.state.errors.address)
                    }
                  />
                  <FormFieldErrorMessage compact message={this.state.errors.address} />
                </div>

                <div className="col-md-12 margin-bottom-15">
                  <label>Note (optional)</label>
                  <FormInputField
                    name="note"
                    type="text"
                    onChange={this.props.onChange}
                    errors={this.state.errors}
                    value={this.props.cart.note}
                  />
                </div>
              </div>

              <h3 className="margin-top-55 margin-bottom-30">Payment Method</h3>

              <div className="payment">
                {/* saved credit card */}
                {this.props.cart.savedCardInfo && (
                  <div
                    className={classNames('payment-tab', {
                      'payment-tab-active': this.props.cart.useSavedCard,
                    })}
                  >
                    <div className="payment-tab-trigger">
                      <input
                        checked={this.props.cart.useSavedCard}
                        id="savedCard"
                        name="cardType"
                        type="radio"
                        value="savedCard"
                        onChange={this.props.onChange}
                      />
                      <label htmlFor="savedCard">Saved Card</label>
                    </div>

                    <div className="payment-tab-content">
                      <p>{this.props.cart.savedCardInfo}</p>
                    </div>
                  </div>
                )}

                {/* new credit card */}
                <div
                  className={classNames('payment-tab', {
                    'payment-tab-active': !this.props.cart.useSavedCard,
                  })}
                >
                  <div className="payment-tab-trigger">
                    <input
                      checked={!this.props.cart.useSavedCard}
                      type="radio"
                      name="cardType"
                      id="newCard"
                      value="newCard"
                      onChange={this.props.onChange}
                    />
                    <label htmlFor="newCard">Credit / Debit Card</label>
                  </div>

                  <div className="payment-tab-content">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="card-label">
                          <label>Name on Card</label>
                          <FormInputField
                            name="creditCardNameOnCard"
                            type="text"
                            onChange={this.props.onChange}
                            errors={this.state.errors}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="card-label">
                          <label>Card number</label>
                          <CardNumberElement placeholder="" />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="card-label">
                          <label>Expiration</label>
                          <CardExpiryElement />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="card-label">
                          <label>CVC</label>
                          <CardCVCElement placeholder="" />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <Checkbox
                        style={{ padding: '0 20px' }}
                        defaultChecked
                        name="creditCardSaveCard"
                        onChange={(event, data) => {
                          this.props.onChange({
                            target: { name: 'creditCardSaveCard', value: data.checked },
                          });
                        }}
                        label={<label>save this card</label>}
                      />
                    </div>

                    <FormFieldErrorMessage compact={false} message={this.state.errors.stripe} />
                  </div>
                </div>
              </div>

              <div className="margin-top-20">
                <p>* You will only be charged after booked service is completed.</p>

                <FormFieldErrorMessage
                  className="margin-bottom-10"
                  compact={false}
                  message={this.props.error}
                />

                <Button
                  loading={this.state.loading || this.props.loading}
                  type="button"
                  color="teal"
                  circular
                  size="large"
                  disabled={this.props.cart.total === 0}
                  onClick={this.handleSubmit}
                >
                  Confirm
                </Button>

                <Button
                  color="teal"
                  circular
                  size="large"
                  basic
                  onClick={this.props.onBack}
                  disabled={this.state.loading || this.props.loading}
                >
                  Go back
                </Button>
              </div>
            </Form>
          </div>

          <Responsive minWidth={1025} className="col-lg-4 col-md-4">
            <BookingCheckoutPageSummarySection cart={this.props.cart} />
          </Responsive>
        </div>
      </div>
    );
  }
}

BookingCheckoutPage.propTypes = {
  onChange: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  stripe: PropTypes.object.isRequired,
  screenWidth: PropTypes.number.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  modalOpen: state.ui.modalOpen,
});

export default connect(mapStateToProps, { openModal, closeModal })(injectStripe(withMediaQuery(BookingCheckoutPage)));
