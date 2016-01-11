import AppDispatcher from '../dispatchers/AppDispatcher';
import Fetcher from '../services/Fetcher';
import ProposalStore from '../stores/ProposalStore';
import LocalStorageService from '../services/LocalStorageService';
import {
  RECEIVE_PROPOSAL,
  RECEIVE_PROPOSAL_VOTES,
  RECEIVE_PROPOSALS,

  SUBMIT_PROPOSAL,
  VALIDATION_FAILURE,
  CREATE_PROPOSAL_SUCCESS,
  CREATE_PROPOSAL_FAILURE,
  UPDATE_PROPOSAL_SUCCESS,
  UPDATE_PROPOSAL_FAILURE,
  DELETE_PROPOSAL_SUCCESS,
  DELETE_PROPOSAL_FAILURE,

  CREATE_PROPOSAL_VOTE,
  CREATE_PROPOSAL_VOTE_SUCCESS,
  CREATE_PROPOSAL_VOTE_FAILURE,
  DELETE_PROPOSAL_VOTE,
  DELETE_PROPOSAL_VOTE_SUCCESS,
  DELETE_PROPOSAL_VOTE_FAILURE,

  CHANGE_PAGE,
  CHANGE_ORDER,
  CHANGE_SEARCH_TERMS,
  CHANGE_FILTERS,
  PROPOSAL_PAGINATION,

} from '../constants/ProposalConstants';
import {
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
} from '../constants/CommentConstants';

