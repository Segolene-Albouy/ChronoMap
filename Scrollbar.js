/*import * as am4core from "./@amcharts/amcharts4/core.js";
import * as am4charts from "./@amcharts/amcharts4/charts.js";
import {AbstractChart} from "./ChronoMap.js";
import {unique} from "./utils.js";*/

class Scrollbar extends AbstractChart {
    constructor(chronoMap){
        super(chronoMap);

        this.map = chronoMap.map;
        this.time = chronoMap.time;

        this.mapData = chronoMap.data.map;
        this.timeData = chronoMap.time.amTime.data/*chronoMap.data.time*/;

        this.amScrollbar = this.config.scrollbarHeight > 50 ? new am4charts.XYChartScrollbar() : new am4core.Scrollbar();
        this.timeframeLabel = this.createBoxLabel(this.map.amMap, this.config.timeframeLabelY);

        this.generate();
    }

    generate(){
        this.time.amTime.scrollbarX = this.amScrollbar;

        /*chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarX.align = "center"
chart.scrollbarX.width = am4core.percent(85);*/

        if (this.config.scrollbarHeight > 50){
            this.amScrollbar.percentHeight = 25;
            this.amScrollbar.height = this.config.scrollbarHeight;
            for (let i = Object.keys(this.chronoMap.series).length -1; i >= 0; i--) {
                this.amScrollbar.series.push(Object.values(this.chronoMap.series)[i].time);
            }
        }

        this.amScrollbar.events.on("rangechanged", () => {
            this.updateMap();
        });

        this.time.amTime.zoomOutButton.events.on("hit", () => {
            this.updateMap(true);
        });
    }

    /**
     * Creates a box on the map in which it is possible to display labels
     *
     * @param chart {object} : chart in which the label must appear
     * @param y {int} : vertical offset from the top
     */
    createBoxLabel(chart, y) {
        let box = this.chronoMap.container.createChild(am4core.Container);
        box.width = 100;
        box.height = 35;
        box.align = "center";
        box.y = y;
        box.padding(10, 10, 10, 10);
        box.background.fill = am4core.color("#000");
        box.background.fillOpacity = 0.1;
        let boxLabel = box.createChild(am4core.Label);
        boxLabel.align = "center";

        return boxLabel;
    }

    /**
     *
     * @param onZoomOut {boolean} : is the method triggered by a click on the zoom out button ?
     */
    updateMap(onZoomOut = false){
        const cursorMin = onZoomOut ? 0 : this.amScrollbar.range.start;
        const cursorMax = onZoomOut ? 1 : this.amScrollbar.range.end;

        // Conversion of the min and max range value into date (parseInt to get rid of the floating values)
        const dateMinRange = (cursorMin / this.time.dateRange) + this.time.minDate;
        const dateMaxRange = (cursorMax / this.time.dateRange) + this.time.minDate;
        // Show the timerange selected
        this.timeframeLabel.text = `${parseInt(dateMinRange)} — ${parseInt(dateMaxRange)}`;

        /*!// remove the record boxes appearing when the user moves a cursor of the scrollbar
        $(`#${this.chronoMap.config.elementId.box}`).empty(); MARKER : box box box*/
        // set the Unknown place label to be transparent
        this.map.unknownPlaceLabel.fillOpacity = 0;

        // Get the index of th first and last object in the dataset corresponding to the selected timerange
        const start = Math.floor(cursorMin * this.timeData.length);
        const end = Math.ceil(cursorMax * this.timeData.length);

        // retrieve the sub-dataset containing all the data for the selected timerange
        const timerangeData = this.timeData.slice(start,end);
        let timerangeIds = [];
        // add to timerangeIds all the ids of the items that are present between the date min and date max
        timerangeData.map(dateData => {if (typeof dateData.ids !== "undefined") timerangeIds.push(...dateData.ids)});
        // remove all duplicate ids
        timerangeIds = timerangeIds.filter(unique);

        // for each place in the map dataset
        for (let i = Object.keys(this.mapData).length - 1; i >= 0; i--) {
            const latlong = Object.keys(this.mapData)[i];
            let place = this.mapData[latlong];

            // for each series that is displayed on the map
            for (let l = Object.keys(this.chronoMap.series).length -1; l >= 0; l--) {
                // retrieve all ids that are both in the timeframe selected (timerangeIds)
                // and in the current place (place.ids[seriesName])
                const seriesName = Object.keys(this.chronoMap.series)[l];
                if (place.ids[seriesName].length !== 0){
                    // add to the ids property the ids currently visible (intersection of time and place)
                    this.map.mapPins[seriesName][latlong].properties.dummyData.ids =
                        timerangeIds.filter(value => place.ids[seriesName].includes(value));
                    // change the radius and the tooltip of the pin
                    this.map.definePinAppearance(this.map.mapPins[seriesName][latlong], this.chronoMap.series[seriesName].name);
                }
            }
        }
    }
}

/*export {Scrollbar};*/
