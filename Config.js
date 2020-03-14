/*import {getMiddleValue} from "./utils.js";*/

const timeUnits = {
    "10y": "year",
    "1y": "year",
    "1M": "month",
    "10d": "day",
    "1d": "day",
    "1h": "hour"
};

/**
 * Difference between two dates in the chart measured in milliseconds
 * @type {{"1d": number, "10d": number, "1h": number, "1y": number, "10y": number, "1M": number}}
 */
const timeSpans = {
    "10y": 315532800000,
    "1y": 31532400000,
    "1M": 2592000000, // approximated to 30 days
    "10d": 864000000,
    "1d": 86400000,
    "1h": 3600000
};

const dateFormat = {
    "10y": "yyyy",
    "1y": "yyyy",
    "1M": "yyyy-MM",
    "10d": "yyyy-MM-dd",
    "1d": "yyyy-MM-dd",
    "1h": "yyyy-MM-dd hh"
};

/**
 * It defines which part of the map is visible to the user when loading the page
 * (homeZoomLevel : at what level is the map zoomed in?
 *  homeGeoPoint : geographical coordinates of the map centre)
 *
 * It defines is the countries are visible (showCountries)
 *
 * It defines how each series represented on the map will look like
 * In the array of the series property, each object will set an entity name,
 * a color and an angle in order to create map pins and heat map stripes accordingly
 */
class Config {
    // TODO ; trouver un moyen élégant de passer tous les éléments de config qu'on veut sans avoir des arguments à rallonge
    constructor(elementId="chronoMap", timeRange = "1y", timeChart= "timeline", isClickable= true, height= "1000"){
        this.timeRange = timeRange; // 10y, 1y, 1M, 10d, 1d, 1h
        this.timeUnit = timeUnits[this.timeRange];
        this.timeSpan = timeSpans[this.timeRange]; // timespan before and after the timedata, computed according to the timeRange
        this.dateFormat = dateFormat[this.timeRange];

        // todo : add showCountries
        // todo : allow to select the multitime chart option with

        this.isClickable = isClickable; // if the map pins/time chart are clickable
        this.timeChart = timeChart; // heatmap, linechart, timeline
        this.multiTimeChart = true; // if the time data are displayed in multiple stacked charts for each series of in one chart

        this.baseColors = colorScheme["primary"]; // TODO : select color theme // create color set with amcharts
        this.elementId = elementId;

        this.chartHeight = height;
        this.timeChartHeight = Math.round(this.chartHeight * 0.4); // TODO : depends on the chart type => eg timeline not multi very smol
        this.timeChartY = this.chartHeight - this.timeChartHeight + 20;
        this.timeChartTooltipY = -(this.timeChartHeight / 2.2);
        this.timeframeLabelY = this.timeChartY - 30;
        this.scrollbarHeight = this.timeChartHeight / 5;
        this.timeChartSpace = this.scrollbarHeight > 50 ? this.timeChartHeight - 180 : this.timeChartHeight - 100;
        document.getElementById(this.elementId).style.height = `${height}px`;

        this.homeZoomLevel = 2.1;
        this.homeGeoPoint = {latitude:30, longitude: 60};

        this.showCountries = false;
        this.angledPointers = false;

        /*if (lat.length !== 0){
            this.homeGeoPoint.latitude = getMiddleValue(lat);
        }
        if (long.length !== 0){
            this.homeGeoPoint.longitude = getMiddleValue(long);
        }
        if (lat.length !== 0 && long.length !== 0){
            // ESSAYER DE FAIRE UN TRUC POUR LE ZOOM LEVEL
        }*/
    }
}

/*export {Config};*/
