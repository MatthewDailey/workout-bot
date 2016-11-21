import Datastore from '@google-cloud/datastore';

const datastoreClient = Datastore({
  projectId: 'matts-workouts',
});

const KIND_WORKOUT = 'workout';


export function storeWorkout(ownerId, workout) {
  return new Promise((resolve, reject) => {
    const workoutKey = datastoreClient.key([KIND_WORKOUT, ownerId]);

    datastoreClient.save({
      key: workoutKey,
      data: workout,
    }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export function loadWorkout(ownerId) {
  return new Promise((resolve, reject) => {
    const workoutKey = datastoreClient.key([KIND_WORKOUT, ownerId]);

    datastoreClient.get(workoutKey, (error, workout) => {
      if (error) {
        reject(error);
      } else {
        resolve(workout);
      }
    });
  });
}
