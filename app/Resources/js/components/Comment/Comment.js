import UserAvatar from '../User/UserAvatar';
import CommentAuthor from './CommentAuthor';
import CommentBody from './CommentBody';
import CommentVoteButton from './CommentVoteButton';
import CommentReport from './CommentReport';
import CommentEdit from './CommentEdit';
import CommentAnswers from './CommentAnswers';
import CommentAnswerForm from './CommentAnswerForm';

var FormattedDate = ReactIntl.FormattedDate;

var Comment = React.createClass({
    mixins: [ReactIntl.IntlMixin],

    getInitialState() {
        if (this.props.comment.answers.length > 0) {
            return {
                commentFormShown: true
            }
        }
        return {
            commentFormShown: false
        }
    },

    render() {
        var comment = this.props.comment;
        return (
          <li className="opinion  opinion--comment" >
            <div className="opinion__body">
                <UserAvatar user={comment.user} />
                <div className="opinion__data">
                    <CommentAuthor comment={comment} />
                    <p className="excerpt  opinion__date">
                        <FormattedDate value={comment.created_at} day="numeric" month="long" year="numeric" hour="numeric" minute="numeric" />
                    </p>
                </div>
                <CommentBody comment={comment} />
                <CommentVoteButton comment={comment} />&nbsp;
                { this.renderReporting(comment) }&nbsp;
                <CommentEdit comment={comment} />
                {(this.props.root === true
                    ? <a onClick={ this.answer.bind(this) } className="btn btn-xs btn-dark-gray btn--outline">
                        { this.getIntlMessage('global.answer') }
                      </a>
                    : <span />
                )}
                {(this.props.root === true
                    ? <CommentAnswers comments={comment.answers} />
                    : <span />
                )}
                {(this.state.commentFormShown === true
                    ? <CommentAnswerForm comment={comment} />
                    : <span />
                )}
            </div>
          </li>
        );
    },

    renderReporting(comment) {
        if (this.props.can_report) {
            return (
                <CommentReport comment={comment} />
            );
        }
    },

    answer() {
        this.setState({
            commentFormShown: true
        });
    }

});

export default Comment;
