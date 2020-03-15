/* Build chronological map to visualize time and space using the charting library AmCharts V4 */
/*import * as am4core from "./@amcharts/amcharts4/core.js";
import {Config} from "./Config.js";
import {Series} from "./Series.js";
import {Map} from "./Map.js";
import {Timeline} from "./Timeline.js";
import {Scrollbar} from "./Scrollbar.js";*/

const angle = [
    [90], // only one series displayed on the map
    [70, 110],
    [50, 90, 130],
    [30, 70, 110, 150],
    [10, 50, 90, 130, 170]
];

const offset = [
    [0],
    [0.5, -0.5],
    [1, 0, -1],
    [1.5, 0.5, -0.5, -1.5],
    [2, 1, 0, -1, -2]
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
         * Objects defining how data is structured in each datasets
         * @type {{main: {}, time: {}, map: {}}}
         */
        this.template = { main: {}, time: {}, map: {} };

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

        /**
         * Array of ids of the clicked element in the chart
         * @type {[]}
         */
        this.clickedItems = [];

        /**
         * Number of items displayed on the ChronoMap, used to generate automatic ids
         * @type {number}
         */
        this.itemNumber = 0;

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
        // trying to put color in scrollbar series
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

        this.generateMainDataset(dataset);
        this.generateTimeDataset();
        this.generateMapDataset();
    }

    generateTimeTemplate(){
        let template = {date: 0, series: "all"};
        Object.keys(this.series).map(e => {template[e] = 0});
        this.template.time = template;
    }

    generateMapTemplate(){
        let template = {};
        Object.keys(this.series).map(e => {template[e] = []});
        this.template.map = template;
    }

    addData(data) {
        if (Object.keys(this.data).length !== 0){
            this.addMainData(data);

            if (Object.keys(this.template.time).length === 0){
                this.generateTimeTemplate();
            }
            this.addTimeData(data);
            if (Object.keys(this.template.map).length === 0){
                this.generateMapTemplate();
            }
            this.addMapData(data);
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

            if (this.config.angledPointers){
                for (let i = 0; i < seriesNumber.length; i++) {
                    Object.values(this.series)[i].angle = angle[seriesNumber][i];
                }
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

        // space occupied by one series
        const seriesSpace = this.config.timeChartSpace/seriesNumber;
        const seriesWidth = seriesSpace/seriesNumber;

        for (let i = seriesNumber - 1; i >= 0; i--) {
            Object.values(series)[i].height = seriesSpace * 0.8;
            Object.values(series)[i].offset = offset[seriesNumber-1][i]*seriesWidth;

            if (this.config.angledPointers){
                Object.values(series)[i].angle = angle[seriesNumber-1][i];
            }
        }

        return series;
    }

    addMainData(data) {
        this.itemNumber += 1;

        data.id = data.id ? data.id : this.itemNumber;
        data.lat = data.lat ? data.lat : this.config.defaultLat;
        data.long = data.long ? data.long : this.config.defaultLong;

        data.minDate = data.minDate ? new Date(`${data.minDate}`).getTime() : 0; // TODO : replace default value with earliest date of the chronomap
        data.maxDate = data.maxDate ? new Date(`${data.maxDate}`).getTime() : 0 + this.config.timeSpan;

        this.data.main[`${this.series[data.series].number}${data.id}`] = data
    }

    generateMainDataset(dataset) {
        dataset.map(data => this.addMainData(data));
    }

    addTimeData(data = null, minDate = null, maxDate = null) {
        // NOTE : dates are supposed to be parsed because they passed through addMainData()
        if (!minDate && !maxDate){
            minDate = data.minDate;
            maxDate = data.maxDate;
        }

        for (minDate; minDate <= maxDate; minDate = this.config.addTimeSpan(minDate)) {
            if (typeof this.data.time[minDate] === 'undefined'){
                this.data.time[minDate] = {...this.template.time};
                this.data.time[minDate].date = new Date(minDate);
                this.data.time[minDate].ids = [];
            }
            if (data){
                this.data.time[minDate][data.series] += 1;
                this.data.time[minDate].ids.push(`${this.series[data.series].number}${data.id}`);
            }
        }
    };

    generateTimeDataset() {
        const data = Object.values(this.data.main);

        if (Object.keys(this.template.time).length === 0){
            this.generateTimeTemplate();
        }

        for (let i = data.length - 1; i >= 0; i--) {
            this.addTimeData(data[i]);
        }

        const dates = Object.keys(this.data.time).map(x => parseInt(x));

        // in order to show dates where nothing happened
        let minDate = Math.min(... dates) - this.config.timeSpan, maxDate = Math.max(... dates) + this.config.timeSpan;
        this.addTimeData(null, minDate, maxDate);
    };

    addMapData = (data) => {
        const latlong = `${data.lat},${data.long}`;

        if (typeof this.data.map[latlong] === "undefined"){
            this.data.map[latlong] = {
                "lat": data.lat,
                "long": data.long,
                "place": data.placeName,
                "ids": JSON.parse(JSON.stringify(this.template.map))
            };
        }
        this.data.map[latlong].ids[data.series].push(`${this.series[data.series].number}${data.id}`);
    };

    /**
     *
     */
    generateMapDataset() {
        const data = Object.values(this.data.main);

        if (Object.keys(this.template.map).length === 0){
            this.generateMapTemplate();
        }

        for (let i = data.length - 1; i >= 0; i--) {
            this.addMapData(data[i]);
        }
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

    generateTable(title){
        const ids = this.clickedItems;

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
