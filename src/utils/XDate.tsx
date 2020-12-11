
import { isString } from "underscore";

class XDate {
    
    static now(){
        return new Date();
    }
    
    static dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    static monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    static monthNumbers = {
        Jan:0,
        Feb:1,
        Mar:2,
        Apr:3,
        May:4,
        Jun:5,
        Jul:6,
        Aug:7,
        Sep:8,
        Oct:9,
        Nov:10,
        Dec:11
    };
    
    static getShortMonthName(month:number):string {
        return XDate.monthNames[month].substring(0, 3);
    }

    static getShortDayName(day:number):string {
        return XDate.dayNames[day].substring(0, 3);
    }
    
    static getDaysBetweenDates(date1: Date|string, date2: Date|string): number {

        date1 = isString(date1) ? new Date(date1) : date1;
        date2 = isString(date2) ? new Date(date2) : date2;

        let diffTime = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        return diffDays;
    }

    static isLeapYear(date:Date) {
        var year = date.getFullYear();
        return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
    }
    
    static getDaysInMonth(date:Date) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var m = date.getMonth();
        return m === 1 && XDate.isLeapYear(date) ? 29 : daysInMonth[m];        
    }    

    static getDayOfYear(date:Date) {
        var num = 0,
            d = XDate.clone(date),
            m = date.getMonth(),
            i;
        for (i = 0, d.setDate(1), d.setMonth(0); i < m; d.setMonth(++i)) {
            num += XDate.getDaysInMonth(d);
        }
        return num + date.getDate() - 1;
    }

    static clone(date:Date) {
        return new Date(date.getTime());
    }

    static getGMTOffset(date:Date, colon:boolean = true) {
        var offset = date.getTimezoneOffset();
        return (offset > 0 ? "-" : "+")
            + (Math.floor(Math.abs(offset) / 60)).toString().padStart(2, "0")
            + (colon ? ":" : "")
            + (Math.abs(offset % 60)).toString().padStart(2, "0");
    }

    static getTimezone(date:Date) {
        return date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
    }    
    
    static getSuffix(date:Date) {
        switch (date.getDate()) {
            case 1:
            case 21:
            case 31:
                return "st";
            case 2:
            case 22:
                return "nd";
            case 3:
            case 23:
                return "rd";
            default:
                return "th";
        }
    }
    static getWeekOfYear(date:Date) {
        var ms1d = 864e5, 
            ms7d = 7 * ms1d; 
        var DC3 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 3) / ms1d, 
            AWN = Math.floor(DC3 / 7), 
            Wyr = new Date(AWN * ms7d).getUTCFullYear();
        return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
    }
    

    static getFormatCode(inputDate:Date, char:string):string|number{
        switch(char){
            case "d": return inputDate.getDate().toString().padStart(2, '0');
            case "D": return XDate.getShortDayName(inputDate.getDay()); 
            case "l": return XDate.dayNames[inputDate.getDay()];
            case "N": return (inputDate.getDay() ? inputDate.getDay() : 7);
            case "S": return XDate.getSuffix(inputDate);
            case "w": return inputDate.getDay();
            case "z": return XDate.getDayOfYear(inputDate);
            case "W": return XDate.getWeekOfYear(inputDate).toString().padStart(2, '0');
            case "F": return XDate.monthNames[inputDate.getMonth()];
            case "m": return (inputDate.getMonth() + 1).toString().padStart(2, '0');
            case "M": return XDate.getShortMonthName(inputDate.getMonth()); 
            case "n": return (inputDate.getMonth() + 1);
            case "t": return XDate.getDaysInMonth(inputDate);
            case "L": return (XDate.isLeapYear(inputDate) ? 1 : 0);
            case "o": return (inputDate.getFullYear() + (XDate.getWeekOfYear(inputDate) == 1 && inputDate.getMonth() > 0 ? +1 : (XDate.getWeekOfYear(inputDate) >= 52 && inputDate.getMonth() < 11 ? -1 : 0)));
            case "Y": return inputDate.getFullYear().toString().padStart(4, '0');
            case "y": return ('' + inputDate.getFullYear()).substring(2, 4);
            case "a": return (inputDate.getHours() < 12 ? 'am' : 'pm');
            case "A": return (inputDate.getHours() < 12 ? 'AM' : 'PM');
            case "g": return ((inputDate.getHours() % 12) ? inputDate.getHours() % 12 : 12);
            case "G": return inputDate.getHours();
            case "h": return (inputDate.getHours() % 12 ? inputDate.getHours() % 12 : 12).toString().padStart(2, '0');
            case "H": return inputDate.getHours().toString().padStart(2, '0');
            case "i": return inputDate.getMinutes().toString().padStart( 2, '0');
            case "s": return inputDate.getSeconds().toString().padStart( 2, '0');
            case "u": return inputDate.getMilliseconds().toString().padStart( 3, '0');
            case "O": return XDate.getGMTOffset(inputDate);
            case "P": return XDate.getGMTOffset(inputDate, true);
            case "T": return XDate.getTimezone(inputDate);
            case "Z": return (inputDate.getTimezoneOffset() * -60);
            default: return char;
        }        
    }

    static format(inputDate: Date|string, format:string): string{

        inputDate = isString(inputDate) ? new Date(inputDate) : inputDate;

        var code = [],
            special = false,
            ch = '';
        for (var i = 0; i < format.length; ++i) {
            ch = format.charAt(i);
            if (!special && ch === "\\") {
                special = true;
            } else if (special) {
                special = false;
                code.push(ch);
            } else {
                code.push(XDate.getFormatCode(inputDate, ch));
            }
        }
        return code.join('');
    }


};

export default XDate;