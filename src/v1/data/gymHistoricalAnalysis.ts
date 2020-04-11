import { firebaseDB } from '../auth'

export const getAverageHistoricalData = async (facility) => {
  let mappingSum = {} // {11:30 AM: {cardoSum: 300, weightSum: 400}}
  let mappingCount = {} // {11:30 AM: {cardoSum: 30, weightSum: 40}}
  await firebaseDB.collection('gymHistory')
    .doc(facility)
    .collection('history')
    .get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        // doc.data().data.forEach(datapoint => {

        // })
        console.log(doc.data().data)
      })
    })
}
