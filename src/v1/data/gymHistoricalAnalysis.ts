import { firebaseDB } from '../auth'

export const getAverageHistoricalData = async (facility) => {
  let mappingSum = {} // {Monday: 11:30 AM: {cardoSum: 300, weightSum: 400}}
  let mappingCount = {} // {11:30 AM: {cardoSum: 30, weightSum: 40}}
  await firebaseDB.collection('gymHistory')
    .doc(facility) //get facility
    .collection('history') // go to the 'history' collection of that facility
    .get() // get all documents
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        // consider one single document in history collection. This represents a specific date.
        let docContents = doc.data() // The document contains a 'data' attribute (which is a JSON array) and the day
        docContents.data.forEach(datapoint => {
          const { time, occupancy } = datapoint

          if (!(docContents.day in mappingSum)) { //Create the appropriate mapping for the day if it doesn't exist
            mappingSum[docContents.day] = {}
            mappingSum[docContents.day][time] = { cardioSum: occupancy.cardio, weightSum: occupancy.weights }
            mappingCount[docContents.day] = {}
            mappingCount[docContents.day][time] = { cardioCount: 1, weightCount: 1 }

          } else {
            // Check if a specific time has been added to the mappings
            if (!(time in mappingSum[docContents.day])) {
              mappingSum[docContents.day][time] = { cardioSum: occupancy.cardio, weightSum: occupancy.weights }
              mappingCount[docContents.day][time] = { cardioCount: 1, weightCount: 1 }
            } else {
              // The current day and time already exist, adjust values in mappings.
              mappingSum[docContents.day][time]['cardioSum'] += occupancy.cardio
              mappingSum[docContents.day][time]['weightSum'] += occupancy.weights
              mappingCount[docContents.day][time]['cardioCount'] += 1
              mappingCount[docContents.day][time]['weightCount'] += 1
            }
          }
        })

      })
      return { mappingSum: mappingSum, mappingCount: mappingCount }
    })
}
