import { firebaseDB } from '../auth';
import { Feedback } from './models/feedback'
import { DISPLAY_MAP } from '../mapping';

export class FeedbackDB {

  // GET feedback of specific location
  async feedbackListLocation(location: string):
    Promise<{
      id: string,
      data: Feedback[]
    }[]> {
    const data = [];
    if (location && location in DISPLAY_MAP) {
      const docs = await firebaseDB.collection('feedback').doc(location).collection('feedback').get()
        .then(doc => {
          doc.forEach(d => {
            data.push({ id: d.id, data: d.data() });
          })
        })
        .catch(err => {
          console.log(err);
          return err;
        });
    }
    return data;
  }

  // GET feedback of all locations
  async feedbackList(feedbackListType) {
    const data = [];
    const loc = Object.keys(feedbackListType)
      .map(location => this.feedbackListLocation(location)
        .then(obj => {
          if (obj.length !== 0) {
            data.push({ eatery: location, size: obj.length, data: obj });
          }
        })
      );
    return Promise.all(loc).then(() => {
      return data;
    });
  }

  // POST feedback
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
      campuslocation: location,
      comments: feedback.comments
    }
    await firebaseDB.collection('feedback').doc(location).collection('feedback').add(fb);
  }
}
