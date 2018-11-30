// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';

type Props = {
  handleValidate: () => void,
  handleCancel?: ?() => void,
};

export class DeleteButtonPopover extends React.Component<Props> {
  overlayRef: any;

  constructor(props: Props) {
    super(props);
    this.overlayRef = React.createRef();
  }

  handleValidate = () => {
    this.overlayRef.current.hide();

    if (typeof this.props.handleValidate === 'function') {
      this.props.handleValidate();
    }
  };

  handleCancel = () => {
    this.overlayRef.current.hide();

    if (typeof this.props.handleCancel === 'function') {
      this.props.handleCancel();
    }
  };

  render() {
    return (
      <OverlayTrigger
        trigger="click"
        placement="left"
        rootClose
        ref={this.overlayRef}
        overlay={
          <Popover
            placement="left"
            className="in"
            id="delete-field"
            title={<FormattedMessage id="are-you-sure-you-want-to-delete-this-item" />}>
            <Button
              onClick={this.handleValidate}
              id="btn-confirm-delete-field"
              bsStyle="danger"
              className="right-bloc btn-block">
              <FormattedMessage id="btn_delete" />
            </Button>
            <Button
              id="btn-cancel-delete-field"
              bsStyle="default"
              className="right-block btn-block"
              onClick={this.handleCancel}>
              <FormattedMessage id="global.no" />
            </Button>
          </Popover>
        }>
        <Button bsStyle="danger" className="btn-outline-danger">
          <i className="cap cap-times" /> <FormattedMessage id="global.delete" />
        </Button>
      </OverlayTrigger>
    );
  }
}

export default DeleteButtonPopover;
