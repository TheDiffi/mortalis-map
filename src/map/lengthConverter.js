export class LengthConverter {
    meters = 0;

    /**
     *  Length unit converter
     * @param {number} x 
     * @param {string} unit 
     */
    constructor(x, unit){
        if (unit === "meters") {
            this.meters = x;
        } else if (unit === "kilometers") {
            this.meters = x * 1000;
        } else if (unit === "miles") {
            this.meters = x * 1609.34;
        } else if (unit === "feet") {
            this.meters = x * 0.3048;
        }
    }

    toMeters(toFixed) {
        return toFixed ? this.meters.toFixed(toFixed) : this.meters;
    }

    toKilometers(toFixed) {
        const meters = this.meters / 1000;
        return toFixed ? meters.toFixed(toFixed) : meters;
    }

    toMiles(toFixed) {
        const meters = this.meters / 1609.34;
        return toFixed ? meters.toFixed(toFixed) : meters;
    }

    toFeet(toFixed) {
        const meters = this.meters / 0.3048;
        return toFixed ? meters.toFixed(toFixed) : meters;
    }

}