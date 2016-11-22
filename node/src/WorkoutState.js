
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
    if (this.isCompleted()) {
      return undefined;
    }

    return this.circuits[this.position.circuitIndex]
      .exercises[this.position.exerciseIndex];
  }

  getCurrentCircuit() {
    if (this.isCompleted()) {
      return undefined;
    }

    return this.circuits[this.position.circuitIndex]
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
    return {
      circuits: this.circuits,
      position: this.position,
    };
  }

  /*
   * @returns WorkoutState New state object representing the state after transitioning to the next
   * exercise, undefined if workout is complete.
   */
  goToNext() {
    if (this.isCompleted()) {
      return undefined;
    }

    let circuitIndex = this.position.circuitIndex;
    let roundIndex = this.position.roundIndex;
    let exerciseIndex = this.position.exerciseIndex + 1;

    if (exerciseIndex >= this.circuits[this.position.circuitIndex].exercises.length) {
      roundIndex++;
      exerciseIndex = 0;
    }

    if (roundIndex >= this.circuits[this.position.circuitIndex].numRounds) {
      circuitIndex++;
      roundIndex = 0;
    }

    return new WorkoutState(this.circuits, {
      circuitIndex,
      roundIndex,
      exerciseIndex,
    });
  }
}
