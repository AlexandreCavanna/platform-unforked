// @flow
import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import QuestionnaireAdminResultsBarChart from './QuestionnaireAdminResultsBarChart';
import QuestionnaireAdminResultsRanking from './QuestionnaireAdminResultsRanking';
import QuestionnaireAdminResultsPieChart from './QuestionnaireAdminResultsPieChart';
import type { QuestionnaireAdminResults_questionnaire } from './__generated__/QuestionnaireAdminResults_questionnaire.graphql';
import ProposalPrivateField from '../Proposal/ProposalPrivateField';
import withColors from '../Utils/withColors';

type Props = {
  questionnaire: QuestionnaireAdminResults_questionnaire,
  backgroundColor: string,
};

export class QuestionnaireAdminResults extends React.Component<Props> {
  getFormattedResults = (question: Object) => {
    const { backgroundColor } = this.props;

    if (question.participants && question.participants.totalCount === 0) {
      return null;
    }

    if (question.__typename !== 'MultipleChoiceQuestion') {
      return (
        <p className="mb-25">
          <FormattedHTMLMessage id="results-not-available" />
        </p>
      );
    }

    if (question.type === 'checkbox') {
      return (
        <QuestionnaireAdminResultsBarChart
          multipleChoiceQuestion={question}
          backgroundColor={backgroundColor}
        />
      );
    }

    if (question.type === 'radio' || question.type === 'select' || question.type === 'button') {
      return (
        <QuestionnaireAdminResultsPieChart
          multipleChoiceQuestion={question}
          backgroundColor={backgroundColor}
        />
      );
    }

    if (question.type === 'ranking') {
      return <QuestionnaireAdminResultsRanking multipleChoiceQuestion={question} />;
    }

    return null;
  };

  render() {
    const { questionnaire } = this.props;
    const questions = questionnaire.questions.filter(q => q.type !== 'section');

    return (
      <div className="box box-primary container-fluid">
        <div className="box-content mt-25">
          {questionnaire.questions && questions.length > 0 ? (
            questions.map((question, key) => (
              <div key={key}>
                <ProposalPrivateField show={question.private}>
                  <p>
                    <b>
                      {key + 1}. {question.title}
                    </b>
                    <br />
                    <span className="excerpt">
                      {question.participants && question.participants.totalCount !== 0 ? (
                        <FormattedMessage
                          id="global.counters.contributors"
                          values={{ num: question.participants.totalCount }}
                        />
                      ) : (
                        <FormattedMessage id="no-answer" />
                      )}
                      {question.participants &&
                        question.responses &&
                        question.responses.totalCount !== 0 && (
                          <React.Fragment>
                            {' '}
                            /{' '}
                            <FormattedMessage
                              id="count-answers"
                              values={{ num: question.responses.totalCount }}
                            />
                          </React.Fragment>
                        )}
                      <br />
                      {question.required && (
                        <b>
                          <FormattedMessage id="mandatory-question" />
                        </b>
                      )}
                    </span>
                  </p>
                  {this.getFormattedResults(question)}
                </ProposalPrivateField>
              </div>
            ))
          ) : (
            <div>
              <FormattedMessage id="no-question" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const container = withColors(QuestionnaireAdminResults);

export default createFragmentContainer(
  container,
  graphql`
    fragment QuestionnaireAdminResults_questionnaire on Questionnaire {
      questions {
        __typename
        title
        type
        required
        private
        participants {
          totalCount
        }
        responses {
          totalCount
        }
        ...QuestionnaireAdminResultsBarChart_multipleChoiceQuestion
        ...QuestionnaireAdminResultsPieChart_multipleChoiceQuestion
        ...QuestionnaireAdminResultsRanking_multipleChoiceQuestion
      }
    }
  `,
);
