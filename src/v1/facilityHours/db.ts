import { ID_MAP, DISPLAY_MAP, UNITNAME_MAP } from "../mapping";
import { CampusLocation } from "../models/campus";
import { DBQuery, DB, DatabaseQuery, DatabaseQueryNoParams } from "../db";
import * as Util from "../util";
import { FacilityHours } from "./models/hours";

export class hours_db extends DB {
    constructor(datastore) {
        super(datastore); 
    }

    async facilityHours(
      facilityId?: string
    ): Promise<DBQuery<string, FacilityHours>[]> {
        const {datastore} = this; 
        const query = datastore.createQuery("hours"); 


        return null; 
    }

}
