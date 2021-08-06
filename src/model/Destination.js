class Destination {
  constructor(id, name, description, pictures) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._pictures = pictures;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
  }

  get pictures() {
    return this._pictures;
  }

  set pictures(value) {
    this._pictures = value;
  }
}

export default Destination;
