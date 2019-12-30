/*import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import AbstractChart from "ChronoMap";*/

class Scrollbar extends AbstractChart {
    constructor(chronoMap){
        super(chronoMap);

        this.map = chronoMap.map.amMap;
        this.timeline = chronoMap.time.amTime;

        this.amScrollbar = new am4charts.XYChartScrollbar();
        this.timeframeLabel = this.createBoxLabel(this.map, 480);

        this.generate();
    }

    generate(){
        this.timeline.amTime.scrollbarX = this.amScrollbar;

        for (let i = this.config.series.length -1; i >= 0; i--) {
            this.amScrollbar.series.push(this.timeline.series[i]);
        }

        this.amScrollbar.events.on("rangechanged", function() {
            let cursorMin = this.amScrollbar.range.start;
            let cursorMax = this.amScrollbar.range.end;

            // Conversion of the min and max range value into date (parseInt to get rid of the floating values)
            let dateMinRange = (cursorMin / this.timeline.yearRange) + this.timeline.minDate;
            let dateMaxRange = (cursorMax / this.timeline.yearRange) + this.timeline.minDate;
            // Show the timerange selected
            this.timeframeLabel.text = `${dateMinRange} — ${dateMaxRange}`;

            // remove the record boxes appearing when the user moves a cursor of the scrollbar
            $(`#${this.chronoMap.config.elementId.box}`).empty();
            // set the Unknown place label to be transparent
            this.map.unknownPlaceLabel.fillOpacity = 0;

            const timeData = this.chronoMap.data.time;

            // Get the index of th first and last object in the dataset corresponding to the selected timerange
            const start = Math.floor(cursorMin * timeData.time.length);
            const end = Math.ceil(cursorMax * timeData.time.length);

            // retrieve the sub-dataset containing all the data for the selected timerange
            const timerangeData = timeData.time.slice(start,end);
            let timerangeIds = [];
            // add to timerangeIds all the ids of the items that are present between the date min and date max
            timerangeData.map(yearData => {if (typeof yearData.ids !== "undefined") timerangeIds.push(...yearData.ids)});
            // remove all duplicate ids
            timerangeIds = timerangeIds.filter(unique);

            // for each place in the map dataset
            for (let i = Object.keys(this.map.data).length - 1; i >= 0; i--) {
                let latlong = Object.keys(this.map.data)[i];
                let place = this.map.data[latlong];

                // for each series that is displayed on the map
                for (let l = this.config.series.length -1; l >= 0; l--) {
                    // retrieve all ids that are both in the timeframe selected (timerangeIds)
                    // and in the current place (place.ids[entityName])
                    let entityName = this.config.series[l].entity;
                    if (place.ids[entityName].length !== 0){
                        // add to the ids property the ids currently visible (intersection of time and place)
                        this.map.mapPins[entityName][latlong].properties.dummyData.ids =
                            timerangeIds.filter(value => place.ids[entityName].includes(value));
                        // change the radius and the tooltip of the pin
                        this.map.definePinAppearance(this.map.mapPins[entityName][latlong], this.chronoMap.entity[entityName].name);
                    }
                }
            }
        }.bind(this), false); // bind allow to use this referring to the instance instead to the DOM
    }

    /**
     * Creates a box on the map in which it is possible to display labels
     *
     * @param chart object : chart in which the label must appear
     * @param y int : vertical offset from the top
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
}