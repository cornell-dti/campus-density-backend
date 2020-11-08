import { resolve } from 'dns';
import * as moment from 'moment-timezone';
import { firebaseDB } from '../auth';
import { Feedback } from './models/feedback'

export class FeedbackDB {
  // db function to GET feedback

  async feedbackListLocation(location: string): Promise<{
    id: string,
    data: Feedback[]
  }[]> {
    const data = [];
    if (location) {
      const docs = await firebaseDB.collection('feedback').doc(location).collection('feedback').get()
        .then(doc => {
          doc.forEach(d => {
            data.push({ id: d.id, data: d.data() });
          })
        })
        .catch(err => {
          console.log(err);
        });
    }
    return data;
  }

  async feedbackList(feedbackListType, location?: string) {
    if (location) {
      return this.feedbackListLocation(location);
    }
    const data = [];

    const loc = Object.keys(feedbackListType)
      .map(location => this.feedbackListLocation(location)
        .then(obj => {
          if (obj.length != 0) {
            data.push({ eatery: location, data: obj });
          }
        })
      );
    Promise.all(loc).then(() => {
      console.log(data);
      return data;
    });
    // average difference for predicted and actual value
    // aggregate data
    // review Vaish's PR


    // const loc = Object.keys(feedbackListType).map(async location => {
    //   try {
    //     const d = await this.feedbackListLocation(location);
    //     if (d.length != 0) {
    //       data.push({ eatery: location, entries: d });
    //     }
    //   }
    //   catch (err) {
    //     console.log(err);
    //   }
    // });

  }

  // db function to POST feedback
  async addFeedback(feedback: Feedback) {
    const location = feedback.campuslocation;
    const time = new Date().getTime();
    const fb = {
      timeSubmitted: time,
      isAccurate: feedback.isAccurate,
      predicted: feedback.predicted,
      observed: feedback.observed,
      waitTime: feedback.waitTime,
      dineIn: feedback.dineIn,
      startDine: feedback.startDine,
      endDine: feedback.endDine,
      campuslocation: feedback.campuslocation,
      comments: feedback.comments
    }
    await firebaseDB.collection('feedback').doc(location).collection('feedback').add(fb);
  }

}
