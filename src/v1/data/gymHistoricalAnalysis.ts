import { firebaseDB } from '../auth'

export const getAverageHistoricalData = async (facility) => {
  return new Promise(async (resolve, reject) => {
    let mappingSum = {} // {Monday: 11:30 AM: {cardoSum: 300, weightSum: 400}}
    let mappingCount = {} // {11:30 AM: {cardoSum: 30, weightSum: 40}}
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
            if (!(dayForData in mappingSum)) { //Create the appropriate mapping for the day if it doesn't exist
              mappingSum[dayForData] = {}
              mappingSum[dayForData][time] = {
                cardioSum:
                  (occupancy.cardio == -1 ? 0 : occupancy.cardio),
                weightSum:
                  (occupancy.weights == -1 ? 0 : occupancy.weights)
              }
              mappingCount[dayForData] = {}
              mappingCount[dayForData][time] = { cardioCount: 1, weightCount: 1 }

            } else {
              // Check if a specific time has been added to the mappings
              if (!(time in mappingSum[dayForData])) {
                mappingSum[dayForData][time] = {
                  cardioSum:
                    (occupancy.cardio == -1 ? 0 : occupancy.cardio),
                  weightSum:
                    (occupancy.weights == -1 ? 0 : occupancy.weights)
                }
                mappingCount[dayForData][time] = { cardioCount: 1, weightCount: 1 }
              } else {
                // The current day and time already exist, adjust values in mappings.
                mappingSum[dayForData][time]['cardioSum'] += (occupancy.cardio == -1 ? 0 : occupancy.cardio)
                mappingSum[dayForData][time]['weightSum'] += (occupancy.weights == -1 ? 0 : occupancy.weights)
                mappingCount[dayForData][time]['cardioCount'] += 1
                mappingCount[dayForData][time]['weightCount'] += 1
              }
            }
          })
        })
        resolve({ mappingSum: mappingSum, mappingCount: mappingCount })
      })
      .catch(err => reject(err))
  })
}
