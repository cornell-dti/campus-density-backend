import { firebaseDB } from '../auth'
import { database } from 'firebase-admin'
import { print } from 'util'

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
export const getAverageSpreadsheetHistoricalData = async (facility) => {
  return new Promise(async (resolve, reject) => {
    let mappingAverage = {} // {Monday: 11:30 AM: {cardoSum: 300, weightSum: 400}}
    await firebaseDB.collection('gymHistory')
      .doc(facility) //get facility
      .collection('history') // go to the 'history' collection of that facility
      .get() // get all documents
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          let docDataContents = doc.data().data //This contains the mapping from time to occupancies
          let dayForData = doc.data().day
          Object.keys(docDataContents).forEach(time => { // The keys of the JSON are the times for a specific day
            let occupancy = docDataContents[time]
            if (!(dayForData in mappingAverage)) { //Create the appropriate mapping for the day if it doesn't exist
              // Throughout this function, whenever we encounter a -1 (implying there's no one there), we simply substitute with a 0. 
              mappingAverage[dayForData] = {}
              mappingAverage[dayForData][time] = {
                cardioAverage:
                  (occupancy.cardio == -1 ? 0 : occupancy.cardio),
                weightAverage:
                  (occupancy.weights == -1 ? 0 : occupancy.weights),
                cardioCount: 1,
                weightCount: 1
              }
              //mappingCount[dayForData] = {}
              //mappingCount[dayForData][time] = { cardioCount: 1, weightCount: 1 }

            } else {
              // Check if a specific time has been added to the mappings.
              if (!(time in mappingAverage[dayForData])) {
                mappingAverage[dayForData][time] = {
                  cardioAverage:
                    (occupancy.cardio == -1 ? 0 : occupancy.cardio),
                  weightAverage:
                    (occupancy.weights == -1 ? 0 : occupancy.weights),
                  cardioCount: 1,
                  weightCount: 1
                }
                //mappingCount[dayForData][time] = { cardioCount: 1, weightCount: 1 }
              } else {
                // The current day and time already exist, adjust values in mappings.

                // Compute the new average based on the current acccumulation by (newVal + oldAverage * oldCount)/(oldCount + 1

                mappingAverage[dayForData][time]['cardioAverage'] =
                  ((occupancy.cardio == -1 ? 0 : occupancy.cardio)
                    + mappingAverage[dayForData][time]['cardioAverage']
                    * mappingAverage[dayForData][time]['cardioCount'])
                  / (mappingAverage[dayForData][time]['cardioCount'] + 1)


                mappingAverage[dayForData][time]['weightAverage'] =
                  ((occupancy.cardio == -1 ? 0 : occupancy.weights)
                    + mappingAverage[dayForData][time]['weightAverage']
                    * mappingAverage[dayForData][time]['weightCount'])
                  / (mappingAverage[dayForData][time]['weightCount'] + 1)

                // Update mapping counts. 
                mappingAverage[dayForData][time]['cardioCount'] += 1
                mappingAverage[dayForData][time]['weightCount'] += 1
              }
            }
          })
        })
        resolve(mappingAverage)
      })
      .catch(err => reject(err))
  })
}


export const updateSpreadsheetAverages = () => {
  return new Promise((resolve, reject) => {
    getAverageSpreadsheetHistoricalData('noyes')
      .then(async results => {

        let averageDocuments = await firebaseDB
          .collection('gyms')
          .doc('noyes')
          .collection('history')

        Object.keys(results).forEach(day => {
          averageDocuments.doc(day).set(results[day]).catch(err => reject(err))
        })

        resolve()
      })
      .catch(err => reject(err))
  })
}

