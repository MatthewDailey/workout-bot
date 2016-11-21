import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import CircuitBuilder from '../src/CircuitBuilder';

chai.use(dirtyChai);

const testExercisesSimple = [{ test: 'bad exercise' }];
const testExercisesLong = [
  { test: 'bad exercise' }, { test: 'bad exercise' }, { test: 'bad exercise' }];

describe('CircuitBuilder', () => {
  it('can be instantiated', () => {
    expect(new CircuitBuilder([])).to.exist();
  });

  it('can build with valid args', () => {
    const circuit = new CircuitBuilder(testExercisesSimple).build();

    expect(circuit.name).to.equal('');
    expect(circuit.numRounds).to.equal(1);
    expect(circuit.exercises.length).to.equal(1);
    expect(circuit.exercises[0]).to.equal(testExercisesSimple[0]);
  });

  it('can modify name', () => {
    const testName = 'cool circuit';
    const circuit = new CircuitBuilder(testExercisesSimple)
      .withName(testName)
      .build();

    expect(circuit.name).to.equal(testName);
  });

  it('can modify numRounds', () => {
    const testNumRounds = 123;
    const circuit = new CircuitBuilder(testExercisesSimple)
      .withNumRounds(testNumRounds)
      .build();

    expect(circuit.numRounds).to.equal(testNumRounds);
  });

  it('can set numExercises', () => {
    const testNumExercises = testExercisesLong.length - 1;
    const circuit = new CircuitBuilder(testExercisesLong)
      .withNumExercises(testNumExercises)
      .build();

    expect(circuit.exercises.length).to.equal(testNumExercises);
  });
});
