// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import RankingLabelContainer from './RankingLabel.style';
import Image from '~/components/Ui/Medias/Image';
import Label from '~/components/Ui/DragnDrop/Label/Label';
import Icon from '~/components/Ui/Icons/Icon';

type RankingLabelProps = {
  label: string,
  description?: string | null,
  image?: {
    url: string,
  } | null,
  isSelected?: boolean,
  onPick?: () => void,
};

const RankingLabel = ({ label, image, description, isSelected, onPick }: RankingLabelProps) => (
  <RankingLabelContainer>
    <Label>{label}</Label>
    {description && <p className="description">{description}</p>}
    {image && image.url && <Image src={image.url} width="100%" />}

    {!isSelected && (
      <button type="button" onClick={onPick} className="btn-pick-item">
        <Icon name="arrow-thick-circle-down" size={18} viewBox="0 0 18 18" />
        <FormattedMessage id="global.form.ranking.select" />
      </button>
    )}
  </RankingLabelContainer>
);

export default RankingLabel;
