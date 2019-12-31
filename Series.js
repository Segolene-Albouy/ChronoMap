const colorScheme = {
    custom: [],
    primary: [
        "#509EAA",
        "#E0A93C",
        "#DB4646",
        "#B4C63F",
        "#9580f7"
    ],
    oslo: [
        "#F77220",
        "#214654",
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
        "#231942",
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
        if (!color)
            color = colorScheme.primary[index];

        this.name = name;
        this.color = color;
        this.angle = 0; // series angle will be defined at the chronoMap class level
        this.prefix = index;
    }
}

/*export {Series};*/
