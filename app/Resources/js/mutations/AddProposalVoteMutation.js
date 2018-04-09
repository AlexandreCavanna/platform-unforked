// @flow
import { graphql } from 'react-relay';
import environment from '../createRelayEnvironment';
import commitMutation from './commitMutation';
import type {
  AddProposalVoteMutationVariables,
  AddProposalVoteMutationResponse,
} from './__generated__/AddProposalVoteMutation.graphql';

const mutation = graphql`
  mutation AddProposalVoteMutation($input: AddProposalVoteInput!) {
    addProposalVote(input: $input) {
      proposal {
        id
        # users {
        #   edges {
        #     node {
        #       ...GroupAdminUsersListGroupItem_user
        #     }
        #   }
        # }
      }
    }
  }
`;

const commit = (
  variables: AddProposalVoteMutationVariables,
): Promise<AddProposalVoteMutationResponse> =>
  commitMutation(environment, {
    mutation,
    variables,
  });

export default { commit };
