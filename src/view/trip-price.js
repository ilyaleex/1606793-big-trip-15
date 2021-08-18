import AbstractView from './abstract';

const calculateTripPrice = (sum, item) => (!item.offers || !(item.offers.length > 0))
  ? sum + item.price
  : item.price + item.offers.reduce(calculateTripPrice, sum);

export const createTripPriceTemplate = (points) => (
  `<p class="trip-info__cost">
     Total: &euro;&nbsp;<span class="trip-info__cost-value">${points.reduce(calculateTripPrice, 0)}</span>
   </p>`
);

export default class TripPrice extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripPriceTemplate(this._points);
  }
}
