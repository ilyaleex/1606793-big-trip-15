
class Waypoint {
  constructor(
    id,
    basePrice,
    dateFrom,
    dateTo,
    destinationId,
    isFavorite,
    selectedOfferIds,
    typeId) {
    this._id = id;
    this._basePrice = basePrice;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._destinationId = destinationId;
    this._isFavorite = isFavorite;
    this._selectedOfferIds = selectedOfferIds;
    this._typeId = typeId;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get basePrice() {
    return this._basePrice;
  }

  set basePrice(value) {
    this._basePrice = value;
  }

  get dateFrom() {
    return this._dateFrom;
  }

  set dateFrom(value) {
    this._dateFrom = value;
  }

  get dateTo() {
    return this._dateTo;
  }

  set dateTo(value) {
    this._dateTo = value;
  }

  get destinationId() {
    return this._destinationId;
  }

  set destinationId(value) {
    this._destinationId = value;
  }

  get isFavorite() {
    return this._isFavorite;
  }

  set isFavorite(value) {
    this._isFavorite = value;
  }

  get selectedOfferIds() {
    return this._selectedOfferIds;
  }

  set selectedOfferIds(value) {
    this._selectedOfferIds = value;
  }

  get typeId() {
    return this._typeId;
  }

  set typeId(value) {
    this._typeId = value;
  }

  addSelectedOffer(selectedOfferId) {
    this._selectedOfferIds.push(selectedOfferId);
  }

  removeSelectedOffer(selectedOfferId) {
    this._selectedOfferIds = this._selectedOfferIds.filter((x) => x !== selectedOfferId);
  }
}

export default Waypoint;
