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

const testCircuits = [ testSimpleCircuit ];


describe('WorkoutState', () => {
  it('can be instantiated without args', () => {
    expect(new WorkoutState()).to.exist();
  });

  it('defaults to complete', () => {
    expect(new WorkoutState().isCompleted()).to.be.true();
  });

  it('is not complete if circuit passed in', () => {
    expect(new WorkoutState(testCircuits).isCompleted()).to.be.false();
  });
});
