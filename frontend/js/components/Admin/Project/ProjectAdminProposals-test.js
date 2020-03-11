// @flow
/* eslint-env jest */
import * as React from 'react';
import { shallow } from 'enzyme';
import { ProjectAdminProposals } from './ProjectAdminProposals';
import { $refType, relayPaginationMock } from '~/mocks';
import { ProposalListNoContributions } from './ProjectAdminProposals.style';

const DEFAULT_PROJECT = {
  id: 'UHJvamVjdDpwcm9qZWN0Ng==',
  proposals: {
    totalCount: 8,
    pageInfo: {
      hasNextPage: false,
    },
    edges: [
      {
        node: {
          author: {
            username: 'welcomattic',
            id: 'VXNlcjp1c2VyNTAy',
          },
          publishedAt: '2017-02-01 00:00:00',
          district: {
            id: 'district1',
            name: 'Beauregard',
          },
          category: {
            id: 'pCategory2',
            name: 'Politique',
          },
          reference: '1',
          id: 'UHJvcG9zYWw6cHJvcG9zYWwx',
          title: 'Ravalement de la façade de la bibliothèque municipale',
          status: {
            id: 'status1',
            name: 'En cours',
            color: 'info',
          },
          currentVotableStep: {
            id: 'U2VsZWN0aW9uU3RlcDpzZWxlY3Rpb25zdGVwMQ==',
            title: 'Sélection',
          },
        },
        cursor: 'YToyOntpOjA7aToxNDg1OTAzNjAwMDAwO2k6MTtzOjk6InByb3Bvc2FsMSI7fQ==',
      },
      {
        node: {
          author: {
            username: 'johnsmith',
            id: 'VXNlcjp1c2VyNTIy',
          },
          publishedAt: '2017-02-01 00:03:00',
          district: {
            id: 'district2',
            name: 'Nord Saint-Martin',
          },
          category: {
            id: 'pCategory1',
            name: 'Aménagement',
          },
          reference: '12',
          id: 'UHJvcG9zYWw6cHJvcG9zYWwxMDg=',
          title: 'Renovation of the gymnasium',
          status: {
            id: 'status2',
            name: 'Approuvé',
            color: 'success',
          },
          currentVotableStep: null,
        },
        cursor: 'YToyOntpOjA7aToxNDg1OTAzNzgwMDAwO2k6MTtzOjExOiJwcm9wb3NhbDEwOCI7fQ==',
      },
      {
        node: {
          author: {
            username: 'user',
            id: 'VXNlcjp1c2VyNQ==',
          },
          publishedAt: '2017-02-01 00:03:00',
          district: {
            id: 'district2',
            name: 'Nord Saint-Martin',
          },
          category: {
            id: 'pCategory1',
            name: 'Aménagement',
          },
          reference: '2',
          id: 'UHJvcG9zYWw6cHJvcG9zYWwy',
          title: 'Rénovation du gymnase',
          status: {
            id: 'status2',
            name: 'Approuvé',
            color: 'success',
          },
          currentVotableStep: {
            id: 'U2VsZWN0aW9uU3RlcDpzZWxlY3Rpb25zdGVwMQ==',
            title: 'Sélection',
          },
        },
        cursor: 'YToyOntpOjA7aToxNDg1OTAzNzgwMDAwO2k6MTtzOjk6InByb3Bvc2FsMiI7fQ==',
      },
      {
        node: {
          author: {
            username: 'welcomattic',
            id: 'VXNlcjp1c2VyNTAy',
          },
          publishedAt: '2017-02-01 00:04:00',
          district: {
            id: 'district4',
            name: 'Beaulieu',
          },
          category: {
            id: 'pCategory2',
            name: 'Politique',
          },
          reference: '3',
          id: 'UHJvcG9zYWw6cHJvcG9zYWwz',
          title: 'Installation de bancs sur la place de la mairie',
          status: {
            id: 'status1',
            name: 'En cours',
            color: 'info',
          },
          currentVotableStep: {
            id: 'U2VsZWN0aW9uU3RlcDpzZWxlY3Rpb25zdGVwMQ==',
            title: 'Sélection',
          },
        },
        cursor: 'YToyOntpOjA7aToxNDg1OTAzODQwMDAwO2k6MTtzOjk6InByb3Bvc2FsMyI7fQ==',
      },
      {
        node: {
          author: {
            username: 'user7',
            id: 'VXNlcjp1c2VyNw==',
          },
          publishedAt: '2017-02-01 00:04:19',
          district: {
            id: 'district2',
            name: 'Nord Saint-Martin',
          },
          category: null,
          reference: '4',
          id: 'UHJvcG9zYWw6cHJvcG9zYWw0',
          title:
            "Plantation de tulipes dans les jardinière du parking de l'église avec un titre très long pour tester la césure",
          status: null,
          currentVotableStep: null,
        },
        cursor: 'YToyOntpOjA7aToxNDg1OTAzODU5MDAwO2k6MTtzOjk6InByb3Bvc2FsNCI7fQ==',
      },
      {
        node: {
          author: {
            username: 'admin',
            id: 'VXNlcjp1c2VyQWRtaW4=',
          },
          publishedAt: '2017-02-01 00:07:00',
          district: {
            id: 'district3',
            name: 'Maurepas Patton',
          },
          category: null,
          reference: '7',
          id: 'UHJvcG9zYWw6cHJvcG9zYWwxMA==',
          title: 'Proposition pas encore votable',
          status: {
            id: 'status1',
            name: 'En cours',
            color: 'info',
          },
          currentVotableStep: {
            id: 'U2VsZWN0aW9uU3RlcDpzZWxlY3Rpb25zdGVwNg==',
            title: 'Sélection à venir',
          },
        },
        cursor: 'YToyOntpOjA7aToxNDg1OTA0MDIwMDAwO2k6MTtzOjEwOiJwcm9wb3NhbDEwIjt9',
      },
      {
        node: {
          author: {
            username: 'admin',
            id: 'VXNlcjp1c2VyQWRtaW4=',
          },
          publishedAt: '2017-02-01 00:08:00',
          district: {
            id: 'district3',
            name: 'Maurepas Patton',
          },
          category: null,
          reference: '8',
          id: 'UHJvcG9zYWw6cHJvcG9zYWwxMQ==',
          title: 'Proposition plus votable',
          status: {
            id: 'status1',
            name: 'En cours',
            color: 'info',
          },
          currentVotableStep: {
            id: 'U2VsZWN0aW9uU3RlcDpzZWxlY3Rpb25zdGVwMw==',
            title: 'Fermée',
          },
        },
        cursor: 'YToyOntpOjA7aToxNDg1OTA0MDgwMDAwO2k6MTtzOjEwOiJwcm9wb3NhbDExIjt9',
      },
      {
        node: {
          author: {
            username: 'admin',
            id: 'VXNlcjp1c2VyQWRtaW4=',
          },
          publishedAt: '2018-04-11 00:00:00',
          district: null,
          category: null,
          reference: '1104',
          id: 'UHJvcG9zYWw6cHJvcG9zYWwxMDQ=',
          title: 'Test de publication avec accusé de réception',
          status: null,
          currentVotableStep: null,
        },
        cursor: 'YToyOntpOjA7aToxNTIzMzk3NjAwMDAwO2k6MTtzOjExOiJwcm9wb3NhbDEwNCI7fQ==',
      },
    ],
  },
};

describe('<ProjectAdminProposals />', () => {
  const defaultProps = {
    relay: { ...relayPaginationMock},
    project: {
      $refType,
      ...DEFAULT_PROJECT,
    },
  };

  it('renders correctly when the project have proposals', () => {
    const wrapper = shallow(<ProjectAdminProposals {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders the "No proposals" placeholder when the project does not have any proposals', () => {
    const props = {
      ...defaultProps,
      project: {
        ...defaultProps.project,
        proposals: {
          totalCount: 0,
          pageInfo: {
            hasNextPage: false,
          },
          edges: [],
        },
      },
    };
    const wrapper = shallow(<ProjectAdminProposals {...props} />);
    expect(wrapper.find(ProposalListNoContributions)).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
