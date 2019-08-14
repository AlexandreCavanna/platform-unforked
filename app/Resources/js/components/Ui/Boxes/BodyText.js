// @flow
import React from 'react';
import ReadMoreLink from '../../Utils/ReadMoreLink';
import WYSIWYGRender from '../../Form/WYSIWYGRender';

type Props = {|
  +text?: ?string,
  +maxLength: number
|};

type State = {|
  +expanded: boolean,
  +truncated: boolean,
  +hideText: boolean,
|};

class BodyText extends React.Component<Props, State> {
  static defaultProps = {
    text: null,
    maxLength: 4000
  };

  constructor(props: Props) {
    super(props);
    const expanded = (props.text && props.text.length <= props.maxLength) || true;
    this.state = {
      expanded,
      truncated: !expanded,
      hideText: false,
    }
  }

  toggleExpand = () => {
    const { expanded } = this.state;
    this.setState({
      expanded: !expanded,
    });
  };

  render() {
    const { text } = this.props;
    if (!text) {
      return null;
    }
    const { truncated, hideText, expanded } = this.state;
    const style = {
      maxHeight: expanded ? 'none' : '85px',
      visibility: hideText ? 'hidden' : 'visible',
    };
    return (
      <div className="step__intro">
        <div ref="content" className="step__intro__content" style={style}>
          <WYSIWYGRender value={text} />
        </div>
        <div className="text-center">
          <ReadMoreLink
            visible={truncated}
            expanded={expanded}
            onClick={this.toggleExpand}
          />
        </div>
      </div>
    );
  }
}

export default BodyText;
