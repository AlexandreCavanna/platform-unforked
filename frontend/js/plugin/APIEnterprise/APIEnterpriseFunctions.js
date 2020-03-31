// @flow
import {fetchQuery} from 'react-relay';
import {checkRNA, checkSiret} from '~/services/Validator';
import environment from '~/createRelayEnvironment';
import {
  API_ENTERPRISE_ASSOC,
  API_ENTERPRISE_ASSOC_DOC,
  API_ENTERPRISE_ASSOC_DOC_RNA,
  API_ENTERPRISE_ASSOC_RNA,
  API_ENTERPRISE_DOC_ENTER,
  API_ENTERPRISE_DOC_PUB_ORGA,
  API_ENTERPRISE_ENTER,
  API_ENTERPRISE_PUB_ORGA,
  autocompleteFromId,
  autocompleteFromSiret,
  dispatchValuesToForm,
  fetchAPIDocuments,
} from '~/plugin/APIEnterprise/APIEnterpriseConstants';
import type { Dispatch } from '~/types';
import type {Questions} from "~/components/Form/Form.type";

const getApiEnterpriseType = (type: string): string => {
  switch (type.trim().toLowerCase()) {
    case 'une entreprise':
    case 'un autre organisme privé':
      return API_ENTERPRISE_ENTER;
    case 'une association':
      return API_ENTERPRISE_ASSOC;
    case 'un organisme public':
      return API_ENTERPRISE_PUB_ORGA;
    default:
      throw new Error('This type of enterprise is not handled currently.');
  }
};

// TODO @Vince utiliser quelque chose comme SyntheticEvent<> & { currentTarget: HTMLInputElement }
export const triggerAutocompleteAPIEnterprise = (dispatch: Dispatch, event: any, questions: Questions) => {
  if (event && event.currentTarget) {
    if (event.currentTarget.getAttribute('type') === 'siret') {
      const text: string = event.currentTarget.value.replace(/\s/g, '');
      const type = $('input[name="choices-for-field-proposal-form-responses10"]:checked').val();
      const apiEnterpriseType = getApiEnterpriseType(type);

      if (checkSiret(text)) {
        const params = { type: apiEnterpriseType, siret: text };
        fetchQuery(environment, autocompleteFromSiret, params).then(res => {
          dispatchValuesToForm(dispatch, res, apiEnterpriseType, questions);
        });
        if (apiEnterpriseType === API_ENTERPRISE_ASSOC) {
          fetchQuery(environment, fetchAPIDocuments, { id: text, type: apiEnterpriseType }).then(
            doc => {
              dispatchValuesToForm(dispatch, doc, API_ENTERPRISE_ASSOC_DOC, questions);
            },
          );
        } else {
          const docQueryType =
            apiEnterpriseType === API_ENTERPRISE_ENTER
              ? API_ENTERPRISE_DOC_ENTER
              : API_ENTERPRISE_DOC_PUB_ORGA;
          fetchQuery(environment, fetchAPIDocuments, { id: text, type: apiEnterpriseType }).then(
            doc => {
              dispatchValuesToForm(dispatch, doc, docQueryType, questions);
            },
          );
        }
      }
    } else if (event.currentTarget.getAttribute('type') === 'rna') {
      const id: string = event.currentTarget.value.replace(/\s/g, '');
      if (checkRNA(id)) {
        fetchQuery(environment, autocompleteFromId, { id }).then(res => {
          dispatchValuesToForm(dispatch, res, API_ENTERPRISE_ASSOC_RNA, questions);
        });
        fetchQuery(environment, fetchAPIDocuments, { id, type: API_ENTERPRISE_ASSOC }).then(res => {
          dispatchValuesToForm(dispatch, res, API_ENTERPRISE_ASSOC_DOC_RNA, questions);
        });
      }
    }
  }
};