/*import * as am4core from "./@amcharts/amcharts4/core.js";
import * as am4charts from "./@amcharts/amcharts4/charts.js";
import * as am4maps from "./@amcharts/amcharts4/maps.js";
import * as am4geodata_worldLow from "./@amcharts/geodata/worldLow.js";
import * as am4plugins_bullets from "./@amcharts/amcharts4/plugins/bullets.js";
import {AbstractChart} from "./ChronoMap.js";
import {ucFirst, getDates} from "./utils.js";*/

class Map extends AbstractChart {

    constructor(chronoMap){
        super(chronoMap);
        this.amMap = this.chronoMap.container.createChild(am4maps.MapChart);
        this.mapPins = {};
        this.unknownPlaceLabel = {};

        this.generate();
    }

    generate(){
        this._generateConfig();
        this._generateAllSeries();
    }

    /**
     * This method configures the background map
     */
    _generateConfig(){
        this.amMap.y = -70;
        this.amMap.toBack();

        // Set projection and quality definition of the map
        this.amMap.geodata = am4geodata_worldLow;
        this.amMap.projection = new am4maps.projections.Miller();
        this.amMap.deltaLongitude = -10; // move the map a little to the left

        // Create map polygon series containing delineation of the countries
        let polygonSeries = this.amMap.series.push(new am4maps.MapPolygonSeries());
        // Exclude Antarctica
        polygonSeries.exclude = ["AQ"];
        // Load data (like country names and polygon shapes) from GeoJSON
        polygonSeries.useGeodata = true;
        polygonSeries.hiddenInLegend = true;

        // Configure appearance of the background map
        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.fill = am4core.color("#d7d7d7"); // color of the countries
        polygonTemplate.stroke = am4core.color("#d7d7d7");

        if (this.chronoMap.config.showCountries === true){
            // Create hover state and set alternative fill color
            polygonTemplate.states.create("hover").properties.fill = am4core.color("#b9b9b9");
            polygonTemplate.tooltipText = "{name}"; // showing country names on hover
        }

        // Pre-zoom to Eurasia
        this.amMap.homeZoomLevel = this.config.homeZoomLevel;
        this.amMap.homeGeoPoint = this.config.homeGeoPoint;

        // Zoom control
        this.amMap.zoomControl = new am4maps.ZoomControl();
        this.amMap.zoomControl.dy = -120; // move the zoom control up

        this.amMap.legend = new am4charts.Legend();
        this.amMap.legend.position = "right";
        this.amMap.legend.dx = 10;

        // Create a label to indicate that the 0-0 coordinates is an Unknown place
        this.unknownPlaceLabel = this.createLabelOnMap("Unknown\nplace", 0, 0);
    }

    /**
     * This method generates as many series as there are series in the config object
     * @private
     */
    _generateAllSeries(){
        for (let i = Object.keys(this.chronoMap.series).length -1; i >= 0; i--) {
            // generates as many series as there are series in the config object
            // and add to the mapPins property all the map pins created when creating the series
            this.mapPins[Object.keys(this.chronoMap.series)[i]] = this._generateSeries(Object.values(this.chronoMap.series)[i]);
        }

    }

