// @flow
import styled, { type StyledComponent } from 'styled-components';

export const EventMapPreviewContainer: StyledComponent<{}, {}, HTMLDivElement> = styled.div.attrs({
  className: 'eventMapPreview',
})`
  .card {
    margin: 0;
    border: none;
  }

  .eventImage {
    height: 83px;
  }

  .card__title {
    margin-bottom: 10px;
    font-weight: 600;
  }
`;

export default EventMapPreviewContainer;