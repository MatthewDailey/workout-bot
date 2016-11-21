import Datastore from '@google-cloud/datastore';

const datastoreClient = new Datastore({
  projectId: 'matts-workouts',
});

const KIND_WORKOUT = 'workout';


export function storeWorkoutByOwner(ownerId, workout) {
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

export function loadWorkoutByOwner(ownerId) {
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

export function deleteWorkoutByOwner(ownerId) {
  return new Promise((resolve, reject) => {
    const workoutKey = datastoreClient.key([KIND_WORKOUT, ownerId]);

    datastoreClient.delete(workoutKey, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
