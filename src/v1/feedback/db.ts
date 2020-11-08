import * as moment from 'moment-timezone';
import { firebaseDB } from '../auth';
import { Feedback } from './models/feedback'

export class FeedbackDB {

  // db function to GET feedback
  async feedbackList(feedbackListType, location?: string) {
    // if (location) {
    //   return (
    //     await firebaseDB.collection('feedback').doc(location).collection('test').get()
    //   ).get('id');
    // }

    const data = [];
    const locs = Object.keys(feedbackListType).map(async location => {
      try {
        console.log(location);
        const query = await firebaseDB.collection('feedback').doc(location).collection('feedback').get();
        console.log("QUERY: " + query);
        for (const doc of query.docs) {
          const docData = doc.data();
          data.push(docData);
        }
      }
      catch (err) {
        console.log(err);
      }

    });
    return data;
  }

  async feedbackWaitTimes(location: string, day?: string) {
    const waitTimes = [];
    const query = await firebaseDB.collection('feedback').doc(location).collection('feedback').get();
    for (const doc of query.docs) {
      const docWait = doc.data().waitTime;
      waitTimes.push(docWait);
    }
    // potentially return waitTimes based on day
    return waitTimes;
  }

  //TODO: db function to POST feedback
  async addFeedback(feedback: Feedback) {
    const location = feedback.campuslocation;
    // time submitted
    // id
    const time = new Date().getTime();
    // const id = feedback.key;
    feedback.timeSubmitted = new Date();
    await firebaseDB.collection('feedback').doc(location).collection('feedback').add(feedback);
  }

}
