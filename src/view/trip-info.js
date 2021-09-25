import AbstractView from './abstract';

const createTripInfoTemplate = () => '<section class="trip-main__trip-info  trip-info"></section>';

class TripInfo extends AbstractView {
  getTemplate() {
    return createTripInfoTemplate();
  }
}

export default TripInfo;
