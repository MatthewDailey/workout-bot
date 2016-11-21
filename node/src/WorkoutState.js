
const STARTING_POSITION = {
  circuitIndex: 0,
  roundIndex: 0,
  exerciseIndex: 0,
};

export default class WorkoutState {
  constructor(circuits = [], position = STARTING_POSITION) {
    this.circuits = circuits;
    this.position = position;
  }

  /*
   * @returns Object The current exercise, undefined if no such exercise.
   */
  getCurrentExercise() {

  }

  /*
   * @returns Boolean True if workout is completed. False otherwise.
   */
  isCompleted() {
    return this.position.circuitIndex >= this.circuits.length;
  }

  /*
   * @returns Object Representation of workout state as json object { circuits, position }.
   */
  toObject() {

  }

  /*
   * @returns WorkoutState New state object representing the state after transitioning to the next
   * exercise, undefined if workout is complete.
   */
  goToNext() {

  }
}
