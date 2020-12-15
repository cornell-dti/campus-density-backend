import { firebaseDB } from '../auth';
import { Feedback } from './models/feedback'
import { DISPLAY_MAP } from '../mapping';
import { parse } from 'path';


export class FeedbackDB {
  num_to_day = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  // get hour docs
  async getHourFeedback(dayRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>, hour: string) {
    const hourRef = await dayRef.doc(hour).collection('modelPrediction').get();
    const predicts = hourRef.docs
      .filter(doc => doc.id != "0")
      .map(doc => ({ predictedWait: doc.id, data: doc.data() }));
    return predicts;
  }

  // get day collections
  async getDayFeedback(eateryRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, day: string) {

    const dayRef = eateryRef.collection(day);
    const hours = (await dayRef.get()).docs;
    const data = await Promise.all(hours.map(async doc => {
      const docID = doc.id;
      const docData = await this.getHourFeedback(dayRef, docID);
      return ({ hour: docID, data: docData })
    }));
    return data.filter(doc => doc.data.length > 0);

  }

  // get eatery docs
  async getEateryFeedback(ref: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>, eatery: string) {
    const eateryRef = ref.doc(eatery);
    const days = await eateryRef.listCollections();
    const data = await Promise.all(days.map(async day => {
      const dayID = day.id;
      const dayData = await this.getDayFeedback(eateryRef, dayID);
      return ({ day: dayID, data: dayData })
    }));
    return data.filter(doc => doc.data.length > 0);
  }

  // GET feedback
  async getFeedback(
    eatery?: string,
    day?: string,
    hour?: string,
    predictedWait?: string,
  ) {
    const ref = firebaseDB.collection('feedbackData');

    if (eatery && DISPLAY_MAP.hasOwnProperty(eatery)) {
      const eateryRef = ref.doc(eatery);

      if (day && this.num_to_day.includes(day)) {
        const dayRef = eateryRef.collection(day);

        if (hour && parseInt(hour) >= 0 && parseInt(hour) < 24) {
          // get data at specific wait time
          const hourRef = dayRef.doc(hour);

          if (predictedWait && predictedWait != "0") {
            const predict = await hourRef.collection('modelPrediction').doc(predictedWait).get();
            if (predict.data()) {
              return { predictedWait: predict.id, data: predict.data() };
            }
            else {
              return [];
            }
          }
          // get data at all predicted wait times (on specific hour)
          return this.getHourFeedback(dayRef, hour);
        }
        else {
          // get data at all hours (on specific day)
          return this.getDayFeedback(eateryRef, day);
        }
      }
      else {
        // get data at all days (on specific eatery)
        return this.getEateryFeedback(ref, eatery);
      }
    }
    else {
      // get data at all eateries
      const eateries = (await ref.get()).docs;
      const data = await Promise.all(eateries.map(async doc => {
        const docID = doc.id;
        const docData = await this.getEateryFeedback(ref, docID);
        return ({ id: docID, data: docData });
      }));
      return data.filter(doc => doc.data.length > 0);
    }
  }

  // initialize docs in firebase
  async createDocs() {

    for (const eatery in DISPLAY_MAP) {
      const eRef = firebaseDB.collection('feedbackData').doc(eatery);
      eRef.set({});
      for (const day in this.num_to_day) {
        for (var hour = 0; hour < 24; hour++) {
          const eatRef = eRef.collection(this.num_to_day[day]).doc(hour.toString());
          eatRef.set({});
          const eateryRef = eatRef.collection('modelPrediction').doc('0');
          eateryRef.set(
            {
              observedWait: 0,
              count: 0,
              comments: []
            });
        }
      }
    }

  }

  // POST feedback
  async addFeedback(feedback: Feedback) {

    const time = new Date();
    const day = this.num_to_day[time.getDay()];
    const hour = time.getHours();

    const eatery = feedback.eatery;
    const predictedWait = feedback.predictedWait;
    const observedWait = feedback.observedWait;
    const comment = feedback.comment;

    var old_count = 0;
    var old_avg = observedWait;

    // initialized fields
    var observedWait_avg = observedWait;
    var count = 1;
    var comments = [];

    const eateryRef = firebaseDB
      .collection('feedbackData')
      .doc((eatery))
      .collection(day)
      .doc(hour.toString())
      .collection('modelPrediction')
      .doc(predictedWait.toString());

    // update based on current data
    // get current data
    await eateryRef.get()
      .then(res => {
        // if doc found, get data
        old_count = res.data().count;
        old_avg = res.data().observedWait;
        comments = res.data().comments;

        observedWait_avg = (old_avg * old_count + observedWait) / (old_count + 1);
        count = old_count + 1;
      })
      .catch(err => {
        // else, set initial data
      })
      .then(() => {
        // check for validity of comment
        if (comment) {
          comments.push(comment);
        }
        eateryRef.set({
          observedWait: observedWait_avg,
          count: count,
          comments: comments
        });
      })

  }
}
