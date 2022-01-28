// @flow
import React from 'react';
import {
  getButtonContentForType,
  getButtonLinkForType,
  type LoginSocialButtonType,
} from '~ui/Button/LoginSocialButton';
import SocialIcon from '~ui/Icons/SocialIcon';
import { baseUrl } from '~/config';
import Link from '~ds/Link/Link';
import {
  FranceConnectButton,
  LinkButton,
  LoginParisButton,
  PrimarySSOButton,
  SecondarySSOButton,
  TertiarySSOButton,
} from '~/components/User/Invitation/SSOButton.style';

type Props = {|
  +primaryColor: string,
  +btnTextColor: string,
  +type: LoginSocialButtonType | 'loginParis',
  +index?: number,
  +switchUserMode?: boolean,
  +text?: string,
|};

const SSOButton = ({ primaryColor, btnTextColor, type, index, switchUserMode, text }: Props) => {
  if (type === 'loginParis') {
    const backUrl = `${baseUrl}/login-paris?_destination=${baseUrl}`;
    const redirectUrl = `https://moncompte.paris.fr/moncompte/jsp/site/Portal.jsp?page=myluteceusergu&view=createAccountModal&back_url=${backUrl}`;

    return (
      <LoginParisButton>
        <Link
          href={redirectUrl}
          target="_blank"
          width="100%"
          display="flex"
          justifyContent="center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 553.71 146">
            <title>logo-paris</title>
            <path
              fill="#002542"
              d="M224.11 27.8h-34.2v90.4h20.7V89.8h13.6c17.8 0 31.6-13.8 31.6-31s-13.81-31-31.7-31zm0 42.6h-13.6V47.2h13.6c6.4 0 11 5 11 11.6s-4.6 11.6-11 11.6zM444.91 27.8h20.7v90.4h-20.7zM423.11 58.8a30.9 30.9 0 0 0-31-31H356v90.4h20.7V89.8h10.5l16.3 28.4h22.2l-19-32.7c10.01-4.7 16.41-15.6 16.41-26.7zm-30.9 13h-15.5V47.2h15.5c5.7 0 10.3 5.3 10.3 12.3s-4.6 12.3-10.3 12.3zM286.21 27.8l-30.7 90.4h22.6l5-15.9a66.61 66.61 0 0 0 32.4 0l5.1 15.9h22.6l-30.7-90.4zm13.1 58.4a41.83 41.83 0 0 1-10.7-1.3l10.7-33.5L310 84.9a46.79 46.79 0 0 1-10.69 1.3zM528.11 65.3c-14-4.2-19.7-6.6-19.7-12.3 0-4.3 4.1-6.8 9.7-6.8 9 0 12.7 4.8 15.8 9.3l17.2-9.1c-2.9-5.7-11.3-20.4-33-20.4-15.3 0-30.3 9.7-30.3 27.5 0 21.3 20.3 25.3 26.6 27.5s18.7 3.8 18.7 11.5c0 5.4-5.6 7.4-12.9 7.4-8.1 0-14.6-4.5-18.6-11.4L484 97.7c1.3 3.8 11.6 22.3 36.1 22.3 19.3 0 33.6-10.2 33.6-27.8.01-13.9-7.59-21.6-25.59-26.9zM157.51 86.7c-.6 0-1 .5-1.7 1.9-14.4 31.6-41 46.7-69.1 46.9-56.1.4-69.3-45.7-69.6-47l28.6 5.3c.1.3 11.1 25.5 40 25.5 30.6 0 51.8-30.5 51.8-62 0-28.4-12-44.6-29.3-57.3l-77.9 36a.79.79 0 0 0 .2 1.5c43.1 10 50.5 41 48.4 58.6-.3 2.6 1.4 2.2 3.1-2.7 5.9-17.5 1.7-42.9-21.7-57.2 0 0 43.3-21.7 43.3-21.6 5.2 4 22.2 15.5 22.2 42.8s-15.8 52.1-40.1 52.1c-24.1 0-32.5-24.6-32.7-25L1.51 73.3A1.23 1.23 0 0 0 0 74.6C4.5 113.9 35.9 146 81.5 146c37.8 0 63.5-20.8 74.4-50.1 2.51-6.8 2.41-9.2 1.61-9.2z"
            />
          </svg>
        </Link>
      </LoginParisButton>
    );
  }

  const redirectUri = switchUserMode ? `${baseUrl}/sso/switch-user` : baseUrl;

  const link = getButtonLinkForType(type, redirectUri, true);
  const linkText = text ?? getButtonContentForType(type);

  if (type === 'facebook') {
    return (
      <LinkButton type="facebook">
        <SocialIcon className="loginIcon" name={type} />
        <a href={link} title={type} target="_blank" rel="noreferrer">
          <span>{linkText}</span>
        </a>
      </LinkButton>
    );
  }

  if (type === 'franceConnect') {
    return (
      <FranceConnectButton>
        <Link href={link} target="_blank" width="100%">
          <SocialIcon className="loginIcon" name={type} />
        </Link>
      </FranceConnectButton>
    );
  }

  if (index === 0) {
    return (
      <PrimarySSOButton
        backgroundColor={primaryColor}
        textColor={btnTextColor}
        href={link}
        target="_blank">
        {linkText}
      </PrimarySSOButton>
    );
  }

  if (index === 1) {
    return (
      <SecondarySSOButton
        borderColor={primaryColor}
        textColor={primaryColor}
        href={link}
        target="_blank">
        {linkText}
      </SecondarySSOButton>
    );
  }

  return (
    <TertiarySSOButton textColor={primaryColor} href={link} target="_blank">
      {linkText}
    </TertiarySSOButton>
  );
};

export default SSOButton;
