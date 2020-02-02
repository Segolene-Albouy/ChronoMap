/* Build chronological map to visualize time and space using the charting library AmCharts V4 */
/*import * as am4core from "./@amcharts/amcharts4/core.js";
import {Config} from "./Config.js";
import {Series} from "./Series.js";
import {Map} from "./Map.js";
import {Timeline} from "./Timeline.js";
import {Scrollbar} from "./Scrollbar.js";*/


// mettre machin pour choisir la couleur en fonction de l'entité

const angle = [
    [90], // only one series displayed on the map
    [70, 110],
    [50, 90, 130],
    [30, 70, 110, 150],
    [10, 50, 90, 130, 170]
];

class ChronoMap {
    constructor(dataset = null, series = null, config = null) {
        /**
         * Config : object containing the information relating to the configuration of the chronomap
         * e.g. : height, timerange, type of time chart, etc.
         */
        this.config = config ? config : new Config();

        /**
         * Series : object containing all the properties concerning the series displayed on the chart (coherent set of data)
         * e.g. : color, name, angle of the map pin, etc.
         */
        this.series = series ? series : this.generateSeries(dataset);

        /**
         * Data : object containing all three data sets used to generate the chronomap
         * @type {{main: {}, time: {}, map: {}}}
         */
        this.data = { main: {}, time: {}, map: {} };
        this.generateDatasets(dataset);

        /**
         * Container : amcharts object containing all the charts composing the chronomap
         */
        this.container = this.generateContainer();

        /**
         * Map : map chart object used in the chronomap
         */
        this.map = new Map(this);

        /**
         * Time : time chart object used in the chronomap
         * @type {Time}
         */
        this.time = new Time(this);

        /**
         * Scrollbar : scrollbar object used to select a timerange in the chronomap
         * @type {Scrollbar}
         */
        this.scrollbar = new Scrollbar(this);

        this.bindSeriesInLegend();

        /* window.setTimeout(() => {
            for (let i = this.scrollbar.amScrollbar.scrollbarChart.series.values.length - 1; i >= 0; i--) {
                let series = this.scrollbar.amScrollbar.scrollbarChart.series.values[i];
                console.log(series.columns.template.properties);
                series.columns.template.properties.fill._value = {"r": 150, "g": 0, "b": 0};
                /!*series.columns.template.realFill._value = {"r": 150, "g": 0, "b": 0};*!/
                /!*series.dataItems.each(dataItem => {
                    dataItem.fill = "red";
                })*!/
            }
            /!*console.log(this.scrollbar.amScrollbar.scrollbarChart.dataItems.values);
            console.log(this.map.amMap.dataItems.values);
            this.map.amMap.dataItems.each(dataItem => console.log(dataItem));
            this.scrollbar.amScrollbar.scrollbarChart.dataItems.each(dataItem => {
                console.log(dataItem);
            })*!/
        },1000);
        window.setTimeout(() => {
            for (let i = this.scrollbar.amScrollbar.scrollbarChart.series.values.length - 1; i >= 0; i--) {
                let series = this.scrollbar.amScrollbar.scrollbarChart.series.values[i];
                series.columns.template.properties.fill._value = {"r": 0, "g": 0, "b": 150};
            }
        },2000);*/
    }

    generateContainer() {
        let container = am4core.create(this.config.elementId, am4core.Container);
        container.width = am4core.percent(100); // make it the same size as the div element
        container.height = am4core.percent(100);
        container.exporting.menu = new am4core.ExportMenu(); // add an exporting menu

        return container;
    }

    /**
     *
     * @param {array} dataset : array of objects structured like this
     * dataset = [
     *   {
     *      series:
     *   }
     * ];
     */
    generateDatasets(dataset) {
        if (! dataset)
            return;

        this.data.main = this.generateMainDataset(dataset);
        this.data.time = this.generateTimeDataset();
        this.data.map = this.generateMapDataset();
    }

    addData(data) {
        if (Object.keys(this.data).length !== 0){
            this.data = {
                main: this.addMainData(data),
                time: this.addTimeData(data),
                map: this.addMapData(data)
            };
        } else {
            this.generateDatasets([data]);
        }
        this.updateChronoMap();
    }

    addSeries(name, color = null) {
        const seriesNumber = Object.keys(this.series).length;

        if (seriesNumber === 5){
            windows.alert("Only five series can be displayed at the same time on the chronological map.");
        } else {
            this.series[name] = new Series(seriesNumber, name, color);

            for (let i = 0; i < seriesNumber.length; i++) {
                Object.values(this.series)[i].angle = angle[seriesNumber][i];
            }
        }
    }

    generateSeries(dataset) {
        if (! dataset)
            return {};

        let series = {};

        for (let i = dataset.length - 1; i >= 0; i--) {
            if (typeof series[dataset[i].series] === "undefined")
                series[dataset[i].series] = new Series(Object.keys(series).length, dataset[i].series);
        }

        const seriesNumber = Object.keys(series).length;

        for (let i = seriesNumber - 1; i >= 0; i--) {
            Object.values(series)[i].angle = angle[seriesNumber-1][i];
        }

        return series;
    }

    addMainData(data) {

    }

    generateMainDataset(dataset) {
        let mainDataset = {};

        dataset.map(data => mainDataset[`${this.series[data.series].number}${data.id}`] = data);

        return mainDataset;
    }

