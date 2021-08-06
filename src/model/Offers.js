class Offers {
  constructor(id, typeId, offers) {
    this._id = id;
    this._typeId = typeId;
    this._offers = offers;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get typeId() {
    return this._typeId;
  }

  set typeId(value) {
    this._typeId = value;
  }

  get offers() {
    return this._offers;
  }

  set offers(value) {
    this._offers = value;
  }
}

export default Offers;
