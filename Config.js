/*import {getMiddleValue} from "./utils.js";*/

const timeUnits = {
    "10y": "year",
    "1y": "year",
    "1M": "month",
    "10d": "day",
    "1d": "day",
    "1h": "hour"
};

const timeSpans = {
    "10y": 10,
    "1y": 1,
    "1M": 1,
    "10d": 10,
    "1d": 1,
    "1h": 1
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
    constructor(timeRange = "1y", theme = "primary", isClickable= true, timeChart= "heatmap", height= "550", elementId="chronoMap"){
        this.timeRange = timeRange; // 10y, 1y, 1M, 10d, 1d, 1h
        this.timeUnit = timeUnits[this.timeRange];
        this.timespan = timeSpans[this.timeRange]; // timespan before and after the timedata, computed according to the timeRange

        this.isClickable = false; // if the map pins/time chart are clickable
        this.timeChart = "heatmap"; // heatmap, linechart, timeline

        this.baseColors = colorScheme[theme];
        this.elementId = elementId;

        this.chartHeight = height;
        this.timeframeLabelY = this.chartHeight*(3.4/5);
        this.timeChartY = this.chartHeight*(3.6/5);
        this.timeChartHeight = this.chartHeight*(2.5/7);
        this.timeChartTooltipY = -(this.timeChartHeight/2.3);
        this.scrollbarHeight = this.timeChartHeight/4;
        document.getElementById(this.elementId).style.height = `${height}px`;

        this.homeZoomLevel = 2.1;
        this.homeGeoPoint = {latitude:30, longitude: 60};

        this.showCountries = false;

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
