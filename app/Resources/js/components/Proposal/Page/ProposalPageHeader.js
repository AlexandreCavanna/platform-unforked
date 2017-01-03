import React, { PropTypes } from 'react';
import { IntlMixin, FormattedMessage, FormattedDate } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import UserAvatar from '../../User/UserAvatar';
import UserLink from '../../User/UserLink';
import ProposalVoteButtonWrapper from '../Vote/ProposalVoteButtonWrapper';

export const ProposalPageHeader = React.createClass({
  displayName: 'ProposalPageHeader',
  propTypes: {
    proposal: PropTypes.object.isRequired,
    className: PropTypes.string,
    referer: PropTypes.string.isRequired,
  },
  mixins: [IntlMixin],

  getDefaultProps() {
    return {
      className: '',
    };
  },

  render() {
    const {
      proposal,
      className,
      referer,
    } = this.props;

    const createdDate = (
      <FormattedDate
       value={moment(proposal.created_at)}
       day="numeric" month="long" year="numeric" hour="numeric" minute="numeric"
      />
    );
    const updatedDate = (
      <FormattedDate
        value={moment(proposal.updated_at)}
        day="numeric" month="long" year="numeric" hour="numeric" minute="numeric"
      />
    );

    const classes = {
      proposal__header: true,
      [className]: true,
    };

    return (
      <div className={classNames(classes)}>
        <div style={{ marginBottom: 10 }}>
          <a href={referer || proposal._links.index}>
            <i className="cap cap-arrow-1-1 icon--blue"></i>
            { ' ' }
            {this.getIntlMessage('proposal.back')}
          </a>
        </div>
        <h1 className="consultation__header__title h1">{proposal.title}</h1>
        <div className="media">
          <UserAvatar className="pull-left" user={proposal.author} />
          <div className="media-body">
            <p className="media--aligned excerpt">
              <FormattedMessage
                message={this.getIntlMessage('proposal.infos.header')}
                user={<UserLink user={proposal.author} />}
                createdDate={createdDate}
              />
              {
                (moment(proposal.updated_at).diff(proposal.created_at, 'seconds') > 1)
                && <span>
                  {' • '}
                  <FormattedMessage
                    message={this.getIntlMessage('global.edited_on')}
                    updated={updatedDate}
                  />
                </span>
              }
              <ProposalVoteButtonWrapper
                proposal={proposal}
                className="visible-xs pull-right"
              />
            </p>
          </div>
        </div>
      </div>
    );
  },

});

const mapStateToProps = (state) => {
  return {
    referer: state.proposal.referer,
  };
};

export default connect(mapStateToProps)(ProposalPageHeader);
