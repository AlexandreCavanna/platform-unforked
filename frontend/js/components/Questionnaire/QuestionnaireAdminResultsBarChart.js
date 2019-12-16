// @flow
import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { injectIntl, type IntlShape } from 'react-intl';
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { QuestionnaireAdminResultsBarChart_multipleChoiceQuestion } from '~relay/QuestionnaireAdminResultsBarChart_multipleChoiceQuestion.graphql';
import { cleanMultipleChoiceQuestion } from '../../utils/cleanMultipleChoiceQuestion';

type Props = {
  multipleChoiceQuestion: QuestionnaireAdminResultsBarChart_multipleChoiceQuestion,
  backgroundColor: string,
  intl: IntlShape,
};

export class QuestionnaireAdminResultsBarChart extends React.Component<Props> {
  getYAxisWidth = (data: Array<Object>): number => {
    const test = data.reduce((acc, curr) => {
      acc.push(curr.name.length);
      return acc;
    }, []);

    const maxLength = Math.max(...test);

    if (test.length > 0 && maxLength > 50) {
      return maxLength * 2;
    }

    return 120;
  };

  render() {
    const { multipleChoiceQuestion, backgroundColor, intl } = this.props;

    const data = cleanMultipleChoiceQuestion(multipleChoiceQuestion, intl);

    const containerHeight = data.length * 75;

    return (
      <ResponsiveContainer height={containerHeight}>
        <BarChart data={data} layout="vertical" margin={{ top: 15, right: 5, bottom: 15, left: 5 }}>
          <XAxis type="number" allowDecimals={false} tickLine={false} />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            width={this.getYAxisWidth(data)}
          />{' '}
          <Bar dataKey="value" maxBarSize={30} fill={backgroundColor}>
            {' '}
            <LabelList dataKey="value" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

const container = injectIntl(QuestionnaireAdminResultsBarChart);

export default createFragmentContainer(container, {
  multipleChoiceQuestion: graphql`
    fragment QuestionnaireAdminResultsBarChart_multipleChoiceQuestion on MultipleChoiceQuestion {
      choices(allowRandomize: false) {
        title
        responses {
          totalCount
        }
      }
      isOtherAllowed
      otherResponses {
        totalCount
      }
    }
  `,
});