// @flow
/* eslint-env jest */
import * as React from 'react';
import { shallow } from 'enzyme';
import { EventMap } from './EventMap';
import { $refType } from '../../../mocks';

describe('<EventMap />', () => {
  it('renders correcty', () => {
    const props = {
      events: {
        totalCount: 2,
        edges: [
          {
            node: {
              id: 'event1',
              lat: 47.12345789,
              lng: 1.23456789,
              url: 'http://perdu.com',
              address: 'Ici et ailleur',
              startAt: '2018-09-27T03:00:00+01:00',
              endAt: '2019-09-27T03:00:00+01:00',
              title: 'Evenement des gens perdu',
            },
          },
          {
            node: {
              id: 'event2',
              lat: 47.1235444789,
              lng: 1.23477789,
              url: 'http://perdu.com',
              address: 'Nul part et ailleur',
              startAt: '2018-10-07T03:00:00+01:00',
              endAt: '2019-10-27T03:00:00+01:00',
              title: 'Evenement des gens pas perdu',
            },
          },
        ],
        $refType,
      },
    };
    const wrapper = shallow(<EventMap {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
