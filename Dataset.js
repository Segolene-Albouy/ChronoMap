/*

class Dataset {
    constructor(dataset){
        this.series = [];

        /!**
         * Object
         *!/
        this.main = dataset;
        this.time = this.generateTimeDataset();
        this.map = this.generateMapDataset();

    }

    addData(data){
        this.main[`${data.entity}${data.id}`] = data;
        this.time = this.addTimeData(data);
        this.map = this.addMapData(data);
    }

    addTimeData(data) {
        /!*public function getTimeData(\TAMAS\AstroBundle\Entity\OriginalText $item, $timeData, $entities){
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
    }*!/
    };

    generateTimeDataset() {
        const data = this.data.main;
        let timeData = {};

        let template = {
            "date": 0,
            "i": "i"
        };

        Object.keys(this.config.series).map(e => {template[e] = 0});

        for (let i = data.length - 1; i >= 0; i--) {
            let date = typeof data[i].minDate !== "undefined" ? data[i].minDate : 0;
            let maxDate = typeof data[i].maxDate !== "undefined" ? data[i].maxDate : 0;

            for (date; date <= maxDate; date += 1) {
                if (typeof data[date] === 'undefined'){
                    timeData[parseInt(date)] = JSON.parse(JSON.stringify(template));
                    timeData[parseInt(date)]["date"] = date;
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
                timeData[minDate]["date"] = minDate;
            }
        }

        return Object.values(timeData).sort((a, b) => (a["date"] > b["date"]) ? 1 : -1);
    };

    addMapData = (data) => {
        /!*$oiId = "oi".$item->getId();

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

        return $mapData;*!/
    };

    /!**
     *
     *!/
    generateMapDataset = () => {
        const data = this.data.main;

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
                    "ids": JSON.parse(JSON.stringify(ids))
                };
            }
            mapData[latlong].ids[data[i].series].push(`${this.series[data[i].series].prefix}${data[i].id}`);
        }

        return Object.values(mapData);
    }
}*/
