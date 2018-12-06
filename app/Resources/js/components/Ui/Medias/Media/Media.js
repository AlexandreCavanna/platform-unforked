// @flow
import React, { PureComponent } from 'react';
import { Media as MediaBtsp } from 'react-bootstrap';
import Body from './Body';
import Heading from './Heading';
import Left from './Left';

type Props = {
  children?: any,
};

export default class Media extends PureComponent<Props> {
  static Body = Body;

  static Left = Left;

  static Heading = Heading;

  render() {
    const { children } = this.props;

    return <MediaBtsp>{children}</MediaBtsp>;
  }
}
