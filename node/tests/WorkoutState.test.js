import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import WorkoutState from '../src/WorkoutState';
import CircuitBuilder from '../src/CircuitBuilder';

chai.use(dirtyChai);

const testSimpleCircuit = new CircuitBuilder(
  [
    {
      description: 'low angle oblique cable twist',
      durationSeconds: null,
      reps: 15,
      gif: null,
    },
    {
      description: 'bogo board slider knee ins',
      durationSeconds: null,
      reps: 15,
      gif: null,
    },
  ])
  .withNumRounds(2)
  .withName('Core')
  .withNumExercises(2)
  .build();

const testCircuits = [testSimpleCircuit];

describe('WorkoutState', () => {
  it('can be instantiated without args', () => {
    expect(new WorkoutState()).to.exist();
  });

  describe('isComplete', () => {
    it('defaults to complete', () => {
      expect(new WorkoutState().isCompleted()).to.be.true();
    });

    it('is not complete if circuit passed in', () => {
      expect(new WorkoutState(testCircuits).isCompleted()).to.be.false();
    });
  });

  describe('toObject', () => {
    it('defaults to created empty object', () => {
      const workoutStateObject = new WorkoutState().toObject();
      expect(workoutStateObject.circuits.length).to.equal(0);
      expect(workoutStateObject.position.circuitIndex).to.equal(0);
      expect(workoutStateObject.position.roundIndex).to.equal(0);
      expect(workoutStateObject.position.exerciseIndex).to.equal(0);
    });

    it('returns circuit and position objects', () => {
      const testPosition = {};
      const workoutStateObject = new WorkoutState(testCircuits, testPosition).toObject();

      expect(workoutStateObject.circuits).to.equal(testCircuits);
      expect(workoutStateObject.position).to.equal(testPosition);
    });
  });

  describe('getCurrentExercise', () => {
    it('returns undefined not initialized', () => {
      expect(new WorkoutState().getCurrentExercise()).to.equal(undefined);
    });

    it('returns first exercise of first circuit on start', () => {
      expect(new WorkoutState(testCircuits).getCurrentExercise())
        .to.equal(testSimpleCircuit.exercises[0]);
    });
  });
});
