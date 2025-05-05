import station from '../constants/station'
export function getPlatform (stationId) {
    return station[stationId].split('-')[0]
}

export function getCountry (stationId) {
    return station[stationId].split('-')[1]
}
