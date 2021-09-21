import AbstractView from './abstract';

const createLoadingTemplate = () => '<p class="trip-events__msg">Loading...</p>';

export default class Loading extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}
