const VoteLinechart = React.createClass({
  propTypes: {
    history: React.PropTypes.array.isRequired,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    top: React.PropTypes.number,
    left: React.PropTypes.number,
  },
  mixins: [ReactIntl.IntlMixin],

  getDefaultProps() {
    return {
      height: undefined,
      width: undefined,
      top: 0,
      left: 0,
    };
  },

  componentDidMount() {
    this.initChart();
  },

  componentDidUpdate() {
    this.initChart();
  },

  render() {
    return <div className="opinion__history_chart" ref="linechart" />;
  },

  initChart() {
    const AreaChart = google.visualization.AreaChart;
    const DataTable = google.visualization.arrayToDataTable;
    const lines = [[
      {type: 'datetime', label: this.getIntlMessage('vote.date')},
      {type: 'number', label: this.getIntlMessage('vote.nok')},
      {type: 'number', label: this.getIntlMessage('vote.mitige')},
      {type: 'number', label: this.getIntlMessage('vote.ok')},
    ]];

    $.each(this.props.history, function(i, row) {
      lines.push([
        new Date(1000 * parseInt(row[0])),
        row[1],
        row[2],
        row[3],
      ]);
    });

    const options = {
      hAxis: {titleTextStyle: {color: '#333'}},
      vAxis: {title: this.getIntlMessage('vote.votes'),  minValue: 0},
      isStacked: true,
      colors: ['#d9534f', '#f0ad4e', '#5cb85c'],
      height: this.props.height,
      width: this.props.width,
      legend: {position: 'top', maxLines: 3},
      theme: 'maximized',
    };

    (new AreaChart(React.findDOMNode(this.refs.linechart))).draw(
      new DataTable(lines), options
    );
  },
});

export default VoteLinechart;
