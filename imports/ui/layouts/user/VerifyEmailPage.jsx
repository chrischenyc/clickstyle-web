import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import PropTypes from 'prop-types';

class VerifyEmailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, error: null };
  }

  componentDidMount() {
    Accounts.verifyEmail(this.props.match.params.token, (error) => {
      if (error) {
        this.setState({
          loading: false,
          error: `${error.reason}. Please try again.`,
        });
      } else {
        this.setState({ loading: false, error: null });

        setTimeout(() => {
          this.props.history.push('/dashboard');
        }, 1500);
      }
    });
  }

  renderMessage() {
    if (this.state.loading) {
      return (
        <div className="notification notice">
          <p>
            <span>Just one second,</span> we are verifying your email..
          </p>
        </div>
      );
    } else if (this.state.error) {
      return (
        <div className="notification error">
          <p>
            <span>Error!</span> {this.state.error}
          </p>
        </div>
      );
    }

    return (
      <div className="notification success">
        <p>
          <span>All set, thank!</span> Sending you to Dashboard...
        </p>
      </div>
    );
  }

  render() {
    return <div className="container centered-content">{this.renderMessage()}</div>;
  }
}

VerifyEmailPage.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default VerifyEmailPage;
