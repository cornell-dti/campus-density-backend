import { firebaseDB } from '../auth';
import { Feedback, FluxFeedback } from './models/feedback';
import { DISPLAY_MAP } from '../mapping';

export class FeedbackDB {
  num_to_day = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  // get hour docs
  async getHourFeedback(
    dayRef: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
    hour: string
  ) {
    const hourRef = await dayRef.doc(hour).collection('modelPrediction').get();
    const predicts = hourRef.docs
      .filter(doc => doc.id !== '0')
      .map(doc => ({ predictedWait: doc.id, data: doc.data() }));
    return predicts;
  }

  // get day collections
  async getDayFeedback(
    eateryRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
    day: string
  ) {
    const dayRef = eateryRef.collection(day);
    const hours = (await dayRef.get()).docs;
    const data = await Promise.all(
      hours.map(async doc => {
        const docID = doc.id;
        const docData = await this.getHourFeedback(dayRef, docID);
        return { hour: docID, data: docData };
      })
    );
    return data.filter(doc => doc.data.length > 0);
  }

  // get eatery docs
  async getEateryFeedback(
    ref: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
    eatery: string
  ) {
    const eateryRef = ref.doc(eatery);
    const days = await eateryRef.listCollections();
    const data = await Promise.all(
      days.map(async day => {
        const dayID = day.id;
        const dayData = await this.getDayFeedback(eateryRef, dayID);
        return { day: dayID, data: dayData };
      })
    );
    return data.filter(doc => doc.data.length > 0);
  }

  // GET feedback
  async getFeedback(
    eatery?: string,
    day?: string,
    hour?: string,
    predictedWait?: string
  ) {
    const ref = firebaseDB.collection('feedbackData');

    if (eatery && Object.prototype.hasOwnProperty.call(DISPLAY_MAP, eatery)) {
      const eateryRef = ref.doc(eatery);

      if (day && this.num_to_day.includes(day)) {
        const dayRef = eateryRef.collection(day);

        if (hour && parseInt(hour, 10) >= 0 && parseInt(hour, 10) < 24) {
          // get data at specific wait time
          const hourRef = dayRef.doc(hour);

          if (predictedWait && predictedWait !== '0') {
            const predict = await hourRef
              .collection('modelPrediction')
              .doc(predictedWait)
              .get();
            if (predict.data()) {
              return { predictedWait: predict.id, data: predict.data() };
            }

            return [];
          }
          // get data at all predicted wait times (on specific hour)
          return this.getHourFeedback(dayRef, hour);
        }

        // get data at all hours (on specific day)
        return this.getDayFeedback(eateryRef, day);
      }

      // get data at all days (on specific eatery)
      return this.getEateryFeedback(ref, eatery);
    }

    // get data at all eateries
    const eateries = (await ref.get()).docs;
    const data = await Promise.all(
      eateries.map(async doc => {
        const docID = doc.id;
        const docData = await this.getEateryFeedback(ref, docID);
        return { id: docID, data: docData };
      })
    );
    return data.filter(doc => doc.data.length > 0);
  }

  // initialize docs in firebase
  async createDocs() {
    for (const eatery in DISPLAY_MAP) {
      if (Object.prototype.hasOwnProperty.call(DISPLAY_MAP, eatery)) {
        const eRef = firebaseDB.collection('feedbackData').doc(eatery);
        eRef.set({});
        for (const day in this.num_to_day) {
          if (Object.prototype.hasOwnProperty.call(this.num_to_day, day)) {
            for (let hour = 0; hour < 24; hour += 1) {
              const eatRef = eRef
                .collection(this.num_to_day[day])
                .doc(hour.toString());
              eatRef.set({ observedWait: 0, count: 0, comments: [] });
            }
          }
        }
      }
    }
  }

  // POST feedback
  async addFeedback(feedback: Feedback) {
    const time = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
    const day = this.num_to_day[time.getDay()];
    const hour = time.getHours();

    const { eatery, observedWait, comment } = feedback;

    let oldCount = 0;
    let oldAvg = observedWait;

    // initialized fields
    let observedWaitAvg = observedWait;
    let count = 1;
    let comments = [];

    const eateryRef = firebaseDB
      .collection('feedbackData')
      .doc(eatery)
      .collection(day)
      .doc(hour.toString());

    // update based on current data
    // get current data
    await eateryRef
      .get()
      .then(res => {
        // if doc found, get data
        oldCount = res.data().count;
        oldAvg = res.data().observedWait;
        comments = res.data().comments;

        observedWaitAvg = (oldAvg * oldCount + observedWait) / (oldCount + 1);
        count = oldCount + 1;
      })
      .catch(err => {
        // else, set initial data
        console.log(err);
        eateryRef
          .set({ observedWait: 0, count: 0, comments: [] })
          .catch(err2 => {
            console.log('Error in initializing dining hall feedback values.');
          });
      })
      .then(() => {
        // check for validity of comment
        if (comment) {
          comments.push(comment);
        }
        eateryRef.set({
          observedWait: observedWaitAvg,
          count,
          comments
        });
      });
  }

  async addGeneralFeedback(feedback: FluxFeedback) {
    const { likelyToRecommend, usefulFeatures, likeFluxOverall } = feedback;
    const comment: string = feedback.comment || '';

    await firebaseDB.collection('generalFluxFeedback').doc().set({
      likelyToRecommend,
      usefulFeatures,
      likeFluxOverall,
      comment,
      timestamp: new Date()
    });
  }
}
