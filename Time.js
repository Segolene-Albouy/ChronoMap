/*import * as am4core from "./@amcharts/amcharts4/core.js";
import * as am4charts from "./@amcharts/amcharts4/charts.js";
import {AbstractChart} from "./ChronoMap.js";*/

class Time extends AbstractChart {
    constructor(chronoMap){
        super(chronoMap);

        /**
         * Minimal date in the time dataset (timestamp)
         * @type {number}
         */
        this.minDate = 0;

        /**
         * Maximal date in the time dataset (timestamp)
         * @type {number}
         */
        this.maxDate = 0;

        /**
         * Fraction of one corresponding to one time range relative to the
         * difference between the extreme dates in the time dataset
         * @type {number}
         */
        this.dateRange = 0;

        /**
         * Amcharts chart object corresponding to the time chart
         * @type {{}}
         */
        this.amTime = {};

        this.generate();
    }

    generate(){
        this.minDate = Math.min.apply(null, Object.keys(this.data.time));
        this.maxDate = Math.max.apply(null, Object.keys(this.data.time));
        this.dateRange = 1 / (this.maxDate - this.minDate);

        this.amTime = this.chronoMap.container.createChild(am4charts.XYChart);

        this._generateConfig();
        this._generateAllSeries();
    }

    _generateConfig(){
        this.amTime.toFront();
        this.amTime.height = this.config.timeChartHeight;
        this.amTime.y = this.config.timeChartY;
        this.amTime.x = -10;

        // Date formatting and display
        this.amTime.dateFormatter.dateFormat = this.config.dateFormat;
        this.amTime.dateFormatter.inputDateFormat = this.config.dateFormat;
        //this.amTime.baseInterval = {count: this.config.timeSpan, timeUnit: this.config.timeUnit};
        // NOTE : the keys in the time dataset must be the same as the way the date in the time axis is expressed

        // Data
        this.amTime.data = this.generateDataset();

        // Horizontal axis : time
        let xAxis = this.generateXAxis();
        // Vertical axis : series
        let yAxis = this.generateYAxis();

        // Axes configuration
        yAxis.tooltip.disabled = true;
        xAxis.renderer.minGridDistance = 50; // tighten date labels
        xAxis.renderer.grid.template.strokeOpacity = 0;

        // Creating a cursor for the heatmap
        this.amTime.cursor = new am4charts.XYCursor();
        this.amTime.cursor.lineY.disabled = true;
        this.amTime.cursor.behavior = "none";
    }

    /* * * * * * * * *
     *               *
     *    DATASET    *
     *               *
     * * * * * * * * */

    generateDataset(){
        if (this.config.multiTimeChart){
            return this.config.timeChart === "timeline" ? this.generateMultiDataset() : this.generateSimpleDataset();
        } else {
            return this.generateSimpleDataset();
        }
    }

    generateMultiDataset(){
        // in order to differentiate the series, they must rely on different field name
        return Object.values(this.data.main).map(dataObject => {
            dataObject[`${dataObject.series}-minDate`] = dataObject.minDate;
            dataObject.maxDate = this.config.addTimeSpan(dataObject.maxDate);

            return dataObject;
        });
    }

    generateSimpleDataset(){
        /*let dataset = Object.values(this.data.time);
        dataset.map(data => data.date = `${this.config.convertDate(data.date)}`);
        return dataset.sort((a, b) => (a.date > b.date) ? 1 : -1);*/
        if (this.config.timeChart === "heatmap"){
            Object.values(this.data.time).map(data => data.date = `${this.config.convertDate(data.date)}`);
        }
        return Object.values(this.data.time).sort((a, b) => (a.date > b.date) ? 1 : -1);
    }

    /* * * * * * * * *
     *               *
     *     AXES      *
     *               *
     * * * * * * * * */

    /* * * * * * * * *
     *   TIME AXIS   *
     * * * * * * * * */

    generateXAxis(){
        // TODO : all xAxes computed the same way, as date axis
        let xAxis;
        // NOTE : Date axis is for now used only by multi timeline and line chart
        if ((this.config.multiTimeChart && this.config.timeChart === "timeline") || (this.config.timeChart === "linechart")){
            xAxis = this.amTime.xAxes.push(new am4charts.DateAxis());
            xAxis.min = this.minDate;
            /*xAxis.max = this.maxDate;*/

            /*let minDate = new Date(this.minDate);
            let maxDate = new Date(this.maxDate);
            xAxis.min = minDate.setMonth(minDate.getMonth() + 6);
            xAxis.max = maxDate.setMonth(maxDate.getMonth() - 6);
            console.log(this.minDate, xAxis.min, this.maxDate, xAxis.max);*/
        } else {
            // NOTE : other types of charts use a category axis
            xAxis = this.amTime.xAxes.push(new am4charts.CategoryAxis());
            xAxis.dataFields.category = "date";
        }

        // Configuring the content of tooltip for the date axis
        let tooltip = xAxis.tooltip;
        tooltip.background.fill = am4core.color("#9b9b9b");
        tooltip.background.strokeWidth = 0;
        tooltip.background.cornerRadius = 3;
        tooltip.background.pointerLength = 0;
        tooltip.dy = this.config.timeChartTooltipY;
        tooltip.dx = -65;

        // the adapter changes how the tooltip text is displayed when the user is hovering the heat map
        xAxis.adapter.add("getTooltipText", (date) => {
            date = isNaN(new Date(`${date}`)) ? date : new Date(`${date}`).getTime();
            return this.generateTooltipContent(date);
        });

        let dateLabels = xAxis.renderer.labels.template;
        dateLabels.fillOpacity = 0.7;
        dateLabels.fill = am4core.color("#636266");

        // TODO : attempt to parse horizontal axis label in Date : weird bug
        /*dateLabels.adapter.add("text", (label, bloup) => {
            console.log(bloup);
            return this.config.convertDate(label);
        });*/

        return xAxis;
    }

