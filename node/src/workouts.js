import CircuitBuilder from './CircuitBuilder';
import WorkoutState from './WorkoutState';
import { loadWorkoutByOwner, storeWorkoutByOwner, deleteWorkoutByOwner } from './WorkoutConnector';

// Pick 2, 3 rounds
const compoundOptions = [
  'Static lunge + one arm cable row - 15 reps per arm',
  'Static lunge + 2 arm cable row - 15 reps',
  'Squat + row - 10 reps',
  'Walking lunge + neutral grip dumbbell curl + neutral grip shoulder press - 20 steps/presses',
  'Wall sit + lateral dumbbell shoulder raise - 10 reps for the raise + 30 second additional wall sit with weight',
  'Kettlebell deadlift + low row/chin raise - 15 reps',
  'Thrusters (half squat + neutral grip dumbbell press) - 20 reps'
];

// Pick 1, 3 rounds. If do this, skip compound.
const fullBodyOptions = [
  'Barbell back squat - 12, 10, 8 reps',
  'Hex bar or barbell deadlift - 8, 6, 4 reps',
];

// Pick 3, 2 rounds
const lowerBodyOptions = [
  'trx one leg squats - 10 reps each leg',
  'trx two leg squats - 20 reps',
  'trx jump squats - 15 reps',
  'trx hamstring press (heels in straps) - 10 reps',
  'leg press machine - 15 reps',
  'heavy dumbbell walking lunges - 16 steps',
  'kettlebell front squat - 15 reps',
  'box jumps - 12 jumps',
  'hamstring curl machine - 8 reps',
  'jumping lunges - 40 reps',
  'one leg dumbbell toe touch - 10 reps each leg',
];

// Pick 2, 2 rounds.
const backOptions = [
  'kneeling dumbbell row  - 8 reps',
  'rear deltoid/back fly machine - 12 reps',
  'pull ups (use assisted machine if needed and available) - 8 reps',
  'chin ups (use assisted machine if needed and available) - 8 reps',
  'lat pull down machine - 10 reps',
  'trx rows - 15 reps',
  'standing barbell high pull - 8 reps',
  'static squat + 2 arm row - 20 reps',
  'seated machine rows - 12 reps'
];

// Pick 2, 2 rounds.
const chestOptions = [
  'neutral grip dumbell chest press on swiss ball - 12 reps',
  'conventional grip dumbell chest press on swiss ball- 10 reps',
  'Alternating dumbell chest press on swiss ball (either grip) - 16 reps (8 per arm, hold one arm up while pressing with the other',
  'dumbell chest fly on swiss ball - 10 reps',
  'barbell bench press - 5-8 reps',
  'push ups - 15 reps',
  'tricep isolation push ups - 20 reps',
  'push ups with feet elevated - 15 reps',
  'machine chest flys - 10 reps',
];

const cardioOptions = [
  'jump rope - 120 singles',
  'bike - seated 30 seconds, standing 30 seconds - 3 minutes',
  '3 minute 5% incline treadmill run',
  '15 burpees',
  '3 minutes high intensity elliptical machine - 80% effort',
  '1/3 mile run',
];

const coreExercises = require('../exercises/core.json');
const compoundExercises = require('../exercises/compound.json');

function buildFreshWorkout() {
  const coreCircuit = new CircuitBuilder(coreExercises)
    .withNumExercises(6)
    .withNumRounds(2)
    .withName('Core')
    .build();

  const compoundCircuit = new CircuitBuilder(compoundExercises)
    .withNumExercises(2)
    .withNumRounds(3)
    .withName('Compound')
    .build();

  return new WorkoutState([coreCircuit, compoundCircuit]);
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
