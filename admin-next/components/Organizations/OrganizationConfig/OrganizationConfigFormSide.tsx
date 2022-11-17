import * as React from 'react';
import { Control } from 'react-hook-form';
import { FormValues } from './OrganizationConfigForm';
import {
    Accordion,
    CapUIAccordionSize,
    FormGuideline,
    FormLabel,
    Text,
    UPLOADER_SIZE,
} from '@cap-collectif/ui';
import { FieldInput, FormControl } from '@cap-collectif/form';
import { UPLOAD_PATH } from '@utils/config';
import { useIntl } from 'react-intl';

export interface OrganizationConfigFormSideProps {
    control: Control<FormValues>;
}

const OrganizationConfigFormSide: React.FC<OrganizationConfigFormSideProps> = ({ control }) => {
    const intl = useIntl();
    return (
        <Accordion allowMultiple size={CapUIAccordionSize.Sm}>
            <Accordion.Item id="volet-1">
                <Accordion.Button>
                    {intl.formatMessage({ id: 'organisation.form.logo.banner' })}
                </Accordion.Button>
                <Accordion.Panel>
                    <FormControl name="logo" control={control} width="100%">
                        <FormLabel label={intl.formatMessage({ id: 'image.logo' })}>
                            <Text fontSize={2} color="gray.500">
                                {intl.formatMessage({ id: 'global.optional' })}
                            </Text>
                        </FormLabel>
                        <FormGuideline>
                            {intl.formatMessage(
                                { id: 'supported.format.listed' },
                                { format: 'jpg, png' },
                            )}{' '}
                            {intl.formatMessage({ id: 'specific-max-weight' }, { weight: '300Ko' })}
                        </FormGuideline>

                        <FieldInput
                            type="uploader"
                            name="logo"
                            control={control}
                            format=".jpg,.jpeg,.png"
                            maxSize={204800}
                            size={UPLOADER_SIZE.SM}
                            uploadURI={UPLOAD_PATH}
                            showThumbnail
                        />
                    </FormControl>
                    <FormControl name="banner" control={control} width="100%">
                        <FormLabel label={intl.formatMessage({ id: 'image.banner' })}>
                            <Text fontSize={2} color="gray.500">
                                {intl.formatMessage({ id: 'global.optional' })}
                            </Text>
                        </FormLabel>
                        <FormGuideline>
                            {intl.formatMessage(
                                { id: 'supported.format.listed' },
                                { format: 'jpg, png' },
                            )}
                            {intl.formatMessage({ id: 'specific-max-weight' }, { weight: '1Mo' })}
                            {intl.formatMessage(
                                { id: 'min-size-dynamic' },
                                { width: '800', height: '500' },
                            )}
                        </FormGuideline>

                        <FieldInput
                            type="uploader"
                            name="banner"
                            control={control}
                            format=".jpg,.jpeg,.png"
                            maxSize={204800}
                            size={UPLOADER_SIZE.SM}
                            uploadURI={UPLOAD_PATH}
                            showThumbnail
                        />
                    </FormControl>
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item id="volet-2">
                <Accordion.Button>{intl.formatMessage({ id: 'social-medias' })}</Accordion.Button>
                <Accordion.Panel>
                    <FormControl name="socialNetworks.webPageUrl" control={control}>
                        <FormLabel
                            htmlFor="socialNetworks.webPageUrl"
                            label={intl.formatMessage({ id: 'form.label_website' })}
                        />
                        <FieldInput
                            id="socialNetworks.webPageUrl"
                            name="socialNetworks.webPageUrl"
                            control={control}
                            type="text"
                            placeholder={intl.formatMessage({
                                id: 'admiun.project.create.title.placeholder',
                            })}
                        />
                    </FormControl>
                    <FormControl name="socialNetworks.twitterUrl" control={control}>
                        <FormLabel
                            htmlFor="socialNetworks.twitterUrl"
                            label={intl.formatMessage({ id: 'user.profile.show.twitter' })}
                        />
                        <FieldInput
                            id="socialNetworks.twitterUrl"
                            name="socialNetworks.twitterUrl"
                            control={control}
                            type="text"
                            placeholder={intl.formatMessage({
                                id: 'admiun.project.create.title.placeholder',
                            })}
                        />
                    </FormControl>
                    <FormControl name="socialNetworks.facebookUrl" control={control}>
                        <FormLabel
                            htmlFor="socialNetworks.facebookUrl"
                            label={intl.formatMessage({ id: 'share.facebook' })}
                        />
                        <FieldInput
                            id="socialNetworks.facebookUrl"
                            name="socialNetworks.facebookUrl"
                            control={control}
                            type="text"
                            placeholder={intl.formatMessage({
                                id: 'admiun.project.create.title.placeholder',
                            })}
                        />
                    </FormControl>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};

export default OrganizationConfigFormSide;