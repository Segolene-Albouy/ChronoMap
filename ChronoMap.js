/* Build chronological map to visualize time and space using the charting library AmCharts V4 */
/*import * as am4core from "./@amcharts/amcharts4/core.js";
import {Config} from "./Config.js";
import {Series} from "./Series.js";
import {Map} from "./Map.js";
import {Timeline} from "./Timeline.js";
import {Scrollbar} from "./Scrollbar.js";*/


// Possibilité de définir la granularité de la frise chronologique : tous les ans ou tous les dix ans
// Possibilité de mettre des années ou des dates plus précises : voir parser des dates
// possibilité de mettre différent types de graphes en dessous : heatmap, diagramme linéaire, ou points
// mettre machin pour choisir la couleur en fonction de l'entité
// pour un voyage : un truc plus stacked bar
// possibilité de mettre ou non des box en dessous :
// genre mettre une condition : si y a un id dans le dataset donné
// bah on ajouter mets true l'attribue clickable => affichage de box

const angle = [
    [90], // only one series displayed on the map
    [70, 110],
    [50, 90, 130],
    [30, 70, 110, 150],
    [10, 50, 90, 130, 170]
];

class ChronoMap {
    constructor(dataset = null, series = null, config = null) {
        if (config)
            this.config = config;
        else
            this.config = new Config();

        if (series) {
            this.series = series;
        } else {
            if (dataset)
                this.series = this.generateSeries(dataset);
            else
                this.series = [];
        }

        this.data = {};
        if (dataset)
            this.addDataset(dataset);
        else
            this.data = { main: {}, time: [], map: [] };

        this.container = this.generateContainer();
        this.map = new Map(this);
        this.timeline = new Timeline(this);
        //this.scrollbar = new Scrollbar(this);
    }

    generateContainer() {
        let container = am4core.create(this.config.elementId, am4core.Container);
        container.width = am4core.percent(100); // make it the same size as the div element
        container.height = am4core.percent(100);
        container.exporting.menu = new am4core.ExportMenu(); // add an exporting menu

        return container;
    }

    /**
     *
     * @param {array} dataset : array of objects structured like this
     * dataset = [
     *   {
     *      series:
     *   }
     * ];
     */
    addDataset(dataset) {
        this.data.main = this.generateMainDataset(dataset);
        this.data.time = this.generateTimeDataset();
        this.data.map = this.generateMapDataset();

        /*this.data = {
            main: this.generateMainDataset(dataset),
            time: this.generateTimeDataset(),
            map: this.generateMapDataset()
        };*/
        this.updateChronoMap();
        // add method to update chronomap according to the dataset
    }

    addData(data) {
        if (Object.keys(this.data).length !== 0){
            this.data = {
                main: this.addMainData(data),
                time: this.addTimeData(data),
                map: this.addMapData(data)
            };
        } else {
            this.data = this.addDataset([data]);
        }
        this.updateChronoMap();
    }

    addSeries(name, color = null) {
        const seriesNumber = Object.keys(this.series).length;

        if (seriesNumber === 5){
            windows.alert("Only five series can be displayed at the same time on the chronological map.");
        } else {
            this.series[name] = new Series(seriesNumber, name, color);

            for (let i = 0; i < seriesNumber.length; i++) {
                Object.values(this.series)[i].angle = angle[seriesNumber][i];
            }
        }
    }

    generateSeries(dataset) {
        let series = {};

        for (let i = dataset.length - 1; i >= 0; i--) {
            if (typeof series[dataset[i].series] === "undefined")
                series[dataset[i].series] = new Series(i, dataset[i].series);
        }

        const seriesNumber = Object.keys(series).length;

        for (let i = seriesNumber - 1; i >= 0; i--) {
            Object.values(series)[i].angle = angle[seriesNumber-1][i];
        }

        return series;
    }

    addMainData(data) {

    }

    generateMainDataset(dataset) {
        let mainDataset = {};

        dataset.map(data => mainDataset[`${this.series[data.series].prefix}${data.id}`] = data);

        return mainDataset;
    }

    addTimeData(data) {
        /*public function getTimeData(\TAMAS\AstroBundle\Entity\OriginalText $item, $timeData, $entities){
        $year = $item->getTpq() ? substr($item->getTpq(),0,-1)."0" : 0;
        $taq = $item->getTaq() ? substr($item->getTaq(),0,-1)."0" : 0;

        $oiId = "oi".$item->getId();

        $dataTemplate = ["year" => 0, "i" => "i", "ids" => []];
        foreach ($entities as $entity){
            $dataTemplate[$entity] = 0;
        }

        for ($date = $year; $date <= $taq; $date += 10) {
            if (! isset($timeData[$date])) {
                $timeData[$date]  = $dataTemplate;
                $timeData[$date]["year"] = $date;
            }

            if (! in_array($oiId, $timeData[$date]["ids"])){
                $timeData[$date]["ids"][] = $oiId;
                $timeData[$date]["originalText"] += 1;
            }
        }

        return $timeData;
    }*/
    };

