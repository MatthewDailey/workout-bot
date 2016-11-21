
function pickRandomFromList(list, numToPick) {
  const pickedIndexes = {};
  const pickedElements = [];

  while (pickedElements.length < numToPick) {
    const index = Math.floor(Math.random() * list.length);

    if (!pickedIndexes[index]) {
      pickedElements.push(list[index]);
      pickedIndexes[index] = true;
    }
  }
  return pickedElements;
}

export default class CircuitBuilder {
  constructor(exerciseList) {
    this.exerciseList = exerciseList;
    this.numRounds = 1;
    this.numExercises = 1;
    this.name = '';
  }

  withNumRounds(numRounds) {
    this.numRounds = numRounds;
    return this;
  }

  withNumExercises(numExercises) {
    this.numExercises = numExercises;
    return this;
  }

  withName(name) {
    this.name = name;
    return this;
  }

  build() {
    if (this.exerciseList.length < this.numExercises) {
      throw Error(`Tried to build circuit with ${this.numExercises} from list with`
        + ` only ${this.exerciseList.length} options.`);
    }

    const exercisesInCurcuit = pickRandomFromList(this.exerciseList, this.numExercises);

    return {
      name: this.name,
      numRounds: this.numRounds,
      exercises: exercisesInCurcuit,
    };
  }
}
