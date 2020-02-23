/*import * as am4core from "./@amcharts/amcharts4/core.js";
import * as am4charts from "./@amcharts/amcharts4/charts.js";
import {AbstractChart} from "./ChronoMap.js";*/

class Time extends AbstractChart {
    constructor(chronoMap){
        super(chronoMap);

        this.minDate = Math.min.apply(null, Object.keys(this.data.time));
        this.maxDate = Math.max.apply(null, Object.keys(this.data.time));
        this.dateRange = 1 / (this.maxDate - this.minDate);

        this.amTime = this.chronoMap.container.createChild(am4charts.XYChart);
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
        // MARKER HONNETEMENT C'EST DEGUEULASSE PROPRIFIER MOI TOUSSA FISSA
        this.amTime.data = this.config.timeChart === "timeline" && this.config.multiTimeChart ?
            this.generateMultiDataset() : this.generateSimpleDataset();
        /*this.amTime.dateFormatter.dateFormat = this.config.dateFormat; // todo : add the date formatter to all time chart
        this.amTime.dateFormatter.inputDateFormat = this.config.dateFormat;*/

        // Create axes
        let yAxes, xAxes;
        if (!this.config.multiTimeChart){
            xAxes = this.amTime.xAxes.push(new am4charts.CategoryAxis());
            xAxes.dataFields.category = "date";
        } else {
            xAxes = this.amTime.xAxes.push(new am4charts.ValueAxis());
        }

        /*// TODO : all xAxes computed the same way
        if (this.config.timeChart === "timeline") {
            xAxes = this.amTime.xAxes.push(new am4charts.DateAxis());
            xAxes.baseInterval = {count: this.config.timeSpan, timeUnit: this.config.timeUnit}
            /!*xAxes.min = new Date("2019-11-10 05:00").getTime(); NOTE : calculer l'éventail de temps avec le timeSpan
            xAxes.max = new Date("2019-11-11 02:00").getTime();*!/
        } else {
            xAxes = this.amTime.xAxes.push(new am4charts.CategoryAxis());
            xAxes.dataFields.category = "date";
        }*/

        if (this.config.timeChart === "linechart"){
            yAxes = this.amTime.yAxes.push(new am4charts.ValueAxis());
        } else {
            yAxes = this.amTime.yAxes.push(new am4charts.CategoryAxis());
            yAxes.dataFields.category = "series";
        }

        // Creating a cursor for the heatmap
        this.amTime.cursor = new am4charts.XYCursor();
        this.amTime.cursor.lineY.disabled = true;
        this.amTime.cursor.behavior = "none";
        yAxes.tooltip.disabled = true;
        // Configuring the content of tooltip for the date axis
        xAxes.tooltip.background.fill = am4core.color("#9b9b9b");
        xAxes.tooltip.background.strokeWidth = 0;
        xAxes.tooltip.background.cornerRadius = 3;
        xAxes.tooltip.background.pointerLength = 0;
        xAxes.tooltip.dy = this.config.timeChartTooltipY;
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

            return number ? `[bold]${date} — ${parseInt(date)+this.config.timeSpan}[/]${tooltips}\nClick to see more` : "";
        });

        // Configuration of the background grid
        xAxes.renderer.minGridDistance = 50; // tighten date labels
        xAxes.renderer.grid.template.strokeOpacity = 0;
        yAxes.renderer.grid.template.strokeOpacity = 0;
        xAxes.renderer.labels.template.fill = am4core.color("#636266");
        yAxes.renderer.labels.template.hidden = true;
    }

    generateMultiDataset(){
        return Object.values(this.data.main).map(dataObject => {
            Object.defineProperty(dataObject, `${dataObject.series}-minDate`,
                Object.getOwnPropertyDescriptor(dataObject, "minDate"));
            delete dataObject.minDate;
            return dataObject;
        });
    }

    generateSimpleDataset(){
        return Object.values(this.data.time).sort((a, b) => (a.date > b.date) ? 1 : -1);
    }

    /**
     * Check in the data object given as parameter defining info for a particular time range
     * if any of the chart series is present during this time span
     * @param dateData {object}
     * @returns {boolean}
     */
    isTimeRangeEmpty(dateData){
        let empty = true;
        for (let i = Object.keys(this.chronoMap.series).length - 1; i >= 0; i--) {
            // if all the series in dateData are not empty
            if (dateData[Object.keys(this.chronoMap.series)[i]] > 0) {empty = false;}
        }
        return empty;
    }

    _generateAllSeries(){
        for (let i = Object.keys(this.chronoMap.series).length -1; i >= 0; i--) {
            this.chronoMap.series[Object.keys(this.chronoMap.series)[i]].time = this._generateSeries(Object.values(this.chronoMap.series)[i]);
        }
    }

    _generateSeries(config){
        let series, seriesTemplate;
        if (this.config.timeChart === "linechart") {
            series = this.generateLineSeries(config);
            seriesTemplate = series;
        } else {
            series = this.generateColumnSeries(config);
            seriesTemplate = series.columns.template;
        }

        // in order to show boxes that are associated with a date when clicking on a heat map stripe
        seriesTemplate.events.on("hit", (ev) => {
            const clickedDate = ev.target.dataItem.dataContext.date;
            const dateData = this.data.time[clickedDate];
            if (typeof dateData.ids !== "undefined" || dateData.ids.length === 0){
                this.chronoMap.idsClicked = dateData.ids; // set the property idsClicked
                const s = dateData.ids.length > 1 ? "s" : ""; // add an "s" if there is multiple records to display

                // generate boxes
                this.chronoMap.generateTable(dateData.ids, `Record${s} created between ${clickedDate}-${parseInt(clickedDate)+10}`);
            }
        });

        // in order to change the cursor appearance when hovering heatmap series
        seriesTemplate.events.on("over", (ev) => {
            ev.target.cursorOverStyle = am4core.MouseCursorStyle.pointer;
            const hoverDate = ev.target.dataItem.dataContext.date;
            const dateData = this.data.time[hoverDate];

            // if the is an item created at this date, change the cursor to be a pointer
            if (! this.isTimeRangeEmpty(dateData)){
                ev.target.cursorOverStyle = am4core.MouseCursorStyle.pointer;
            } else {
                ev.target.cursorOverStyle = am4core.MouseCursorStyle.default;
            }
        });

        return series;
    }

    generateColumnSeries(config){
        let series = this.amTime.series.push(new am4charts.ColumnSeries());
        series.columns.template.fill = am4core.color(config.color);
        series.columns.template.strokeWidth = 0;

        switch (this.config.multiTimeChart) {
            case true: // if the time chart must be on several rows (one per series)
                switch (this.config.timeChart) {
                    case "heatmap":

                        break;
                    case "timeline":
                        /*series.dataFields.openDateX = "minDate";
                        series.dataFields.dateX = "maxDate";*/
                        series.dataFields.categoryY = "series";
                        series.dataFields.openValueX = `${config.name}-minDate`;
                        series.dataFields.valueX = "maxDate";
                        break;
                }
                break;
            case false:
                series.dataFields.value = config.name;
                series.dataFields.categoryX = "date";
                series.dataFields.categoryY = "series";
                series.columns.template.width = am4core.percent(100);

                switch (this.config.timeChart) {
                    case "heatmap":
                        series.heatRules.push({
                            target: series.columns.template,
                            property: "fillOpacity",
                            min: 0,
                            max: 0.8
                        });
                        break;

                    case "timeline":
                        series.columns.template.height = am4core.percent(30);
                        series.columns.template.adapter.add("fillOpacity", (value, target) => {
                            if (target.dataItem.dataContext[config.name] === 0){
                                return 0;
                            }
                        });
                        break;
                }
                break;
        }

        return series;
    }

    generateLineSeries(config){
        let series = this.amTime.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = config.name;
        series.dataFields.categoryX = "date";
        series.stroke = am4core.color(config.color);
        series.strokeWidth = 2;
        series.tensionX = 0.75;
        series.paddingBottom = 10;

        return series;
    }
}

/*export {Timeline};*/