export default {

  load: (fetchFrom, id) => {
    const page = ProposalStore.currentPage;
    const pagination = PROPOSAL_PAGINATION;

    const order = ProposalStore.order;
    const filters = ProposalStore.filters;
    const terms = ProposalStore.terms;

    let url = null;
    const data = {};

    switch (fetchFrom) {
    case 'form':
      url = `/proposal_forms/${id}/proposals/search`;
      break;
    case 'selectionStep':
      url = `/selection_steps/${id}/proposals/search`;
      break;
    default:
      break;
    }

    if (!url) {
      return false;
    }

    url += `?page=${page}&pagination=${pagination}&order=${order}`;

    data.terms = terms;
    data.filters = filters;

    Fetcher
      .post(url, data)
      .then((response) => {
        const promise = response.json();
        promise.then((result) => {
          AppDispatcher.dispatch({
            actionType: RECEIVE_PROPOSALS,
            proposals: result.proposals,
            count: result.count,
            order: result.order,
          });
          return true;
        });
      });
  },

  loadProposalVotes: (proposalForm, proposal) => {
    Fetcher
      .get(`/proposal_forms/${proposalForm}/proposals/${proposal}/votes`)
      .then((result) => {
        AppDispatcher.dispatch({
          actionType: RECEIVE_PROPOSAL_VOTES,
          votes: result.votes,
        });
        return true;
      });
  },

  changePage: (page) => {
    AppDispatcher.dispatch({
      actionType: CHANGE_PAGE,
      page: page,
    });
  },

  changeOrder: (newOrder) => {
    AppDispatcher.dispatch({
      actionType: CHANGE_ORDER,
      order: newOrder,
    });
    LocalStorageService.set('proposals_order', ProposalStore.order);
  },

  changeSearchTerms: (terms) => {
    AppDispatcher.dispatch({
      actionType: CHANGE_SEARCH_TERMS,
      terms: terms,
    });
  },

  changeFilterValue: (filterName, value) => {
    AppDispatcher.dispatch({
      actionType: CHANGE_FILTERS,
      filter: filterName,
      value: value,
    });
    LocalStorageService.set('proposals_filters', ProposalStore.filters);
  },

  submit: () => {
    AppDispatcher.dispatch({
      actionType: SUBMIT_PROPOSAL,
    });
  },

  validationFailure: () => {
    AppDispatcher.dispatch({
      actionType: VALIDATION_FAILURE,
    });
  },

  add: (form, data, successMessage = 'proposal.request.create.success', errorMessage = 'proposal.request.create.failure') => {
    return Fetcher
      .post(`/proposal_forms/${form}/proposals`, data)
      .then(() => {
        AppDispatcher.dispatch({
          actionType: CREATE_PROPOSAL_SUCCESS,
          message: successMessage,
        });
        return true;
      })
      .catch(() => {
        AppDispatcher.dispatch({
          actionType: CREATE_PROPOSAL_FAILURE,
          message: errorMessage,
        });
        return false;
      })
    ;
  },

  update: (form, proposal, data, successMessage = 'proposal.request.update.success', errorMessage = 'proposal.request.update.failure') => {
    return Fetcher
      .put(`/proposal_forms/${form}/proposals/${proposal}`, data)
      .then(() => {
        AppDispatcher.dispatch({
          actionType: UPDATE_PROPOSAL_SUCCESS,
          message: successMessage,
        });
        return true;
      })
      .catch(() => {
        AppDispatcher.dispatch({
          actionType: UPDATE_PROPOSAL_FAILURE,
          message: errorMessage,
        });
        return false;
      })
    ;
  },

  delete: (form, proposal, successMessage = 'proposal.request.delete.success', errorMessage = 'proposal.request.delete.failure') => {
    return Fetcher
      .delete(`/proposal_forms/${form}/proposals/${proposal}`)
      .then(() => {
        AppDispatcher.dispatch({
          actionType: DELETE_PROPOSAL_SUCCESS,
          message: successMessage,
        });
        return true;
      })
      .catch(() => {
        AppDispatcher.dispatch({
          actionType: DELETE_PROPOSAL_FAILURE,
          message: errorMessage,
        });
        return false;
      })
    ;
  },

  getOne: (form, proposal) => {
    Fetcher
      .get(`/proposal_forms/${form}/proposals/${proposal}`)
      .then((data) => {
        AppDispatcher.dispatch({
          actionType: RECEIVE_PROPOSAL,
          proposal: data.proposal,
          userHasVote: data.userHasVote,
          votableStep: data.votableStep,
        });
        return true;
      });
  },

  vote: (selectionStep, proposal, data = {}, successMessage = 'proposal.request.vote.success', errorMessage = 'proposal.request.vote.failure') => {
    const hasComment = data.comment && data.comment.length > 0;
    AppDispatcher.dispatch({
      actionType: CREATE_PROPOSAL_VOTE,
      proposal: proposal,
      selectionStep: selectionStep,
      hasComment: hasComment,
    });
    return Fetcher
    .post(`/selection_steps/${selectionStep}/proposals/${proposal}/vote`, data)
    .then(() => {
      AppDispatcher.dispatch({
        actionType: CREATE_PROPOSAL_VOTE_SUCCESS,
        message: successMessage,
      });
      if (hasComment) {
        AppDispatcher.dispatch({
          actionType: CREATE_COMMENT_SUCCESS,
          message: 'comment.submit_success',
        });
      }
      return true;
    })
    .catch((error) => {
      AppDispatcher.dispatch({
        actionType: CREATE_PROPOSAL_VOTE_FAILURE,
        message: errorMessage,
      });
      if (hasComment) {
        AppDispatcher.dispatch({
          actionType: CREATE_COMMENT_FAILURE,
          message: 'comment.submit_error',
        });
      }
      throw error;
    });
  },

  deleteVote: (selectionStep, proposal, successMessage = 'proposal.request.delete_vote.success', errorMessage = 'proposal.request.delete_vote.failure') => {
    AppDispatcher.dispatch({
      actionType: DELETE_PROPOSAL_VOTE,
      proposal: proposal,
      selectionStep: selectionStep,
    });
    return Fetcher
      .delete(`/selection_steps/${selectionStep}/proposals/${proposal}/vote`)
      .then(() => {
        AppDispatcher.dispatch({
          actionType: DELETE_PROPOSAL_VOTE_SUCCESS,
          message: successMessage,
        });
        return true;
      })
      .catch(() => {
        AppDispatcher.dispatch({
          actionType: DELETE_PROPOSAL_VOTE_FAILURE,
          message: errorMessage,
        });
        return false;
      });
  },

};
