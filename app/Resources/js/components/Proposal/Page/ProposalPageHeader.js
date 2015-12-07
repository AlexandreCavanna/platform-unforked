import UserAvatar from '../../User/UserAvatar';
import UserLink from '../../User/UserLink';
import ProposalPreviewEstimation from '../Detail/ProposalDetailEstimation';

const FormattedDate = ReactIntl.FormattedDate;
const FormattedMessage = ReactIntl.FormattedMessage;
const Label = ReactBootstrap.Label;

const ProposalPageHeader = React.createClass({
  propTypes: {
    proposal: React.PropTypes.object.isRequired,
  },
  mixins: [ReactIntl.IntlMixin],

  render() {
    const proposal = this.props.proposal;
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

    return (
      <div className="container--custom container--with-sidebar">
        <h1 className="consultation__header__title h1">{proposal.title}</h1>
        <div className="media">
          <UserAvatar className="pull-left" user={proposal.author} />
          <div className="media-body">
            <p className="media--aligned excerpt">
              <FormattedMessage
                message={this.getIntlMessage('proposal.infos.header')}
                user={<UserLink user={proposal.author} />}
                theme={proposal.theme ? 'yes' : 'no'}
                themeLink={
                  <a href={proposal.theme._links.show}>
                    {proposal.theme.title}
                  </a>
                }
                createdDate={createdDate}
              />
              {
                (moment(proposal.updated_at).diff(proposal.created_at, 'seconds') > 1)
                ? <span>
                    {' • '}
                    <FormattedMessage
                      message={this.getIntlMessage('global.edited_on')}
                      updated={updatedDate}
                    />
                  </span>
                : null
              }
            </p>
          </div>
        </div>
        <ul className="nav nav-pills project__infos">
          {/* proposal.votes_count > 0
            ? <li>
                <div className="value">{proposal.votes_count}</div>
                <div className="excerpt category">votes</div>
              </li>
            : null
          */}
          <li>
            <div className="value">{proposal.comments_count}</div>
            <div className="excerpt category">
              <FormattedMessage
                message={this.getIntlMessage('comment.count_no_nb')}
                count={proposal.comments_count}
              />
            </div>
          </li>
          {proposal.status
            ? <li style={{fontSize: 26, paddingTop: 5}}>
                <Label bsSize="large" bsStyle={proposal.status.color}>{proposal.status.name}</Label>
              </li>
            : null
          }
        </ul>
        <div style={{marginTop: 15}}>
          <span>
            <i className="cap cap-marker-1-1"></i>{proposal.district.name}
          </span>
          <ProposalPreviewEstimation style={{marginLeft: 20, display: "inline-block"}} proposal={proposal} />
        </div>
      </div>
    );
  },

});

export default ProposalPageHeader;
