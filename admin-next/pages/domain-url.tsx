import {FC} from 'react';
import { useIntl } from 'react-intl';
import Layout from '../components/Layout/Layout';
import { Suspense } from 'react';
import Loader from '~ui/FeedbacksIndicators/Loader';
import withPageAuthRequired from '../utils/withPageAuthRequired';
import RedirectionIO from '../components/RedirectionIO/RedirectionIO';

const DomainUrl: FC = () => {
    const intl = useIntl();

    return (
        <Layout navTitle={intl.formatMessage({ id: 'domain.and.url' })}>
            <Suspense fallback={<Loader />}>
                <RedirectionIO />
            </Suspense>
        </Layout>
    );
};

export const getServerSideProps = withPageAuthRequired;

export default DomainUrl;