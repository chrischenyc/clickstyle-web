import { Accounts } from 'meteor/accounts-base';
import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

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
          this.props.history.push('/users/dashboard');
        }, 1500);
      }
    });
  }

  renderMessage() {
    if (this.state.loading) {
      return (
        <Message size="huge" warning style={{ marginTop: '6em', marginBottom: '6em' }}>
          Just one second, we are verifying your email..
        </Message>
      );
    } else if (this.state.error) {
      return (
        <Message size="huge" error style={{ marginTop: '6em', marginBottom: '6em' }}>
          {this.state.error}
        </Message>
      );
    }

    return (
      <Message size="huge" success style={{ marginTop: '6em', marginBottom: '6em' }}>
        All set, thank!
      </Message>
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