export const updateLiveAverages = (gymID, day, data) => {
  // My idea of data: For a specific time, rounded to the nearest 15/45{ cardio: 100, weight: 100 }
  // The count attribute must be a live data count, not the average count

  return new Promise(async (resolve, reject) => {

    // get the live averages that are just calculated with the live data
    let doc = await firebaseDB.collection('gyms')
      .doc(gymID)
      .collection('history')
      .doc(day)
      .get()

    // get the JSON contents of both the results.
    let docData = doc.data()
    if (!docData) reject('Could not fetch live averages')

    // let spreadsheetData = spreadsheetDoc.data()
    // if (!spreadsheetData) reject('Could not fetch spreadsheet averages')

    // check if there is a time doc for this time
    if (docData[data.time]) {

      // compute the running live average. Technically we don't need to compute the live average?
      const newLiveCardioAvg =
        (data.cardio + docData[data.time].cardioLiveAverage * docData[data.time].cardioLiveCount)
        / (docData[data.time].cardioLiveCount + 1)

      // compute new live count
      const newLiveCardioCount = docData[data.time].cardioLiveCount + 1

      // compute new live averages (this average doesn't include the spreadsheet averages!)
      const newLiveWeightAvg =
        (data.weights + docData[data.time].weightLiveAverage * docData[data.time].weightLiveCount)
        / (docData[data.time].weightLiveCount + 1)

      const newLiveWeightCount = docData[data.time].weightLiveCount + 1

      docData[data.time].cardioLiveAverage = newLiveCardioAvg
      docData[data.time].cardioLiveCount = newLiveCardioCount
      docData[data.time].weightLiveAverage = newLiveWeightAvg
      docData[data.time].weightLiveCount = newLiveWeightCount
    } else {
      docData[data.time] = {}
      docData[data.time].cardioLiveAverage = data.cardio
      docData[data.time].cardioLiveCount = 1
      docData[data.time].weightLiveAverage = data.weights
      docData[data.time].weightLiveCount = 1
    }

    await firebaseDB
      .collection('gyms')
      .doc(gymID)
      .collection('history')
      .doc(day)
      .set(docData)
      .catch(err => reject(err))

    resolve()

  }).catch(err => console.log(err))
}

export const getHistoricalAverages = (gymID, day) => {
  return new Promise(async (resolve, reject) => {
    // get the live averages that are just calculated with the live data
    let doc = await firebaseDB.collection('gyms')
      .doc(gymID)
      .collection('history')
      .doc(day)
      .get()

    // get the spreadsheet averages stored in gymSpreadsheets
    let spreadsheetDoc = await firebaseDB.collection('gymSpreadsheets')
      .doc(gymID)
      .collection('history')
      .doc(day)
      .get()

    // get the JSON contents of both the results.
    let docData = doc.data()
    if (!docData) reject('Could not fetch live averages')

    let spreadsheetData = spreadsheetDoc.data()
    if (!spreadsheetData) reject('Could not fetch spreadsheet averages')

    let res = []
    console.log(spreadsheetData)
    Object.keys(spreadsheetData).forEach(time => {

      // retrieve cardio/weight data from the live averages JSON, and deal
      // with the case where there is no data for this time by setting it to 0
      const cardioLiveAverage = (docData[time] || 0).cardioLiveAverage || 0
      const cardioLiveCount = (docData[time] || 0).cardioLiveCount || 0
      const weightLiveAverage = (docData[time] || 0).weightLiveAverage || 0
      const weightLiveCount = (docData[time] || 0).weightLiveCount || 0

      // compute new aggregate averages by averaging the live and spreadsheet averages
      const newAggregateCardioAvg =
        (cardioLiveAverage * cardioLiveCount +
          spreadsheetData[time].cardioAverage * spreadsheetData[time].cardioCount)
        / (cardioLiveCount + spreadsheetData[time].cardioCount)

      const newAggregateWeightAvg =
        (weightLiveAverage * weightLiveCount +
          spreadsheetData[time].weightsAverage * spreadsheetData[time].weightsCount)
        / (weightLiveCount + spreadsheetData[time].weightsCount)

      const data = {
        time: time,
        cardioAverage: newAggregateCardioAvg,
        weightAverage: newAggregateWeightAvg
      }

      res.push(data)
    })
    resolve(res)
  }).catch(err => console.log(err))
}