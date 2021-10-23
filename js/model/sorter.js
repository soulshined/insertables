export default class InsertableSorter {

    static sortAlphabetically(a, b) {
        a = arguments[0].toLowerCase();
        b = arguments[1].toLowerCase();

        if (a < b) return - 1;
        if (a > b) return 1;
        return 0;
    }

    static sortByTitle(a, b) {
        a = a === undefined ? arguments['0'][1] : a;
        b = b === undefined ? arguments['1'][1] : a;

        a = a.title.toLowerCase();
        b = b.title.toLowerCase();

        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }
}