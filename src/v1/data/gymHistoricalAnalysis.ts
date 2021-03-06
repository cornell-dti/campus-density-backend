import { database } from 'firebase-admin';
import { print } from 'util';
import * as moment from 'moment';
import { firebaseDB } from '../auth';

const validDays = new Set([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '0th',
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  'su',
  'mo',
  'tu',
  'we',
  'th',
  'fr',
  'sa',
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]);

// eslint-disable no-async-promise-executor

/**
 * This function computes the historical average of the weight and cardio occupancies
 * by computing the mean of the respective values for every day on every time slot.
 * For example, the output of this function will store the averages as { Monday: {11:15AM: {cardioAverage: 13, weightAverage: 12.5},
 *                                                                                {12:30PM: {cardioAverage: 15, weightAverage: 20}}}}
 * The counts of the entries for cardio and weight on each day for each time are recorded in a similar format.
 *
 * This function also goes through the entire collection of history documents, and should only be used
 * when the all the historical averages need to be computed from scratch.
 *
 * @param facility The facility id of the facility we are computing the historical
 * average of.
 */
export const getAverageSpreadsheetHistoricalData = async facility => {
  return new Promise((resolve, reject) => {
    const mappingAverage = {}; // {Monday: 11:20AM: {cardoSum: 300, weightSum: 400}}

    firebaseDB
      .collection('gymHistory')
      .doc(facility) // get facility
      .collection('history') // go to the 'history' collection of that facility
      .get() // get all documents
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          const docDataContents = doc.data().data; // This contains the mapping from time to occupancies
          const dayForData = doc.data().day;
          Object.keys(docDataContents).forEach(time => {
            // The keys of the JSON are the times for a specific day
            const occupancy = docDataContents[time];
            if (!(dayForData in mappingAverage)) {
              // Create the appropriate mapping for the day if it doesn't exist
              // Throughout this function, whenever we encounter a -1 (implying there's no one there), we simply substitute with a 0.
              mappingAverage[dayForData] = {};
              mappingAverage[dayForData][time] = {
                cardioAverage: occupancy.cardio === -1 ? 0 : occupancy.cardio,
                weightAverage: occupancy.weights === -1 ? 0 : occupancy.weights,
                cardioCount: 1,
                weightCount: 1
              };
            } else if (!(time in mappingAverage[dayForData])) {
              // Check if a specific time has been added to the mappings.å
              mappingAverage[dayForData][time] = {
                cardioAverage: occupancy.cardio === -1 ? 0 : occupancy.cardio,
                weightAverage: occupancy.weights === -1 ? 0 : occupancy.weights,
                cardioCount: 1,
                weightCount: 1
              };
              // mappingCount[dayForData][time] = { cardioCount: 1, weightCount: 1 }
            } else {
              // The current day and time already exist, adjust values in mappings.
              // Compute the new average based on the current acccumulation by (newVal + oldAverage * oldCount)/(oldCount + 1
              mappingAverage[dayForData][time].cardioAverage =
                ((occupancy.cardio === -1 ? 0 : occupancy.cardio) +
                  mappingAverage[dayForData][time].cardioAverage *
                    mappingAverage[dayForData][time].cardioCount) /
                (mappingAverage[dayForData][time].cardioCount + 1);

              mappingAverage[dayForData][time].weightAverage =
                ((occupancy.cardio === -1 ? 0 : occupancy.weights) +
                  mappingAverage[dayForData][time].weightAverage *
                    mappingAverage[dayForData][time].weightCount) /
                (mappingAverage[dayForData][time].weightCount + 1);

              // Update mapping counts.
              mappingAverage[dayForData][time].cardioCount += 1;
              mappingAverage[dayForData][time].weightCount += 1;
            }
          });
        });
        resolve(mappingAverage);
      })
      .catch(err => reject(err));
  });
};

/**
 * This method aggregates the spreadsheet averages in the Firebase collection
 * gyms |> gym_name |> history.
 *
 * NOTE: This method is just kept until Changyuan's script can completely handle
 * spreadsheet stuff. Don't use this.
 */
export const updateSpreadsheetAverages = () => {
  return new Promise((resolve, reject) => {
    getAverageSpreadsheetHistoricalData('noyes')
      .then(async results => {
        const averageDocuments = await firebaseDB
          .collection('gyms')
          .doc('noyes')
          .collection('history');

        Object.keys(results).forEach(day => {
          averageDocuments
            .doc(day)
            .set(results[day])
            .catch(err => reject(err));
        });

        resolve();
      })
      .catch(err => reject(err));
  });
};

/**
 * This function will update the live averages for the Firebase document corresponding
 * to the path `gyms/[gymID]/history/[day]`. It will create a new field for the
 * this document's data path if `[data.time]` isn't already a field (which means
 * the time for which we're updating the live averages doesn't exist on the database,
 * and we need to create a new field for this time). If the time already exists as
 * a field for this document, then the existing averages are updated using `[data.weights]`
 * and `[data.cardio]`.
 *
 * @param gymID A valid gym facility identifier, as used on Firebase.
 *
 * @param day The string representation of the day (Monday, Tuesday, etc. ) the average is being
 * updated for
 *
 * @param data An Object containing information about the time, and the new cardio and weight
 * data.
 * @requires data.time is a string representation of 12-hour regular time, rounded to the nearest
 * quarter. Examples: 1:15pm, 11:45am, 12:15pm
 *
 */
