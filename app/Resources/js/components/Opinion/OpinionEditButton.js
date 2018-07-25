// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import OpinionEditModal from './Edit/OpinionEditModal';
import { openOpinionEditModal } from '../../redux/modules/opinion';

type Props = {
  dispatch: Function,
  opinion: Object,
};

export class OpinionEditButton extends React.Component<Props> {
  render() {
    const { opinion, dispatch } = this.props;
    return (
      <span>
        <Button
          id="opinion-edit-btn"
          className="opinion__action--edit pull-right btn--outline btn-dark-gray"
          onClick={() => {
            dispatch(openOpinionEditModal(opinion.id));
          }}>
          <i className="cap cap-pencil-1" /> {<FormattedMessage id="global.edit" />}
        </Button>{' '}
        <OpinionEditModal opinion={opinion} />
      </span>
    );
  }
}

export default connect()(OpinionEditButton);
