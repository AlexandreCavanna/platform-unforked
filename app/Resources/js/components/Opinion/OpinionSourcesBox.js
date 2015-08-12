import OpinionSourceList from './OpinionSourceList';
import OpinionSourceForm from './OpinionSourceForm';
import Fetcher from '../../services/Fetcher';

const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;

const OpinionDataBox = React.createClass({
  propTypes: {
    opinionId: React.PropTypes.number.isRequired,
  },
  mixins: [ReactIntl.IntlMixin],

  getInitialState() {
    return {
      isOpinionContributable: false,
      sources: [],
      categories: [],
      isLoading: true,
      filter: 'last',
      offset: 0,
      limit: 50,
    };
  },

  componentDidMount() {
    this.loadDataFromServer();
    Fetcher
    .get('/categories')
    .then((data) => {
      this.setState({categories: data});
      return true;
    });
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.filter !== prevState.filter) {
      this.loadDataFromServer();
    }
  },

  renderLoader() {
    if (this.state.isLoading) {
      return (
        <Row>
          <div className="col-xs-2 col-xs-offset-6">
            <div className="spinner-loader"></div>
          </div>
        </Row>
      );
    }
  },

  renderFilter() {
    if (this.state.sources.length > 1) {
      return (
        <div className="pull-right col-xs-5 hidden-xs">
          <select ref="filter" className="form-control" value={this.state.filter} onChange={() => this.updateSelectedValue()}>
            <option value="popular">{this.getIntlMessage('global.popular')}</option>
            <option value="last">{this.getIntlMessage('global.last')}</option>
            <option value="old">{this.getIntlMessage('global.old')}</option>
          </select>
        </div>
      );
    }
  },

  render() {
    return (
      <Col xs={12}>
        <Row>
          {this.state.isOpinionContributable
            ? <OpinionSourceForm {...this.props} categories={this.state.categories} />
            : <span />
          }
          { this.renderFilter() }
        </Row>
        <Row>
          { this.renderLoader() }
          {!this.state.isLoading
            ? <OpinionSourceList sources={this.state.sources} />
            : <span />
          }
        </Row>
      </Col>
    );
  },

  updateSelectedValue() {
    this.setState({
      filter: $(React.findDOMNode(this.refs.filter)).val(),
      isLoading: true,
      sources: [],
    });
  },

  loadDataFromServer() {
    this.setState({'isLoading': true});

    Fetcher
    .get(`/opinions/${this.props.opinionId}/sources?offset=${this.state.offset}&limit=${this.state.limit}&filter=${this.state.filter}`)
    .then((data) => {
      this.setState({
        isLoading: false,
        sources: data.sources,
        isOpinionContributable: data.isOpinionContributable,
      });
      return true;
    });
  },

});

export default OpinionDataBox;
