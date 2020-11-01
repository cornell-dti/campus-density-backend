import * as moment from 'moment-timezone';
import { firebaseDB } from '../auth';
import { CampusLocation } from '../models/campus';
import { DBQuery, DB, DatabaseQueryNoParams } from '../db';

export class FeedbackDB extends DB {
  // TODO: do we need a constructor?

  // TODO: db function to GET feedback list
  async feedbackList() {

  }

  // TODO: db function to POST feedback
}
