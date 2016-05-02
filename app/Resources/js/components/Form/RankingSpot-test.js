/* eslint-env mocha */
/* eslint no-unused-expressions:0 */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RankingSpot from './RankingSpot';

const props = {
  connectDropTarget: (cp) => { return cp; },
  onDrop: () => {},
};

const OriginalComponent = RankingSpot.DecoratedComponent;

describe('<RankingSpot />', () => {
  it('should render a transparent spot when not hovering', () => {
    const wrapper = shallow(<OriginalComponent {...props} canDrop isOver={false} />);
    const spot = wrapper.find('.ranking__spot');
    expect(spot.prop('style').backgroundColor).to.equal('transparent');
  });

  it('should render a transparent spot when drop not allowed', () => {
    const wrapper = shallow(<OriginalComponent {...props} canDrop={false} isOver />);
    const spot = wrapper.find('.ranking__spot');
    expect(spot.prop('style').backgroundColor).to.equal('transparent');
  });

  it('should render a colored spot when drop is allowed and hovering', () => {
    const wrapper = shallow(<OriginalComponent {...props} canDrop isOver />);
    const spot = wrapper.find('.ranking__spot');
    expect(spot.prop('style').backgroundColor).to.equal('#eee');
  });
  
});