    /**
     * Creates map points on the chart for a series
     * A series is symbolised with an unique color. It corresponds to a series in the dataset
     *
     * @param config : object defining the configuration for one series in particular
     * @return {Array}
     * @private
     */
    _generateSeries(config){
        let mapSeries = this.amMap.series.push(new am4maps.MapImageSeries());
        mapSeries.fill = am4core.color(config.color);
        mapSeries.name = ucFirst(config.name); // defining a name for the legend

        let seriesPins = {};

        for (let i = Object.keys(this.data.map).length - 1; i >= 0; i--) {
            let latlong = Object.keys(this.data.map)[i];
            let place = this.data.map[latlong];
            let seriesName = config.name; // series name in camelCase
            let seriesTitle = ucFirst(config.name); // series name in "Normal case"
            // if there is item of the current series in the current place
            if (place.ids[seriesName].length !== 0) {
                // create a map point for each place in the dataset
                let placePoint = mapSeries.mapImages.create();
                placePoint.latitude = parseFloat(place.lat);
                placePoint.longitude = parseFloat(place.long);
                placePoint.nonScaling = true; // the marker stays at the same size when zooming

                // define marker appearance
                seriesPins[latlong] = placePoint.createChild(am4plugins_bullets.PinBullet); // creating a marker for each place
                seriesPins[latlong].circle.radius = am4core.percent(100); // defining the color of the circle to be the same size as the radius

                seriesPins[latlong].circle.fill = am4core.color(config.color); // set the color of the circle
                seriesPins[latlong].background.fill = am4core.color("#919191"); // set the color of the pointy end
                seriesPins[latlong].background.pointerBaseWidth = 3; // set the width of the pointy end
                seriesPins[latlong].background.pointerLength = 14; // set the length of the pointy end
                seriesPins[latlong].background.pointerAngle = config.angle; // set the angle of the pin

                // add to the map point a property that defines which item and place it represents
                seriesPins[latlong].properties.dummyData = {ids: place.ids[seriesName], placeName: place.place};
                // the set radius and tooltip accordingly
                this.definePinAppearance(seriesPins[latlong], seriesTitle);
                seriesPins[latlong].circle.cursorOverStyle = am4core.MouseCursorStyle.pointer; // make the cursor a point when hovering the circle

                // show boxes on click on a map pin
                seriesPins[latlong].circle.events.on("hit", function (event) {
                    let idsToDisplay = event.target._parent.properties.dummyData.ids;
                    this.chronoMap.idsClicked = idsToDisplay; // set the property idsClicked

                    // add an "s" if there is multiple records to display
                    let s = idsToDisplay.length > 1 ? "s" : "";
                    // define a title
                    let boxesTitle = `${seriesTitle}${s} created in ${event.target._parent.properties.dummyData.placeName}`;
                    // generate boxes
                    this.chronoMap.generateBoxes(idsToDisplay, boxesTitle, this.chronoMap.datasets.box);
                }.bind(this), false); // bind allow to use this referring to the instance instead to the DOM
            }
        }
        return seriesPins;
    }

    /**
     * Creates a label next to a map point
     *
     * @param text string : text of the label
     * @param lat number : latitude of the point
     * @param long number : longitude of the point
     */
    createLabelOnMap(text, lat, long) {
        let mapSeries = this.amMap.series.push(new am4maps.MapImageSeries());
        mapSeries.hiddenInLegend = true;

        let place = mapSeries.mapImages.create();
        place.latitude = lat;
        place.longitude = long;

        let placeText = place.createChild(am4core.Label);
        placeText.text = text;
        placeText.fontSize = 13;
        placeText.fill = am4core.color("black");
        placeText.verticalCenter = "middle";
        placeText.paddingLeft = 14;
        placeText.nonScaling = true;

        return placeText;
    }

    /**
     * This method defines the radius and the tooltip of a pin
     * according the ids stored in its dummyData property
     * @param pin
     * @param seriesName
     */
    definePinAppearance(pin, seriesName){
        let ids = pin.properties.dummyData.ids;

        // if there is records associated with the place
        if (ids.length !== 0){
            // set the radius of the pin to to have a radius proportional to the number of records
            pin.background.radius = Math.log(ids.length * 100);

            // defining tooltip appearing when hovering a map point
            let more = ids.length >= 2 ? "\n‣  [bold]. . .[/]" : "";
            let s = ids.length >= 2 ? "s" : "";
            let title = "";
            if (typeof this.data.main[ids[0]] !== "undefined"){
                let recordData = this.data.main[ids[0]];
                // defining title of one record of the records associated with the map pin
                title = `\n‣ ${recordData.title} ${getDates(recordData.minDate, recordData.maxDate)}`;
            }

            let tooltip = `[bold; font-size:18px]${ids.length} ${seriesName}${s}[/]${title}${more}
                            Click to see more`;
            let placeName = pin.properties.dummyData.placeName;

            pin.tooltipText = `[font-size:18px]${placeName}[/]
                                               ${tooltip}`;

            // if the pin is place on 0,0 (i.e. the "Unknown place" location) is visible
            if (placeName === "Unknown place"){
                this.unknownPlaceLabel.fillOpacity = 0.4;
            }
        } else {
            // if there is no data to show, make the pin disappear
            pin.tooltipText = "";
            pin.background.radius = 0;
        }
    }
}

/*export {Map};*/
