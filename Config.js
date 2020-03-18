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
 *
 * @type {{"1d": string, "10d": string, "1h": string, "1y": string, "10y": string, "1M": string}}
 */
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

        this.defaultLat = 0;
        this.defaultLong = 0;
        this.defaultDate = 0;

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

    convertDate(timestamp){
        switch (this.timeRange) {
            case "10y":
                return new Date(timestamp).getFullYear();
            case "1y":
                return new Date(timestamp).getFullYear();
            case "1M":
                return new Date(timestamp);
            case "10d":
                return new Date(timestamp);
            case "1d":
                return new Date(timestamp);
            case "1h":
                return new Date(timestamp);
        }
    }

    addTimeSpan(timestamp, add = true){
        let date = timestamp instanceof Date ? timestamp : new Date(timestamp);
        switch (this.timeRange) {
            case "10y":
                return add ? date.setFullYear(date.getFullYear() + 10) : date.setFullYear(date.getFullYear() - 10);
            case "1y":
                return add ? date.setFullYear(date.getFullYear() + 1) : date.setFullYear(date.getFullYear() - 1);
            case "1M":
                return add ? date.setMonth(date.getMonth() + 1) : date.setMonth(date.getMonth() - 1);
            case "10d":
                return add ? date.setDate(date.getDate() + 10) : date.setDate(date.getDate() - 10);
            case "1d":
                return add ? date.setDate(date.getDate() + 1) : date.setDate(date.getDate() - 1);
            case "1h":
                return add ? date.setHours(date.getHours() + 1) : date.setHours(date.getHours() - 1);
        }
    }
}

/*export {Config};*/
