// @flow
import * as React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { FormattedMessage } from 'react-intl';
import ProposalMediaResponse from './ProposalMediaResponse';
import TitleInvertContrast from '../../Ui/Typography/TitleInvertContrast';
import type { ProposalResponse_response } from '~relay/ProposalResponse_response.graphql';
import PrivateBox from '../../Ui/Boxes/PrivateBox';
import WYSIWYGRender from '../../Form/WYSIWYGRender';
import { isHTML } from '../../../utils/isHtml';

type Props = {|
  +response: ProposalResponse_response,
|};

type RadioType = {|
  +labels: [string],
  +other: string,
|};

export class ProposalResponse extends React.PureComponent<Props> {
  renderUniqueLabel = (radioLabels: ?RadioType) => {
    if (!radioLabels) {
      return null;
    }

    if (radioLabels.labels && Array.isArray(radioLabels.labels)) {
      if (radioLabels.labels[0]) {
        return <p>{radioLabels.labels[0]}</p>;
      }
    }

    if (radioLabels.other) {
      return <p>{radioLabels.other}</p>;
    }

    return null;
  };

  getEmptyResponseValue = () => {
    const { response } = this.props;

    return (
      <div className="block">
        <h3 className="h3">{response.question.title}</h3>
        <p className="excerpt">
          <FormattedMessage id="project.votes.widget.no_value" />
        </p>
      </div>
    );
  };

  render() {
    const { response } = this.props;
    const questionType = response.question.type;
    const responseWithJSON =
      response.question.__typename === 'MultipleChoiceQuestion' &&
      response.question.type !== 'select';
    const defaultEditorEmptyValue = '<p><br></p>';
    let value = '';
    if (questionType === 'section') {
      return (
        <div>
          <TitleInvertContrast>{response.question.title}</TitleInvertContrast>
        </div>
      );
    }

    if (
      (questionType === 'medias' && response.medias && response.medias.length === 0) ||
      (questionType === 'editor' && response.value === defaultEditorEmptyValue) ||
      ((!response.value || response.value.length === 0) && questionType !== 'medias')
    ) {
      return this.getEmptyResponseValue();
    }

    if (responseWithJSON && response.value) {
      let responseValue = null;
      try {
        responseValue = JSON.parse(response.value);
      } catch (e) {
        // console.error('Could not parse JSON.');
      }
      if (!responseValue) {
        // In case JSON is not valid, we show an empty response.
        return this.getEmptyResponseValue();
      }
      if (responseValue.labels && Array.isArray(responseValue.labels)) {
        const labelsValue = responseValue.labels.filter(el => el != null);
        const otherValue = responseValue.other;

        if (!otherValue && labelsValue.length === 0) {
          return this.getEmptyResponseValue();
        }
      }
    }

    switch (response.question.type) {
      case 'medias':
        value = (
          <div>
            <h3 className="h3">{response.question.title}</h3>
            {/* $FlowFixMe */}
            <ProposalMediaResponse medias={response.medias} />
          </div>
        );
        break;

      case 'radio':
      case 'checkbox':
      case 'button': {
        const radioLabels = JSON.parse(response.value || '');
        if (radioLabels && !radioLabels.labels) {
          value = (
            <div>
              <h3 className="h3">{response.question.title}</h3>
              <p>{radioLabels}</p>
            </div>
          );
        } else {
          value = (
            <div>
              <h3 className="h3">{response.question.title}</h3>
              {radioLabels && radioLabels.labels.length > 1 ? (
                <ul>
                  {radioLabels.labels.map((label, index) => (
                    <li key={index}>{label}</li>
                  ))}
                  {radioLabels.other && <li>{radioLabels.other}</li>}
                </ul>
              ) : (
                this.renderUniqueLabel(radioLabels)
              )}
            </div>
          );
        }
        break;
      }
      case 'ranking': {
        const radioLabels = JSON.parse(response.value || '');
        if (radioLabels && !radioLabels.labels) {
          value = (
            <div>
              <h3 className="h3">{response.question.title}</h3>
              <p>{radioLabels}</p>
            </div>
          );
        } else {
          value = (
            <div>
              <h3 className="h3">{response.question.title}</h3>
              <ol>
                {radioLabels &&
                  radioLabels.labels.map((label, index) => <li key={index}>{label}</li>)}
              </ol>
            </div>
          );
        }
        break;
      }

      default: {
        let responseValue = '';
        if (response.question.type !== 'number') {
          try {
            responseValue = JSON.parse(response.value || '');
          } catch (e) {
            responseValue = response.value || '';
          }

          responseValue = (
            <WYSIWYGRender
              value={(responseValue && responseValue.toString().replace(/\n/g, '<br />')) || ''}
            />
          );
        } else {
          // it's a number
          responseValue = response.value || '';
          responseValue = <p>{responseValue}</p>;
        }

        value = (
          <div>
            <h3 className="h3">{response.question.title}</h3>
            {response.value && isHTML(response.value) ? (
              <WYSIWYGRender value={response.value} />
            ) : (
              responseValue
            )}
          </div>
        );
      }
    }

    return <PrivateBox show={response.question.private} children={value} divClassName="block" />;
  }
}

export default createFragmentContainer(ProposalResponse, {
  response: graphql`
    fragment ProposalResponse_response on Response {
      question {
        __typename
        ...responsesHelper_question @relay(mask: false)
      }
      ... on ValueResponse {
        value
      }
      ... on MediaResponse {
        medias {
          ...ProposalMediaResponse_medias
        }
      }
    }
  `,
});