    addTimeData(data) {
        /*public function getTimeData(\TAMAS\AstroBundle\Entity\OriginalText $item, $timeData, $entities){
        $year = $item->getTpq() ? substr($item->getTpq(),0,-1)."0" : 0;
        $taq = $item->getTaq() ? substr($item->getTaq(),0,-1)."0" : 0;

        $oiId = "oi".$item->getId();

        $dataTemplate = ["year" => 0, "i" => "i", "ids" => []];
        foreach ($entities as $entity){
            $dataTemplate[$entity] = 0;
        }

        for ($date = $year; $date <= $taq; $date += 10) {
            if (! isset($timeData[$date])) {
                $timeData[$date]  = $dataTemplate;
                $timeData[$date]["year"] = $date;
            }

            if (! in_array($oiId, $timeData[$date]["ids"])){
                $timeData[$date]["ids"][] = $oiId;
                $timeData[$date]["originalText"] += 1;
            }
        }

        return $timeData;
    }*/
    };

    generateTimeDataset() {
        const data = Object.values(this.data.main);
        let timeData = {};

        let template = {
            date: 0,
            i: "i"
        };

        Object.keys(this.series).map(e => {template[e] = 0});

        for (let i = data.length - 1; i >= 0; i--) {
            let date = data[i].minDate !== null ? data[i].minDate : 0;
            let maxDate = data[i].maxDate !== null ? data[i].maxDate : 0;

            for (date; date <= maxDate; date += 1) {
                if (typeof timeData[parseInt(date)] === 'undefined'){
                    timeData[parseInt(date)] = {...template};
                    timeData[parseInt(date)].date = date;
                    timeData[parseInt(date)].ids = [];
                }
                timeData[parseInt(date)][data[i].series] += 1;
                timeData[parseInt(date)].ids.push(`${this.series[data[i].series].number}${data[i].id}`);
            }
        }

        const dates = Object.keys(timeData).map(x => parseInt(x));

        // in order to show year where nothing happened
        let minDate = Math.min(... dates)-this.config.timespan, maxDate = Math.max(... dates)+this.config.timespan;

        for (minDate; minDate <= maxDate; minDate++) {
            if (typeof timeData[minDate] === 'undefined'){
                timeData[minDate] = {...template};
                timeData[minDate].date = minDate;
                timeData[minDate].ids = [];
            }
        }

        return timeData;
    };

    addMapData = (data) => {
        /*$oiId = "oi".$item->getId();

        if ($item->getPlace()){
            $lat = $item->getPlace()->getLat() ? $item->getPlace()->getLat() : 0;
            $long = $item->getPlace()->getLong() ? $item->getPlace()->getLong() : 0;

            if (! isset($mapData["$lat,$long"])){
                $mapData["$lat,$long"] = [
                    "lat" => $lat,
                    "long" => $long,
                    "place" => $item->getPlace()->getPlaceName(),
                    "ids" => $entities
                ];
            }
            if (! in_array($oiId, $mapData["$lat,$long"]["ids"]["originalText"])){
                $mapData["$lat,$long"]["ids"]["originalText"][] = $oiId;
            }

        } else {
            if (!isset($mapData["0"])){
                $mapData["0"] = [
                    "lat" => 0,
                    "long" => 0,
                    "place" => "<span class='noInfo'>Unknown place</span>",
                    "ids" => $entities
                ];
            }

            if (! in_array($oiId, $mapData["0"]["ids"]["originalText"])){
                $mapData["0"]["ids"]["originalText"][] = $oiId;
            }
        }

        return $mapData;*/
    };

    /**
     *
     */
    generateMapDataset() {
        const data = Object.values(this.data.main);

        let mapData = {};

        let ids = {};
        Object.keys(this.series).map(e => {ids[e] = []});

        for (let i = data.length - 1; i >= 0; i--) {
            const latlong = `${data[i].lat},${data[i].long}`;

            if (typeof mapData[latlong] === "undefined"){
                mapData[latlong] = {
                    "lat": data[i].lat,
                    "long": data[i].long,
                    "place": data[i].placeName,
                    "ids": JSON.parse(JSON.stringify(ids))
                };
            }
            mapData[latlong].ids[data[i].series].push(`${this.series[data[i].series].number}${data[i].id}`);
        }

        return mapData;
    }

    updateChronoMap() {

    }

    /**
     * Allows to toggle map and time chart series simultaneously on click on legend items
     */
    bindSeriesInLegend() {
        for (let i = Object.values(this.series).length - 1; i >= 0; i--) {
            const mapSeries = Object.values(this.series)[i].map;
            const timeSeries = Object.values(this.series)[i].time;

            mapSeries.events.on("hidden", () => {
                timeSeries.hide();
            });

            mapSeries.events.on("shown", () => {
                timeSeries.show();
            });
        }
    }

    generateTable(ids, title){

    }
}

/**
 * This class is the parent class of all type of charts
 */
class AbstractChart {
    /**
     * @param {ChronoMap} chronoMap
     */
    constructor(chronoMap){
        this.chronoMap = chronoMap;
        this.data = chronoMap.data;
        this.config = this.chronoMap.config;
    }

    generate(){}
    _generateSeries(){}
    _generateAllSeries(){}
    _generateConfig(){}
}

/*export {ChronoMap, AbstractChart};*/
