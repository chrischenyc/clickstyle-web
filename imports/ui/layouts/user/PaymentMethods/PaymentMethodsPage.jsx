import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container } from 'semantic-ui-react';

const PaymentMethodsPage = ({ savedCards, removeSavedCard }) => (
  <Container>
    <div className="dashboard-list-box">
      <h4>Payment methods</h4>
      <ul>
        {savedCards.map(savedCard => (
          <li key={savedCard.id}>
            <div className="list-box-listing">
              <div className="list-box-listing-content">
                <h3>Saved Card</h3>
                <span>{`${savedCard.name} - xxxx xxxx xxxx ${savedCard.last4}`}</span>
              </div>
            </div>
            <div className="buttons-to-right">
              <Button
                circular
                negative
                onClick={(e) => {
                  e.preventDefault();
                  removeSavedCard(savedCard.id);
                }}
              >
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </Container>
);

PaymentMethodsPage.propTypes = {
  savedCards: PropTypes.array.isRequired,
  removeSavedCard: PropTypes.func.isRequired,
};

export default PaymentMethodsPage;