    generateTooltipContent(date){
        if (typeof date === "undefined" || isNaN(date))
            return `Undefined date: ${date}`;

        const minDate = this.config.convertDate(date), maxDate = this.config.convertDate(this.config.addTimeSpan(date));
        const dateData = this.data.time[date];
        let tooltips = "";
        let number = 0;
        if (typeof dateData !== "undefined"){
            for (let j = Object.keys(this.chronoMap.series).length -1; j >= 0; j--) {
                let seriesName = Object.values(this.chronoMap.series)[j].name;
                seriesName = dateData[seriesName] > 1 ? seriesName.pluralize() : seriesName;
                if (dateData[seriesName] > 0){number ++;}

                tooltips = tooltips + `\n${seriesName} : [bold]${dateData[seriesName]}[/]`;
            }
        }

        return number ? `[bold]${minDate} — ${maxDate}[/]${tooltips}\nClick to see more` : "";
    }

    /* * * * * * * * *
     *  SERIES AXIS  *
     * * * * * * * * */

    generateYAxis(){
        let yAxis;
        if (this.config.timeChart === "linechart"){
            yAxis = this.amTime.yAxes.push(new am4charts.ValueAxis());
        } else {
            yAxis = this.amTime.yAxes.push(new am4charts.CategoryAxis());
            yAxis.dataFields.category = "series";
        }

        if (!this.config.multiTimeChart){
            yAxis.renderer.grid.template.strokeOpacity = 0;
            yAxis.renderer.labels.template.hidden = true;
        } else {
            let seriesLabels = yAxis.renderer.labels.template;
            seriesLabels.verticalCenter = "middle";

            /*dateLabels.fillOpacity = 0.7;
            dateLabels.fill = am4core.color("#636266");*/
        }
        return yAxis;
    }

    /* * * * * * * * *
     *               *
     *     SERIES    *
     *               *
     * * * * * * * * */

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

        // define event trigger on click on a series
        this.hitEvent(seriesTemplate);

        // define event trigger on hover on a series
        this.hoverEvent(seriesTemplate);

        return series;
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

    generateColumnSeries(config){
        let series = this.amTime.series.push(new am4charts.ColumnSeries());
        series.columns.template.fill = am4core.color(config.color);
        series.columns.template.strokeWidth = 0;
        series.columns.template.width = am4core.percent(100);

        switch (this.config.multiTimeChart) {
            case true: // if the time chart must be on several rows (one per series)
                switch (this.config.timeChart) {
                    case "heatmap":
                        series.dataFields.value = config.name;
                        series.dataFields.categoryX = "date";
                        series.dataFields.categoryY = "series";

                        series.heatRules.push({
                            target: series.columns.template,
                            property: "fillOpacity",
                            min: 0,
                            max: 0.8
                        });
                        break;
                    case "timeline":
                        series.dataFields.categoryY = "series";
                        series.dataFields.openDateX = `${config.name}-minDate`;
                        series.dataFields.dateX = "maxDate";
                        //series.columns.template.cornerRadiusBottomLeft = 10;
                        series.stacked = true;
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
        series.dataFields.dateX = "date";
        series.stroke = am4core.color(config.color);
        series.strokeWidth = 2;
        series.tensionX = 0.75;
        series.paddingBottom = 10;

        return series;
    }

    /* * * * * * * * *
     *               *
     *  INTERACTION  *
     *               *
     * * * * * * * * */

    hitEvent(template){
        template.events.on("hit", (event) => {
            if (this.config.multiTimeChart && this.config.timeChart === "timeline"){
                const clickedEvent = event.target.dataItem.dataContext;
                this.chronoMap.clickedItems = [clickedEvent.id];
                this.chronoMap.generateTable(`Record created between ${clickedEvent.minDate}-${clickedEvent.maxDate}`)

            } else {
                const clickedDate = event.target.dataItem.dataContext.date;
                const dateData = this.data.time[clickedDate];
                if (typeof dateData.ids !== "undefined" || dateData.ids.length === 0){
                    this.chronoMap.clickedItems = dateData.ids; // set the property clickedItems
                    const s = dateData.ids.length > 1 ? "s" : ""; // add an "s" if there is multiple records to display

                    // generate boxes
                    this.chronoMap.generateTable(`Record${s} created between ${clickedDate}-${parseInt(clickedDate)+10}`);
                }
            }
        });
    }

    hoverEvent(template){
        if (! this.config.multiTimeChart){
            // in order to change the cursor appearance when hovering time series
            template.events.on("over", (event) => {
                event.target.cursorOverStyle = am4core.MouseCursorStyle.pointer;
                const hoverDate = event.target.dataItem.dataContext.date;
                const dateData = this.data.time[new Date(hoverDate).getTime()];

                // if the is an item created at this date, change the cursor to be a pointer
                if (! this.isTimeRangeEmpty(dateData)){
                    event.target.cursorOverStyle = am4core.MouseCursorStyle.pointer;
                } else {
                    event.target.cursorOverStyle = am4core.MouseCursorStyle.default;
                }
            });
        } else {
            template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        }
    }
}

/*export {Timeline};*/
