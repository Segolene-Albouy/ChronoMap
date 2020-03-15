const plural = {
    '(quiz)$'               : "$1zes",
    '^(ox)$'                : "$1en",
    '([m|l])ouse$'          : "$1ice",
    '(matr|vert|ind)ix|ex$' : "$1ices",
    '(x|ch|ss|sh)$'         : "$1es",
    '([^aeiouy]|qu)y$'      : "$1ies",
    '(hive)$'               : "$1s",
    '(?:([^f])fe|([lr])f)$' : "$1$2ves",
    '(shea|lea|loa|thie)f$' : "$1ves",
    'sis$'                  : "ses",
    '([ti])um$'             : "$1a",
    '(tomat|potat|ech|her|vet)o$': "$1oes",
    '(bu)s$'                : "$1ses",
    '(alias)$'              : "$1es",
    '(octop)us$'            : "$1i",
    '(ax|test)is$'          : "$1es",
    '(us)$'                 : "$1es",
    '([^s]+)$'              : "$1s"
};

const singular = {
    '(quiz)zes$'             : "$1",
    '(matr)ices$'            : "$1ix",
    '(vert|ind)ices$'        : "$1ex",
    '^(ox)en$'               : "$1",
    '(alias)es$'             : "$1",
    '(octop|vir)i$'          : "$1us",
    '(cris|ax|test)es$'      : "$1is",
    '(shoe)s$'               : "$1",
    '(o)es$'                 : "$1",
    '(bus)es$'               : "$1",
    '([m|l])ice$'            : "$1ouse",
    '(x|ch|ss|sh)es$'        : "$1",
    '(m)ovies$'              : "$1ovie",
    '(s)eries$'              : "$1eries",
    '([^aeiouy]|qu)ies$'     : "$1y",
    '([lr])ves$'             : "$1f",
    '(tive)s$'               : "$1",
    '(hive)s$'               : "$1",
    '(li|wi|kni)ves$'        : "$1fe",
    '(shea|loa|lea|thie)ves$': "$1f",
    '(^analy)ses$'           : "$1sis",
    '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
    '([ti])a$'               : "$1um",
    '(n)ews$'                : "$1ews",
    '(h|bl)ouses$'           : "$1ouse",
    '(corpse)s$'             : "$1",
    '(us)es$'                : "$1",
    's$'                     : ""
};

const irregular = {
    'move'   : 'moves',
    'foot'   : 'feet',
    'goose'  : 'geese',
    'sex'    : 'sexes',
    'child'  : 'children',
    'man'    : 'men',
    'tooth'  : 'teeth',
    'person' : 'people'
};

const uncountable = [
    'sheep',
    'fish',
    'deer',
    'moose',
    'series',
    'species',
    'money',
    'rice',
    'information',
    'equipment'
];

String.prototype.pluralize = function (){
    // save some time in the case that singular and plural are the same
    if (uncountable.indexOf(this.toLowerCase()) >= 0)
        return this;

    // check for irregular forms
    for (let i = Object.keys(irregular).length - 1; i >= 0; i--) {
        const word = Object.keys(irregular)[i];
        const pattern = new RegExp(word+'$', 'i');

        if (pattern.test(this))
            return this.replace(pattern, irregular[word]);
    }

    // check for matches using regular expressions
    for (let i = Object.keys(plural).length - 1; i >= 0; i--) {
        const reg = Object.keys(plural)[i];
        const pattern = new RegExp(reg, 'i');

        if (pattern.test(this))
            return this.replace(pattern, plural[reg]);
    }
    return this;
};

