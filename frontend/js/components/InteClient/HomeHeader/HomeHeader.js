// @flow
import * as React from 'react';
import { Container, Tag, type Colors } from './HomeHeader.style';
import Icon, { ICON_NAME } from '~ui/Icons/Icon';
import config from '~/config';

export type Props = {
  title: string,
  description: string,
  img: string,
  style?: Object,
  tag: {
    icon?: string,
    text: string,
    colors: Colors,
    mobileColors: Colors,
  },
  mainLink: {
    link: string,
    text: string,
    colors: Colors,
  },
  secondLink: {
    link: string,
    text: string,
    textColor: string,
  },
};

const HomeHeader = ({ title, description, img, tag, mainLink, secondLink, style }: Props) => (
  <Container style={style} mainLinkColors={mainLink.colors} secondLinkColor={secondLink.textColor}>
    <div>
      <Tag colors={config.isMobile ? tag.mobileColors : tag.colors}>
        {tag.icon && <Icon name={tag.icon} size={20} color={tag.colors.text} />}
        <span>{tag.text}</span>
      </Tag>

      <h1 dangerouslySetInnerHTML={{ __html: title }} />
      <p className="description">{description}</p>

      <div className="wrapper-link">
        <a href={mainLink.link} className="main-link">
          {mainLink.text}
        </a>
        <a href={secondLink.link} className="second-link">
          <span>{secondLink.text}</span>
          <Icon name={ICON_NAME.arrowRight} size={16} color={secondLink.textColor} />
        </a>
      </div>
    </div>

    <div className="illustration-wrapper">
      <img src={img} alt="" className="illustration" />
    </div>
  </Container>
);

export default HomeHeader;
