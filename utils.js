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
 * Get minimal value in an array
 * @param a
 * @return {number}
 */
const getMinValueInArray = (a) => {
    return Math.min.apply(null, a);
};

/**
 * Get maximal value in an array
 * @param a
 * @return {number}
 */
const getMaxValueInArray = (a) => {
    return Math.max.apply(null, a);
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