String.prototype.singularize = function (){
    // save some time in the case that singular and plural are the same
    if (uncountable.indexOf(this.toLowerCase()) >= 0)
        return this;

    // check for irregular forms
    for (let i = Object.keys(irregular).length - 1; i >= 0; i--) {
        const word = Object.keys(irregular)[i];
        const pattern = new RegExp(irregular[word]+'$', 'i');

        if (pattern.test(this))
            return this.replace(pattern, word);
    }

    // check for matches using regular expressions
    for (let i = Object.keys(plural).length - 1; i >= 0; i--) {
        const reg = Object.keys(plural)[i];
        const pattern = new RegExp(reg, 'i');

        if (pattern.test(this))
            return this.replace(pattern, singular[reg]);
    }
    return this;
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.truncate = function (length) {
    return this.length > length ? this.substring(0, length - 1) + '…' : this;
};
String.prototype.occurrences = (subString, allowOverlapping= false) => {
    subString += "";
    if (subString.length <= 0) return (this.length + 1);

    let n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = this.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
};

String.prototype.trimHTML = function () {
    if ((this === null) || (this === '') || (typeof this === "undefined"))
        return false;
    else
        return this.toString().replace(/<[^>]*>/g, '');
};

/**
 * Truncate string that might contain HTML tag (remove HTML and put it back)
 *
 * @param string {string}
 * @param max {int}
 * @param extra {string}
 * @return {string|*}
 */
function truncateWithHtml(string, max, extra = '…'){
    const trimmedString = string.trimHTML();

    if (trimmedString.length <= max){
        return string;
    }

    // if the string does not contains tags
    if (trimmedString.length === string.length){
        return `<span title="${string}">${string.substring(0, max).trim()}${extra}</span>`;
    }

    const substrings =  string.split(/(<[^>]*>)/g);

    let count = 0;
    let truncated = [];
    for (let i = 0; i < substrings.length; i++) {
        let substr = substrings[i];
        if (! substr.startsWith("<")){
            if (count > max){
                continue;
            } else if (substr.length > (max-count-1)){
                truncated.push(substr.substring(0, (max-count) - 1) + '…');
            } else {
                truncated.push(substr);
            }
            count += substr.length;
        } else {
            truncated.push(substr);
        }
    }

    return `<span title="${trimmedString}">${truncated.join("")}${extra}</span>`;
}


/**
 * Check if a variable is an array (is written between [])
 * @param a
 * @returns {boolean}
 */
const isArray = function (a) {
    return Array.isArray(a);
};

/**
 * Check if a variable is an object (is written between {})
 * @param o
 * @return {boolean}
 */
const isObject = function (o) {
    return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

/**
 * to check if variable is an array or an object
 * @param variable
 * @returns {boolean}
 */
const isIterable = (variable) => {
    return isArray(variable) || isObject(variable);
};

/**
 * This function returns an array of objects ordered by the value (alphabetically and numerically)
 * of the node in each object associated with the key given as parameter
 *
 * Ex : array = [{color: 'white'},{color: 'red'},{color: 'black'}]
 * sortArrayOfObjectsByKey(array, "color") => [{ color: 'black'},{color: 'red'},{color: 'white'}]
 *
 * @param array
 * @param key
 * @return {*}
 */
const sortArrayOfObjectsByKey = (array, key) => {
    array.sort((a, b) => (a[key] > b[key]) ? 1 : -1);
    return array;
};

const isDefined = (variable) => {
    return typeof variable !== "undefined" || variable !== null;
};

/**
 * This function sorts an array according to an object that keys are elements of the array.
 *
 * EXAMPLES :
 * var array = ["id1", "id2", "id3"];
 * var object = {"id1": {"val1": 2, "val2":4}, "id2": {"val1": 1, "val2":3}, "id3": {"val1": 7, "val2":5}};
 *
 * sortArrayAccordingToOtherObject(array, object, "val1") => [id2, id1, id3]..
 *
 * var array = ["id1", "id2", "id3"];
 * var object = {"id1": 66, "id2": 23, "id3": 47};
 *
 * sortArrayAccordingToOtherObject(array, object) => [id2, id3, id1]
 *
 * @param array
 * @param object
 * @param key
 * @return {*}
 */
const sortArrayByObjectProperty = (array, object, key=null) => {
    if (key){
        array.sort((a, b) => (parseInt(object[a][key]) > parseInt(object[b][key])) ? 1 : -1);
    } else {
        array.sort((a, b) => (parseInt(object[a][key]) > parseInt(object[b][key])) ? 1 : -1);
    }
    return array;
};

/**
 * This function returns an array containing all the elements of the first array
 * that are not contained in the second array
 * @param array1
 * @param array2
 * @return {*}
 */
const arrayDiff = (array1, array2) => {
    return array1.filter(function(i) {return array2.indexOf(i) < 0;});
};

/**
 * This function takes an array of object and a key name as parameter
 * and returns an array of all the values corresponding to the key in each object of the array
 *
 * Ex : array = [{color: 'white'},{color: 'red'},{ color: 'black'}]
 * getArrayOfKeyValue(array, "color") => ['black','red','white']
 *
 * @param array
 * @param key
 * @return {*}
 */
const getArrayOfKeyValue = (array, key) => {
    return array.map(a => a[key]);
};

/**
 * Get the index of the nth occurrence of a substring in a string
 *
 * @param str : string in which the substring is to be searched
 * @param substr : string to search
 * @param n : int, occurrence number of the substring (2 for example for the second time the substring appears in the string)
 * @return {*}
 */
const indexOfNth = (str, substr, n) => {
    var L = str.length, i = -1;
    while(n-- && i++ < L){
        i = str.indexOf(substr, i);
        if (i < 0) break;
    }
    return i;
};

/**
 * This function allows to format correctly two dates in order to display it
 * @param minDate
 * @param maxDate
 * @return {string}
 */
const getDates = (minDate, maxDate) => {
    let date;
    if (isDefined(minDate) || isDefined(maxDate)){
        minDate = isDefined(minDate) ? minDate : "?";
        maxDate = isDefined(maxDate) ? maxDate : "?";

        if ((minDate === maxDate) && (minDate !== "?")) {
            date = `${minDate}`;
        } else {
            date = `${minDate}–${maxDate}`;
        }
    } else {
        date = "?–?";
    }

    return date;
};

/**
 * capitalize first letter of a string
 * @param str
 * @return {string}
 */
const ucFirst = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Callback Test that can be given as parameter of the filter methods in order to returns an array of unique values
 * This test is perform on each value of an array and will returns false if the index of the current value isn't equal
 * to the index of the first time the value is in the array
 *
 * Value correspond to the current value
 * Index correspond to the index of the current value
 * Self correspond to the array being filtered
 *
 * IndexOf returns the first index of the given value
 *
 * @param value
 * @param index
 * @param self
 * @return {boolean}
 */
const unique = (value, index, self) => {
    return self.indexOf(value) === index;
};

/**
 * This function returns the middle value given an array of numerical values
 * @param arrayOfValues
 * @return {number}
 */
const getMiddleValue = (arrayOfValues) => {
    return Math.min(...arrayOfValues) + ((Math.max(...arrayOfValues) - Math.min(...arrayOfValues))/2);
};

/*export {getMinValueInArray, getMaxValueInArray, isDefined, sortArrayOfObjectsByKey, sortArrayByObjectProperty, getArrayOfKeyValue, getDates, ucFirst, unique, getMiddleValue}*/
