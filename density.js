/**
 *  Campus Density Backend
 *  Copyright (C) 2018 Cornell Design & Tech Initiative
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3 of the License only.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();

const Util = require('./util');

const DISPLAY_MAP = {
    cook: 'Alice Cook House',
    cafejennie: 'Cafe Jennie',
    becker: 'Carl Becker House',
    bethe: 'Jansen\'s at Bethe House',
    keeton: 'Keeton House',
    west104: '104West!',
    appel: 'North Star at Appel',
    okies: 'Okenshields',
    libe: 'Olin Libe Cafe',
    rpcc: 'RPCC Dining Hall',
    risley: 'Risley',
    rose: 'Rose Dining Hall'
}

const ID_MAP = {
    cook: 'Alice Cook House',
    cafejennie: 'Cafe Jennie',
    becker: 'Carl Becker House',
    bethe: 'Jansens at Bethe House',
    keeton: 'Keeton House',
    west104: 'Kosher',
    appel: 'North Star Marketplace',
    okies: 'Okenshields',
    libe: 'Olin Libe Cafe',
    rpcc: 'RPME',
    risley: 'Risley',
    rose: 'Rose Dining Hall'
}

const UNITNAME_MAP = {
    'AliceCookHouse': 'cook',
    'CafeJennie': 'cafejennie',
    'CarlBeckerHouse': 'becker',
    'JansensatBetheHouse': 'bethe',
    'KeetonHouse': 'keeton',
    'Kosher': 'west104',
    'NorthStarMarketplace': 'appel',
    'Okenshields': 'okies',
    'OlinLibeCafe': 'libe',
    'RPME': 'rpcc',
    'Risley': 'risley',
    'RoseDiningHall': 'rose'
}

exports.howDense = function (req, res) {
    const query = datastore.createQuery('density', 'density_info');

    datastore.runQuery(query, (error, entities) => {

        if (error) {
            reject(error);
            return;
        }

        if (req.query.id) {
            const id = req.query.id;
            const entity = entities.find((e) => e.id === Util.strip(ID_MAP[id]));
            if (entity && id in ID_MAP) {
                res.status(200).send(JSON.stringify([{
                    id,
                    density: entity.density
                }]));
                return;
            } else {
                res.status(401).send(JSON.stringify({
                    error: `Invalid ID: ${id}`
                }));
                return;
            }
        }

        res.status(200).send(JSON.stringify(entities.map((e) => {
            console.log(JSON.stringify(e));
            return ({
                id: UNITNAME_MAP[e.id],
                density: e.density
            })
        })));
    });
}

exports.facilityList = function (req, res) {
    res.status(200).send(JSON.stringify(Object.entries(DISPLAY_MAP).map(([key, value]) => ({
        displayName: value,
        id: key
    }))));
}

exports.facilityInfo = function (req, res) {
    const query = datastore.createQuery('hours');
    
    function getFacilityInfo(facility){
        if (facility && facility['operatingHours']) {
            const nextClosing = facility['operatingHours'].find((e) => e.startTimestamp < date && e.endTimestamp > date);
            let nextOpen = -1;
            let closingAt;

            if (nextClosing) {
                closingAt = nextClosing.endTimestamp;
            } else {
                closingAt = -1;

                // TODO This is broken. Needs to find last opening, not first opening.
                nextOpen = facility['operatingHours'].find((e) => e.startTimestamp > date) || {};
            }

            return ({
                id: facility.id,
                campusLocation: facility.campusLocation,
                nextOpen: nextOpen.startTimestamp || -1,
                closingAt: closingAt,
                dailyHours: facility.operatingHours
            })
        } else {
            return null;
        }
    }

    datastore.runQuery(query, (error, hours) => {
        if (error) {
            reject(error);
            return;
        }

        const date = Math.floor(Date.now() / 1000);

        if (req.query.id) {
            const id = req.query.id;
            if (id in ID_MAP) {
                let facility = hours.find(x => x.id == id);
                let facilityInfo = getFacilityInfo(facility);

                if (facilityInfo == null){
                    res.status(401).send(JSON.stringify({
                        error: `Invalid ID (access): ${id}`
                    }));                   
                } else {
                    res.status(200).send([facilityInfo]);                   
                }
                return;
            } else {
                res.status(401).send(JSON.stringify({
                    error: `Invalid ID: ${id}`
                }));
                return;
            }
        }

        res.status(200).send(Object.keys(ID_MAP).map((id) => {
            let facility = hours.find(x => x.id == id);
            getFacilityInfo(facility);
        }));
    });
}