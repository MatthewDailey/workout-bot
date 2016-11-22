
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
    this.followedByCircuit = undefined;
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

  withFollowingCircuit(circuit) {
    this.followedByCircuit = circuit;
    return this;
  }

  build() {
    if (this.exerciseList.length < this.numExercises) {
      throw Error(`Tried to build circuit with ${this.numExercises} from list with`
        + ` only ${this.exerciseList.length} options.`);
    }

    let exercisesInCurcuit = pickRandomFromList(this.exerciseList, this.numExercises);

    if (this.followedByCircuit) {
      exercisesInCurcuit = exercisesInCurcuit.concat(this.followedByCircuit.exercises);
    }

    return {
      name: this.name,
      numRounds: this.numRounds,
      exercises: exercisesInCurcuit,
    };
  }
}
