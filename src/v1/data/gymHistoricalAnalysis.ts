import { firebaseDB } from '../auth'

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
export const getAverageHistoricalData = async (facility) => {
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
                  ((occupancy.cardio == -1 ? 0 : occupancy.cardio)
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


export const updateAverages = () => {
  return new Promise((resolve, reject) => {
    getAverageHistoricalData('noyes')
      .then(async results => {

        let averageDocuments = await firebaseDB
          .collection('gyms')
          .doc('noyes')
          .collection('history')

        Object.keys(results).forEach(day => {
          averageDocuments.doc(day).set(results[day]).catch(err => reject(err))
        })

        resolve()
        // averageDocuments.get()
        //   .then(querySnapshot => {
        //     querySnapshot.docs.forEach(doc => {
        //       doc.ref.set(results).catch(err => reject(err))
        //     })
        //     resolve()
        //   })
        //  .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}
