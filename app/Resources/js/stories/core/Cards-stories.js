// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select, text } from '@storybook/addon-knobs';
import classNames from 'classnames';
import Card from '../../components/Ui/Card/Card';
import Image from '../../components/Ui/Medias/Image';
import DatesInterval from '../../components/Utils/DatesInterval';
import DateIcon from '../../components/Ui/Dates/DateIcon';
import { UserAvatarDeprecated } from '../../components/User/UserAvatarDeprecated';
import InlineList from '../../components/Ui/List/InlineList';
import { author as authorMock } from '../mocks/users';

const user = authorMock;

const bsStyleOption = {
  Warning: 'warning',
  Danger: 'danger',
  Success: 'success',
  Info: 'info',
  Primary: 'primary',
  Default: 'default',
};

const headerOption = {
  Gray: 'gray',
  White: 'white',
  Green: 'green',
  BlueDark: 'bluedark',
  Blue: 'blue',
  Orange: 'orange',
  Red: 'red',
  Default: 'default',
};

type Props = {|
  +isHighlighted: boolean,
  hasAPicture?: boolean,
|};

class EventCard extends React.Component<Props> {
  static defaultProps = {
    isHighlighted: false,
  };

  render() {
    const { isHighlighted, hasAPicture } = this.props;
    const detailClasses = classNames({
      'highlighted-comment': isHighlighted,
    });
    return (
      <div
        className={`d-flex flex-1-1 event block block--bordered ${detailClasses}`}
        style={{ width: '65%' }}>
        {hasAPicture ? (
          <div
            className="picture_container"
            style={{ backgroundImage: `url('https://picsum.photos/300/400')` }}
          />
        ) : (
          <div className="picture_container" style={{ backgroundColor: '#eeeeee' }}>
            <img className="event__picture" src="../../app/web/svg/calendar.svg" alt="" />
          </div>
        )}

        <div className="d-flex event__infos">
          <div className="col-md-2 col-sm-2 hidden-xs">
            <DateIcon startAt="2030-03-10 00:00:00" />
          </div>

          <div className="event__body event-js">
            <h3 className="event__title">
              <a href title="PHPTourDuFuture">
                PHPTourDuFuture
              </a>
            </h3>

            <p className="excerpt">
              {/* $FlowFixMe */}
              <UserAvatarDeprecated size={16} user={user} />
              <span className="font-weight-semi-bold">{user.username}</span>
            </p>

            <p className="excerpt">
              <i className="cap-calendar-1 mr-10" />
              <DatesInterval startAt="2030-03-10 00:00:00" endAt="2032-06-15 00:00:00" fullDay />
            </p>

            <p className="excerpt">
              <React.Fragment>
                <i className="cap-marker-1 mr-10" />
                Tour Eiffel, 75007 Paris
              </React.Fragment>
            </p>

            <div className="excerpt">
              <i className="cap cap-folder-2 mr-10 r-0" />

              <InlineList separator="," className="d-i">
                <li>
                  <a href="https://capco.dev/themes/immobilier" title="Immobilier">
                    Immobilier
                  </a>
                </li>
              </InlineList>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

storiesOf('Core|Cards', module)
  .add(
    'Card',
    () => {
      const cardType = boolean('Display card type', false, 'Type');
      const type = text('Type', 'My type', 'Type');
      const colorType = text('Type color', '#707070', 'Type');
      const cardHeader = boolean('Display card header', true, 'Header');
      const header = text('Header', 'My header', 'Header');
      const headerBgColor = select('Header background color', headerOption, 'default', 'Header');
      const cardCover = boolean('Display card cover', true, 'Cover');
      const coverHeight = text('Cover height', '175px', 'Cover');
      const leftCover = boolean('Display card cover on left', false, 'Cover');
      const coverWidth = text('Cover width if is display on left', 'auto', 'Cover');
      const cardBody = boolean('Display card body', true, 'Body');
      const title = text('Title', 'Project title', 'Title');
      const titleTagName = text('Title tag name', 'h2', 'Title');
      const cardCounters = boolean('Display card counters', false, 'Counters');
      const cardStatus = boolean('Display card status', true, 'Status');
      const status = text('Status', 'My status', 'Status');
      const statusBgColor = select('Status background color', bsStyleOption, 'default', 'Status');

    // $FlowFixMe
    Card.Cover.displayName = 'Card.Cover';
    // $FlowFixMe
    Card.Type.displayName = 'Card.Type';
    // $FlowFixMe
    Card.Header.displayName = 'Card.Header';
    // $FlowFixMe
    Card.Status.displayName = 'Card.Status';
    Card.Body.displayName = 'Card.Body';
    // $FlowFixMe
    Card.Title.displayName = 'Card.Title';
    Card.Counters.displayName = 'Card.Counters';

    return (
      <Card>
        {cardType && <Card.Type bgColor={colorType}>{type}</Card.Type>}
        {cardHeader && <Card.Header bgColor={headerBgColor}>{header}</Card.Header>}
        {leftCover && (
          <div>
            {cardCover && (
              <div className="col-xs-4 p-0">
                <Card.Cover height={coverHeight} width={coverWidth}>
                  <Image src="https://source.unsplash.com/collection/1127828" alt="Project title" />
                </Card.Cover>
              </div>
            )}
            {cardBody && (
              <div className="col-xs-8 p-0">
                <Card.Body>
                  <Card.Title tagName={titleTagName}>
                    <a href="https://ui.cap-collectif.com">{title}</a>
                  </Card.Title>
                </Card.Body>
              </div>
            )}
          </div>
        )}
        {!leftCover && cardCover && (
          <Card.Cover height={coverHeight}>
            <Image src="https://source.unsplash.com/collection/1127828" alt="Project title" />
          </Card.Cover>
        )}
        {!leftCover && cardBody && (
          <Card.Body>
            <Card.Title tagName={titleTagName}>
              <a href="https://ui.cap-collectif.com">{title}</a>
            </Card.Title>
          </Card.Body>
        )}
        {cardCounters && (
          <Card.Counters>
            <div className="card__counters__item">
              <div className="card__counters__value">0</div>
              <div>Lorem ipsum</div>
            </div>
            <div className="card__counters__item">
              <div className="card__counters__value">40</div>
              <div>Lorem ipsum</div>
            </div>
          </Card.Counters>
        )}
        {cardStatus && <Card.Status bgColor={statusBgColor}>{status}</Card.Status>}
      </Card>
    );
  },
  {
    info: {
      text: `
          <p>Emplacement : <code>import Card from ‘../Ui/Card/Card’;</code></p>

          <p class="mb-20">
            <h5><b>Project card</b></h5>
            Cette carte est composée des éléments suivant :
            <ul>
              <li>Card.Type,</li>
              <li>Card.Cover,</li>
              <li>Card.Body avec à l'intérieur : InlineList, Card.Title, TagsList, ProgressBar.</li>
            </ul>
          </p>

          <p class="mb-20">
            <h5><b>Proposal card</b></h5>
            Cette carte est composée des éléments suivant :
            <ul>
              <li>Card.Body avec à l'intérieur : Media, Card.Title, TagsList, ButtonToolbar.</li>
              <li>Card.Counters</li>
              <li>Card.Status</li>
            </ul>
          </p>


          <p class="mb-20">
            <h5><b>Theme card</b></h5>
            Cette carte est composée des éléments suivant :
            <ul>
              <li>Card.Cover</li>
              <li>Card.Body avec à l'intérieur : Card.Title, InlineList, Label.</li>
            </ul>
          </p>


          <p class="mb-20">
            <h5><b>Event card</b></h5>
            Cette carte est composée des éléments suivant :
            <ul>
              <li>Card.Cover</li>
              <li>Card.Body avec à l'intérieur : Card.Title, InlineList, Label.</li>
            </ul>
          </p>
        `,
      propTablesExclude: [Image, Card.Counters, Card.Body],
    },
  })
  .add('Event Card default', () => <EventCard hasAPicture />, {
    info: {
      text: 'Ce composant est utilisé...',
    },
  })
  .add('Event Card Highlighted', () => <EventCard isHighlighted hasAPicture />, {
    info: {
      text: 'Ce composant est utilisé...',
    },
  })
  .add('Event Card Without Picture', () => <EventCard />, {
    info: {
      text: 'Ce composant est utilisé...',
    },
  });
