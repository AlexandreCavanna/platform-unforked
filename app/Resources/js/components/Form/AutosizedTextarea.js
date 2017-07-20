import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import autosize from 'autosize';
import { FormControl } from 'react-bootstrap';

const AutosizedTextarea = React.createClass({
  propTypes: {
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
  },
  refFormControl: Element,

  componentDidMount() {
    const input = ReactDOM.findDOMNode(this.refFormControl);
    autosize(input);
  },

  componentDidUpdate() {
    const input = ReactDOM.findDOMNode(this.refFormControl);
    autosize(input);
  },

  componentWillUnmount() {
    const input = ReactDOM.findDOMNode(this.refFormControl);
    autosize.destroy(input);
  },

  render() {
    return (
      <FormControl
        ref={c => {
          this.refFormControl = c;
        }}
        type="textarea"
        {...this.props}
      />
    );
  },
});

export default AutosizedTextarea;
