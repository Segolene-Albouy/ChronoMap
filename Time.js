/*import * as am4core from "./@amcharts/amcharts4/core.js";
import * as am4charts from "./@amcharts/amcharts4/charts.js";
import {AbstractChart} from "./ChronoMap.js";
import {getMinValueInArray, getMaxValueInArray, getArrayOfKeyValue} from "./utils.js";*/

class Time extends AbstractChart {
    constructor(chronoMap){
        super(chronoMap);

        this.amTime = this.chronoMap.container.createChild(am4charts.XYChart);
        this.series = [];
        this.minDate = Math.min.apply(null, Object.keys(this.data.time)/*getArrayOfKeyValue(this.data.time, "date")*/);
        this.maxDate = Math.max.apply(null, Object.keys(this.data.time)/*getArrayOfKeyValue(this.data.time, "date")*/);
        this.dateRange = 1 / (this.maxDate - this.minDate);

        this.generate();
    }

    generate(){
        this._generateConfig();
        this._generateAllSeries();
    }

    _generateConfig(){
        this.amTime.toFront();
        this.amTime.height = this.config.timeChartHeight;
        this.amTime.y = this.config.timeChartY;
        this.amTime.x = -10;
        this.amTime.data = Object.values(this.data.time).sort((a, b) => (a["date"] > b["date"]) ? 1 : -1);

        // Create axes
        let xAxes = this.amTime.xAxes.push(new am4charts.CategoryAxis());
        xAxes.dataFields.category = "date";
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
        xAxes.tooltip.dy = this.config.timeChartTooltipY;/*-80*/
        xAxes.tooltip.dx = -65;

        // the adapter changes how the tooltip text is displayed when the user is hovering the heat map
        xAxes.adapter.add("getTooltipText", (date) => {
            const dateData = this.chronoMap.data.time[date];
            let tooltips = "";
            let number = 0;
            for (let j = Object.keys(this.chronoMap.series).length -1; j >= 0; j--) {
                let seriesName = Object.values(this.chronoMap.series)[j].name;
                let s = dateData[seriesName] > 1 ? "s" : "";
                if (dateData[seriesName] > 0){number ++;}

                tooltips = tooltips + `\n${seriesName}${s} : [bold]${dateData[seriesName]}[/]`;
            }

            return number ? `[bold]${date} — ${parseInt(date)+this.config.timespan}[/]${tooltips}\nClick to see more` : "";
        });

        // Configuration of the background grid
        xAxes.renderer.minGridDistance = 50; // tighten date labels
        xAxes.renderer.grid.template.strokeOpacity = 0;
        yAxes.renderer.grid.template.strokeOpacity = 0;
        xAxes.renderer.labels.template.fill = am4core.color("#636266");
        yAxes.renderer.labels.template.hidden = true;
    }

    /**
     * Check in the data object given as parameter defining info for a particular time range
     * if any of the chart series is present during this time span
     * @param dateData {object}
     * @returns {boolean}
     */
    isYearEmpty(dateData){
        let empty = true;
        for (let i = Object.keys(this.chronoMap.series).length - 1; i >= 0; i--) {
            // if all the series in dateData are not empty
            if (dateData[Object.keys(this.chronoMap.series)[i]] > 0) {empty = false;}
        }
        return empty;
    }

    _generateAllSeries(){
        for (let i = Object.keys(this.chronoMap.series).length -1; i >= 0; i--) {
            this.series.push(this._generateSeries(Object.values(this.chronoMap.series)[i]));
        }
    }

    _generateSeries(config){
        let series = this.amTime.series.push(new am4charts.ColumnSeries());
        series.dataFields.value = config.name;
        series.dataFields.categoryX = "date";
        series.dataFields.categoryY = "i";
        series.columns.template.fill = am4core.color(config.color);
        series.columns.template.width = am4core.percent(100);
        series.columns.template.strokeWidth = 0;

        // in order to show boxes that are associated with a date when clicking on a heat map stripe
        series.columns.template.events.on("hit", (ev) => {
            const clickedDate = ev.target.dataItem.dataContext.date;
            const dateData = this.data.time[clickedDate];
            if (typeof dateData.ids !== "undefined" || dateData.ids.length === 0){
                this.chronoMap.idsClicked = dateData.ids; // set the property idsClicked
                const s = dateData.ids.length > 1 ? "s" : ""; // add an "s" if there is multiple records to display

                // define a title
                const timeRange = `Record${s} created between ${clickedDate}-${parseInt(clickedDate)+10}`;
                // generate boxes
                this.chronoMap.generateBoxes(dateData.ids, timeRange, this.chronoMap.data.main);
            }
        });

        // in order to change the cursor appearance when hovering heatmap series
        series.columns.template.events.on("over", (ev) => {
            ev.target.cursorOverStyle = am4core.MouseCursorStyle.pointer;
            const hoverDate = ev.target.dataItem.dataContext.date;
            const dateData = this.data.time[hoverDate];

            // if the is an item created at this date, change the cursor to be a pointer
            if (! this.isYearEmpty(dateData)){
                ev.target.cursorOverStyle = am4core.MouseCursorStyle.pointer;
            } else {
                ev.target.cursorOverStyle = am4core.MouseCursorStyle.default;
            }
        });

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
