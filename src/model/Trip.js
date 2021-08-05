class Trip {
  constructor(waypoints) {
    this._waypoints = waypoints;
  }

  get waypoints() {
    return this._waypoints;
  }

  set waypoints(value) {
    this._waypoints = value;
  }
}

export default Trip;
