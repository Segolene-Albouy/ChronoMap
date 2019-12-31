/*import * as am4core from "./@amcharts/amcharts4/core.js";
import * as am4charts from "./@amcharts/amcharts4/charts.js";
import {AbstractChart} from "./ChronoMap.js";
import {getMinValueInArray, getMaxValueInArray, getArrayOfKeyValue} from "./utils.js";*/

class Timeline extends AbstractChart {
    constructor(chronoMap){
        super(chronoMap);

        this.amTime = this.chronoMap.container.createChild(am4charts.XYChart);
        this.series = [];
        this.minDate = getMinValueInArray(getArrayOfKeyValue(this.data.time, "year"));
        this.maxDate = getMaxValueInArray(getArrayOfKeyValue(this.data.time, "year"));
        this.yearRange = 1 / (this.maxDate - this.minDate);

        this.generate();
    }

    generate(){
        this._generateConfig();
        this._generateAllSeries();
    }

    _generateConfig(){
        this.amTime.toFront();
        this.amTime.height = 240;
        this.amTime.y = 510;
        this.amTime.x = -10;
        this.amTime.data = this.data.time;

        // Create axes
        let xAxes = this.amTime.xAxes.push(new am4charts.CategoryAxis());
        xAxes.dataFields.category = "year";
        let yAxes = this.amTime.yAxes.push(new am4charts.CategoryAxis());
        yAxes.dataFields.category = "i";

        // Creating a cursor for the heatmap
        this.amTime.cursor = new am4charts.XYCursor();
        this.amTime.cursor.lineY.disabled = true;
        this.amTime.cursor.behavior = "none";
        yAxes.tooltip.disabled = true;
        // Configuring the content of tooltip for the year axis
        xAxes.tooltip.background.fill = am4core.color("#9b9b9b");
        xAxes.tooltip.background.strokeWidth = 0;
        xAxes.tooltip.background.cornerRadius = 3;
        xAxes.tooltip.background.pointerLength = 0;
        xAxes.tooltip.dy = -80;
        xAxes.tooltip.dx = -65;

        // An adapter can modify the "normal" behavior of any amCharts object
        // Here it changes how the tooltip text is displayed when the user is hovering the heat map
        xAxes.adapter.add("getTooltipText", (date) => {
            let yearData = this.data.time.find(function (element) {
                // retrieve the information associated with the date currently being hovered
                return element.year === date;
            });
            let tooltips = "";
            let number = 0;
            for (let j = this.config.series.length -1; j >= 0; j--) {
                let entityName = this.config.series[j].entity;
                let s = yearData[entityName] > 1 ? "s" : "";
                if (yearData[entityName] > 0){number ++;}
                tooltips = tooltips + `\n${this.chronoMap.entity[entityName].heatmapTooltip}${s} : [bold]${yearData[entityName]}[/]`;
            }

            return `[bold]${date} — ${parseInt(date)+10}[/]${tooltips}${number === 0 ? "" : "\nClick to see more"}`;
        });

        // Configuration of the background grid
        xAxes.renderer.minGridDistance = 50; // tighten date labels
        xAxes.renderer.grid.template.strokeOpacity = 0;
        yAxes.renderer.grid.template.strokeOpacity = 0;
        xAxes.renderer.labels.template.fill = am4core.color("#636266");
        yAxes.renderer.labels.template.hidden = true;
    }

    _generateAllSeries(){
        for (let i = Object.keys(this.chronoMap.series).length -1; i >= 0; i--) {
            this.series.push(this._generateSeries(Object.values(this.chronoMap.series)[i]));
        }
    }

    _generateSeries(config){
        let series = this.amTime.series.push(new am4charts.ColumnSeries());
        series.dataFields.value = config.series;
        series.dataFields.categoryX = "year";
        series.dataFields.categoryY = "i";
        series.columns.template.fill = am4core.color(config.color);
        series.columns.template.width = am4core.percent(100);
        series.columns.template.strokeWidth = 0;

        // in order to show boxes that are associated with a date when clicking on a heat map stripe
        series.columns.template.events.on("hit", function(ev) {
            let clickedDate = ev.target.dataItem.dataContext.year;
            let yearData = this.data.time.find(function (element) {
                // retrieve the information associated with the date that has been clicked
                return element.year === clickedDate;
            });
            if (typeof yearData.ids !== "undefined" || yearData.ids.length === 0){
                this.chronoMap.idsClicked = yearData.ids; // set the property idsClicked
                let s = yearData.ids.length > 1 ? "s" : ""; // add an "s" if there is multiple records to display
                // define a title
                let timeRange = `Record${s} created in the decade of ${clickedDate}-${parseInt(clickedDate)+10}`;
                // generate boxes
                this.chronoMap.generateBoxes(yearData.ids, timeRange, this.chronoMap.data.main);
            }
        }.bind(this), false); // bind allow to use this referring to the instance instead to the DOM

        // in order to change the cursor appearance when hovering heatmap series
        series.columns.template.events.on("over", function(ev) {
            ev.target.cursorOverStyle = am4core.MouseCursorStyle.pointer;
            let hoverDate = ev.target.dataItem.dataContext.year;
            // retrieve the information associated with the date that has been hovered
            let yearData = this.data.time.find(element => element.year === hoverDate);

            function isYearEmpty(yearData, series){
                let empty = true;
                for (let i = series.length - 1; i >= 0; i--) {
                    // if all the series in year data are not empty
                    if (yearData[series[i].name] > 0) {empty = false;}
                }
                return empty;
            }

            // if the is an item created at this date, change the cursor to be a pointer
            if (! isYearEmpty(yearData, Object.keys(this.chronoMap.series))){
                ev.target.cursorOverStyle = am4core.MouseCursorStyle.pointer;
            } else {
                ev.target.cursorOverStyle = am4core.MouseCursorStyle.default;
            }
        }.bind(this), false); // bind allow to use this referring to the instance instead to the DOM

        series.heatRules.push({
            target: series.columns.template,
            property: "fillOpacity",
            min: 0,
            max: 0.8
        });

        return series;
    }
}

/*export {Timeline};*/
