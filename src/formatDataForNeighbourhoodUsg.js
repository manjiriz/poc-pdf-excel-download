import neighbourhoodUsageData from './neighbourhoodUsageData';
import _ from 'lodash';
class FormatNeighbourhoodUsage {
    formatNeighbourhoodData(columns_TableSet, doc) {
        console.log('---------columns_TableSet=======', columns_TableSet);
        console.log('------------doc----------', doc)
        var neighbourhoodUsgJson = _.cloneDeep(neighbourhoodUsageData);
        var firstValueNeiHoodUsgData = neighbourhoodUsgJson.meters[0].meterReadings;

    }
}

//module.exports = FormatNeighbourhoodUsage;

export default FormatNeighbourhoodUsage;