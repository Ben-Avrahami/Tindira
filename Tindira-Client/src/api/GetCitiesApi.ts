import axios from "axios";

const data = {
    resource_id: 'b7cf8f14-64a2-4b33-8d4b-edb286fdbd37',
    limit: 1500 //1272
};

let CitiesArray: string[] | null = null;

export function getCities() {
    if (CitiesArray !== null) {
        return Promise.resolve(CitiesArray);
    }

    return axios.get('https://data.gov.il/api/action/datastore_search', { params: data })
        .then(response => {
            CitiesArray = [];
            response.data.result.records.map((item: any) => CitiesArray!.push(item['שם_ישוב_לועזי'].toLowerCase()));
            return CitiesArray;
        })
        .catch(error => {
            console.error(error);
        });
}