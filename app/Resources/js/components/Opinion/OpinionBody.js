import CustomDiff from '../../services/CustomDiff';
import OpinionBodyDiffContent from './OpinionBodyDiffContent';

const Well = ReactBootstrap.Well;

const OpinionBody = React.createClass({
  propTypes: {
    opinion: React.PropTypes.object.isRequired,
  },
  mixins: [ReactIntl.IntlMixin],

  render() {
    const opinion = this.props.opinion;

    if (this.isVersion()) {
      const prettyDiff = CustomDiff.prettyDiff(opinion.parent.body, opinion.body);

      return (
        <div>
          {opinion.comment !== null
            ? <div>
                <p className="control-label h5">
                  {this.getIntlMessage('opinion.version_comment')}
                </p>
                <Well bsSize="small">
                  <div dangerouslySetInnerHTML={{__html: opinion.comment}} />
                </Well>
              </div>
            : null
          }
          <div dangerouslySetInnerHTML={{__html: prettyDiff}} />
        </div>
      );
    }

    return <OpinionBodyDiffContent opinion={opinion} />;
  },

  isVersion() {
    return this.props.opinion.parent ? true : false;
  },

});

export default OpinionBody;