    generateTimeDataset() {
        const data = Object.values(this.data.main);
        let timeData = {};

        let template = {
            date: 0,
            ids: [],
            i: "i"
        };

        Object.keys(this.series).map(e => {template[e] = 0});

        for (let i = data.length - 1; i >= 0; i--) {
            let date = data[i].minDate !== null ? data[i].minDate : 0;
            let maxDate = data[i].maxDate !== null ? data[i].maxDate : 0;

            for (date; date <= maxDate; date += 1) {
                if (typeof timeData[parseInt(date)] === 'undefined'){
                    timeData[parseInt(date)] = {...template};/*JSON.parse(JSON.stringify(template));*///{...template};//Object.assign({}, object)
                    timeData[parseInt(date)].date = date;
                    timeData[parseInt(date)].ids = [];
                }
                timeData[parseInt(date)][data[i].series] += 1;
                timeData[parseInt(date)].ids.push(`${this.series[data[i].series].prefix}${data[i].id}`);
            }
        }

        const dates = Object.keys(timeData).map(x => parseInt(x));

        // in order to show year where nothing happened
        let minDate = Math.min(... dates)-this.config.timespan, maxDate = Math.max(... dates)+this.config.timespan;

        for (minDate; minDate <= maxDate; minDate++) {
            if (typeof timeData[minDate] === 'undefined'){
                timeData[minDate] = JSON.parse(JSON.stringify(template));
                timeData[minDate].date = minDate;
                timeData[minDate].ids = [];
            }
        }

        return Object.values(timeData).sort((a, b) => (a["date"] > b["date"]) ? 1 : -1);
    };

    addMapData = (data) => {
        /*$oiId = "oi".$item->getId();

        if ($item->getPlace()){
            $lat = $item->getPlace()->getLat() ? $item->getPlace()->getLat() : 0;
            $long = $item->getPlace()->getLong() ? $item->getPlace()->getLong() : 0;

            if (! isset($mapData["$lat,$long"])){
                $mapData["$lat,$long"] = [
                    "lat" => $lat,
                    "long" => $long,
                    "place" => $item->getPlace()->getPlaceName(),
                    "ids" => $entities
                ];
            }
            if (! in_array($oiId, $mapData["$lat,$long"]["ids"]["originalText"])){
                $mapData["$lat,$long"]["ids"]["originalText"][] = $oiId;
            }

        } else {
            if (!isset($mapData["0"])){
                $mapData["0"] = [
                    "lat" => 0,
                    "long" => 0,
                    "place" => "<span class='noInfo'>Unknown place</span>",
                    "ids" => $entities
                ];
            }

            if (! in_array($oiId, $mapData["0"]["ids"]["originalText"])){
                $mapData["0"]["ids"]["originalText"][] = $oiId;
            }
        }

        return $mapData;*/
    };

    /**
     *
     */
    generateMapDataset() {
        const data = Object.values(this.data.main);

        let mapData = {};

        let ids = {};
        Object.keys(this.series).map(e => {ids[e] = []});

        for (let i = data.length - 1; i >= 0; i--) {
            const latlong = `${data[i].lat},${data[i].long}`;

            if (typeof mapData[latlong] === "undefined"){
                mapData[latlong] = {
                    "lat": data[i].lat,
                    "long": data[i].long,
                    "place": data[i].placeName,
                    "ids": JSON.parse(JSON.stringify(ids)) // {...ids}
                };
            }
            mapData[latlong].ids[data[i].series].push(`${this.series[data[i].series].prefix}${data[i].id}`);
        }

        return mapData/*Object.values(mapData)*/;
    }

    updateChronoMap() {

    }
}

/**
 * This class is the parent class of all type of charts
 */
class AbstractChart {
    /**
     * @param {ChronoMap} chronoMap
     */
    constructor(chronoMap){
        this.chronoMap = chronoMap;
        this.data = chronoMap.data;
        this.config = this.chronoMap.config;
    }

    generate(){}
    _generateSeries(){}
    _generateAllSeries(){}
    _generateConfig(){}
}

/*export {ChronoMap, AbstractChart};*/
