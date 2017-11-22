import React from 'react'; // eslint-disable-line no-unused-vars
import { Input as SemanticInput } from 'semantic-ui-react';

import filterInputAttributes from './filter-input-attributes';

/**
 * The input field
 * @param {Object} props The component's props
 * @return {JSX} The icon component.
 */
class Input extends React.Component {
  /**
   * When a key gets pressed in the input
   * @param  {Event} event The keydown event
   */
  onInputKeyDown = event => {
    // eslint-disable-line complexity
    // Call props.onKeyDown if defined
    // Gives the developer a little bit more control if needed
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }

    switch (event.which) {
      case 40: // DOWN
        if (!event.shiftKey) {
          event.preventDefault();
          this.props.onNext();
        }
        break;
      case 38: // UP
        if (!event.shiftKey) {
          event.preventDefault();
          this.props.onPrev();
        }
        break;
      case 13: // ENTER
        if (this.props.ignoreEnter) {
          event.preventDefault();
        }

        this.props.onSelect();
        break;
      case 9: // TAB
        if (!this.props.ignoreTab) {
          this.props.onSelect();
        }
        break;
      case 27: // ESC
        this.props.onEscape();
        break;
      /* istanbul ignore next */
      default:
        break;
    }
  };

  /**
   * Focus the input
   */
  focus() {
    this.input.focus();
  }

  /**
   * Blur the input
   */
  blur() {
    this.input.blur();
  }

  /**
   * Render the view
   * @return {Function} The React element to render
   */
  render() {
    const attributes = filterInputAttributes(this.props);

    return (
      <SemanticInput
        fluid
        icon="marker"
        iconPosition="left"
        ref={i => (this.input = i)}
        type="text"
        {...attributes}
        value={this.props.value}
        onKeyDown={this.onInputKeyDown}
        onChange={event => {
          this.props.onChange(event.target.value);
        }}
        onKeyPress={this.props.onKeyPress}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
      />
    );
  }
}

/**
 * Default values for the properties
 * @type {Object}
 */
Input.defaultProps = {
  value: '',
  ignoreTab: false,
  onKeyDown: () => {},
  onKeyPress: () => {},
  autoComplete: 'off',
};

export default Input;
