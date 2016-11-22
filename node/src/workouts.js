import CircuitBuilder from './CircuitBuilder';
import WorkoutState from './WorkoutState';
import { loadWorkoutByOwner, storeWorkoutByOwner, deleteWorkoutByOwner } from './WorkoutConnector';

const coreExercises = require('../exercises/core.json');
const compoundExercises = require('../exercises/compound.json');
const fullBodyExercises = require('../exercises/fullBody.json');
const lowerBodyExercises = require('../exercises/lowerBody.json');
const backExercises = require('../exercises/back.json');
const chestExercises = require('../exercises/chest.json');
const cardioExercises = require('../exercises/cardio.json');

function buildFreshWorkout() {
  const coreCircuit = new CircuitBuilder(coreExercises)
    .withNumExercises(6)
    .withNumRounds(2)
    .withName('Core')
    .withFollowingCircuit(new CircuitBuilder(cardioExercises).withNumExercises(1).build())
    .build();

  const compoundCircuit = new CircuitBuilder(compoundExercises)
    .withNumExercises(2)
    .withNumRounds(3)
    .withName('Compound')
    .withFollowingCircuit(new CircuitBuilder(cardioExercises).withNumExercises(1).build())
    .build();

  const fullBodyCircuit = new CircuitBuilder(fullBodyExercises)
    .withNumExercises(1)
    .withNumRounds(3)
    .withName('Full-Body')
    .withFollowingCircuit(new CircuitBuilder(cardioExercises).withNumExercises(1).build())
    .build();

  const compoundOrFullBody = Math.random() > 0.5 ? compoundCircuit : fullBodyCircuit;

  const lowerBodyCircuit = new CircuitBuilder(lowerBodyExercises)
    .withNumExercises(3)
    .withNumRounds(2)
    .withName('Lower-Body')
    .build();

  const backCircuit = new CircuitBuilder(backExercises)
    .withNumExercises(2)
    .withNumRounds(2)
    .withName('Back')
    .build();

  const chestCircuit = new CircuitBuilder(chestExercises)
    .withNumExercises(2)
    .withNumRounds(2)
    .withName('Chest')
    .build();

  return new WorkoutState([
    coreCircuit,
    compoundOrFullBody,
    lowerBodyCircuit,
    chestCircuit,
    backCircuit]);
}

export function clearWorkout(userId) {
  return deleteWorkoutByOwner(userId);
}

export function storeWorkout(userId, workout) {
  return storeWorkoutByOwner(userId, workout.toObject());
}

export function getWorkout(userId) {
  return loadWorkoutByOwner(userId)
    .then(workout => {
      if (workout) {
        return new WorkoutState(workout.circuits, workout.position);
      }

      const freshWorkout = buildFreshWorkout();
      return storeWorkout(userId, freshWorkout).then(() => freshWorkout);
    });
}

export default undefined;
