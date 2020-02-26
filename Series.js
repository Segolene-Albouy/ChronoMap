const colorScheme = {
    custom: [],
    primary: [
        "#509EAA",
        "#E0A93C",
        "#DB4646",
        "#aac63b",
        "#997ff7"
    ],
    oslo: [
        "#F77220",
        "#295566",
        "#0F8B8D",
        "#EC9A29",
        "#A8201A"
    ],
    granada: [
        "#871217",
        "#4381da",
        "#a83f1c",
        "#c18336",
        "#205238"
    ],
    galway: [
        "#54B237",
        "#6184D8",
        "#EDED38",
        "#2E5266",
        "#519163"
    ],
    kiev: [
        "#6BBAAA",
        "#352270",
        "#9D8DF1",
        "#C5D6F7",
        "#1CFEBA"
    ]
};

/**
 *
 * It defines how each series represented on the map will look like
 * In the array of the series property, each object will set an entity name,
 * a color and an angle in order to create map pins and heat map stripes accordingly
 */
class Series {
    /**
     *
     * @param {int} index
     * @param {string} name
     * @param color
     */
    constructor(index, name, color = null){
        /**
         * Name of series
         * @type {string}
         */
        this.name = name;

        /**
         * Series number ; used as prefix id to identify chart data items
         * @type {Number}
         */
        this.number = index;

        /**
         * Color of the series
         */
        this.color = color ? color : colorScheme.granada[index];

        /**
         * Angle of the pins representing the series on the map
         * Will be defined at the chronomap class level
         * @type {number}
         */
        this.angle = 90;

        /**
         * Reference to the time chart series corresponding to the particular series
         * @type {{}}
         */
        this.time = {};

        /**
         * Reference to the time chart series corresponding to the particular series
         * @type {{}}
         */
        this.map = {};
    }
}

/*export {Series};*/