export const updateLiveAverages = async (gymID, day, data) => {
  // get the live averages that are just calculated with the live data
  const doc = await firebaseDB
    .collection('gyms')
    .doc(gymID)
    .collection('history')
    .doc(day)
    .get();

  // get the JSON contents of both the results.
  const docData = doc.data();
  if (!docData) throw new Error('Could not fetch live averages');

  // check if there is a time doc for this time
  if (docData[data.time]) {
    // compute the running live average. Technically we don't need to compute the live average?
    const newLiveCardioAvg =
      (data.cardio +
        docData[data.time].cardioLiveAverage *
          docData[data.time].cardioLiveCount) /
      (docData[data.time].cardioLiveCount + 1);

    // compute new live count
    const newLiveCardioCount = docData[data.time].cardioLiveCount + 1;

    // compute new live averages (this average doesn't include the spreadsheet averages!)
    const newLiveWeightAvg =
      (data.weights +
        docData[data.time].weightLiveAverage *
          docData[data.time].weightLiveCount) /
      (docData[data.time].weightLiveCount + 1);

    const newLiveWeightCount = docData[data.time].weightLiveCount + 1;

    docData[data.time].cardioLiveAverage = newLiveCardioAvg;
    docData[data.time].cardioLiveCount = newLiveCardioCount;
    docData[data.time].weightLiveAverage = newLiveWeightAvg;
    docData[data.time].weightLiveCount = newLiveWeightCount;
  } else {
    docData[data.time] = {};
    docData[data.time].cardioLiveAverage = data.cardio;
    docData[data.time].cardioLiveCount = 1;
    docData[data.time].weightLiveAverage = data.weights;
    docData[data.time].weightLiveCount = 1;
  }

  // push everything back to firebase.
  // eslint-disable-next-line no-async-promise-executor
  await firebaseDB
    .collection('gyms')
    .doc(gymID)
    .collection('history')
    .doc(day)
    .set(docData)
    .catch(err => {
      throw new Error(err);
    });
};

/**
 * This function gets the historical averages of a specified gym on a specified day. This historical average
 * is calculated by adding up the spreadsheet historical averages and the live historical averages.
 * @param gymID id of the gym to get historical averages of
 * @param day day to fetch historical averages for
 */
export const getHistoricalAverages = async (gymID, day) => {
  const validDay = validDays.has(day.toLowerCase());

  if (!gymID && (!day || !validDay))
    throw new Error('Please enter a valid gym id and day.');
  else if (!gymID) throw new Error('Please enter a valid gym id.');
  else if (!day || !validDay) throw new Error('Please enter a valid day.');

  const dayFormat = moment().set({ day }).format('dddd');

  // get the live averages that are just calculated with the live data
  const doc = await firebaseDB
    .collection('gyms')
    .doc(gymID)
    .collection('history')
    .doc(dayFormat)
    .get();

  // get the spreadsheet averages stored in gymSpreadsheets
  // eslint-disable-next-line no-async-promise-executor
  const spreadsheetDoc = await firebaseDB
    .collection('gymSpreadsheets')
    .doc(gymID)
    .collection('history')
    .doc(dayFormat)
    .get();

  // get the JSON contents of both the results.
  const docData = doc.data();
  if (!docData) throw new Error('Could not fetch live averages.');

  const spreadsheetData = spreadsheetDoc.data();
  if (!spreadsheetData) throw new Error('Could not fetch spreadsheet averages');

  const res = [];
  Object.keys(spreadsheetData).forEach(time => {
    // retrieve cardio/weight data from the live averages JSON, and deal
    // with the case where there is no data for this time by setting it to 0
    const cardioLiveAverage = (docData[time] || 0).cardioLiveAverage || 0;
    const cardioLiveCount = (docData[time] || 0).cardioLiveCount || 0;
    const weightLiveAverage = (docData[time] || 0).weightLiveAverage || 0;
    const weightLiveCount = (docData[time] || 0).weightLiveCount || 0;

    // compute new aggregate averages by averaging the live and spreadsheet averages
    const newAggregateCardioAvg =
      (cardioLiveAverage * cardioLiveCount +
        spreadsheetData[time].cardioAverage *
          spreadsheetData[time].cardioCount) /
      (cardioLiveCount + spreadsheetData[time].cardioCount);

    const newAggregateWeightAvg =
      (weightLiveAverage * weightLiveCount +
        spreadsheetData[time].weightsAverage *
          spreadsheetData[time].weightsCount) /
      (weightLiveCount + spreadsheetData[time].weightsCount);

    const data = {
      time,
      cardioAverage: newAggregateCardioAvg,
      weightAverage: newAggregateWeightAvg
    };

    res.push(data);
  });

  res.sort((a, b) => {
    const date = moment().format('YYYY-MM-DD ');
    const timeA = moment(date + a.time, 'YYYY-MM-DD h:mma');
    const timeB = moment(date + b.time, 'YYYY-MM-DD h:mma');
    return timeA.diff(timeB);
  });
  return res;
};
