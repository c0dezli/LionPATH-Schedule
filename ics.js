/* global saveAs, Blob, BlobBuilder, console */
/* exported ics */

var ics = function() {
    'use strict';

    if (navigator.userAgent.indexOf('MSIE') > -1 && navigator.userAgent.indexOf('MSIE 10') == -1) {
        console.log('Unsupported Browser');
        return;
    }

    var SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
    var calendarEvents = [];
    var calendarStart = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0'
    ].join(SEPARATOR);
    var calendarEnd = SEPARATOR + 'END:VCALENDAR';

    return {
        /**
         * Returns events array
         * @return {array} Events
         */
        'events': function() {
            return calendarEvents;
        },

        /**
         * Returns calendar
         * @return {string} Calendar in iCalendar format
         */
        'calendar': function() {
            return calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
        },

        /**
         * Add event to the calendar
         * @param  {string} subject     Subject/Title of event
         * @param  {string} description Description of event
         * @param  {string} location    Location of event
         * @param  {string} begin       Beginning date of event
         * @param  {string} stop        Ending date of event
         */
        'addEvent': function(subject, description, location, begin, stop, repeat, rule, endrepeat) {
            // I'm not in the mood to make these optional... So they are all required
            if (typeof subject === 'undefined' ||
                typeof description === 'undefined' ||
                typeof location === 'undefined' ||
                typeof begin === 'undefined' ||
                typeof stop === 'undefined'  ||
                typeof repeat === 'undefined' ||
                typeof rule === 'undefined') {
                return false;
            };

            //TODO add time and time zone? use moment to format?
            var start_date = new Date(begin),
                end_date = new Date(stop),
                end_repeat = new Date(endrepeat);

            var start_year = ("0000" + (start_date.getFullYear().toString())).slice(-4),
                start_month = ("00" + ((start_date.getMonth() + 1).toString())).slice(-2),
                start_day = ("00" + ((start_date.getDate()).toString())).slice(-2),
                start_hours = ("00" + (start_date.getHours().toString())).slice(-2),
                start_minutes = ("00" + (start_date.getMinutes().toString())).slice(-2),
                start_seconds = ("00" + (start_date.getMinutes().toString())).slice(-2);

            var end_year = ("0000" + (end_date.getFullYear().toString())).slice(-4),
                end_month = ("00" + ((end_date.getMonth() + 1).toString())).slice(-2),
                end_day = ("00" + ((end_date.getDate()).toString())).slice(-2),
                end_hours = ("00" + (end_date.getHours().toString())).slice(-2),
                end_minutes = ("00" + (end_date.getMinutes().toString())).slice(-2),
                end_seconds = ("00" + (end_date.getMinutes().toString())).slice(-2);

            var endrepeat_year = ("0000" + (end_repeat.getFullYear().toString())).slice(-4),
                endrepeat_month = ("00" + ((end_repeat.getMonth() + 1).toString())).slice(-2),
                endrepeat_day = ("00" + ((end_repeat.getDate()).toString())).slice(-2);

            // Since some calendars don't add 0 second events, we need to remove time if there is none...
            var start_time = '';
            var end_time = '';
            if (start_minutes + start_seconds + end_minutes + end_seconds != 0) {
                start_time = 'T' + start_hours + start_minutes + start_seconds;
                end_time = 'T' + end_hours + end_minutes + end_seconds;
            }

            var start = start_year + start_month + start_day + start_time;
            var end = end_year + end_month + end_day + end_time;
            var end_repeat = endrepeat_year + endrepeat_month + endrepeat_day + "T230000Z";

            var rrule = '';
            if (rule.indexOf('Mo') !== -1)
              rrule += 'MO,';
            if (rule.indexOf('Tu') !== -1)
              rrule += 'TU,';
            if (rule.indexOf('We') !== -1)
              rrule += 'WE,';
            if (rule.indexOf('Th') !== -1)
              rrule += 'TH,';
            if (rule.indexOf('Fr') !== -1)
              rrule += 'FR,';

            //remove the last ','
            rrule = rrule.slice(0, rrule.length-1);

            var calendarEvent = [
                'BEGIN:VEVENT',
                'CLASS:PUBLIC',
                'DESCRIPTION:' + description,
                'DTSTART;TZID=America/New_York:' + start,
                'DTEND;TZID=America/New_York:' + end,
                'LOCATION:' + location,
                'SUMMARY;LANGUAGE=en-us:' + subject,
                'RRULE:FREQ=WEEKLY;UNTIL=' + end_repeat + ';BYDAY=' + rrule,
                'TRANSP:OPAQUE',
                'END:VEVENT'
            ].join(SEPARATOR);

            calendarEvents.push(calendarEvent);
            return calendarEvent;
        },

        /**
         * Download calendar using the saveAs function from filesave.js
         * @param  {string} filename Filename
         * @param  {string} ext      Extention
         */
        'download': function(filename, ext) {
            if (calendarEvents.length < 1) {
                return false;
            }

            ext = (typeof ext !== 'undefined') ? ext : '.ics';
            filename = (typeof filename !== 'undefined') ? filename : 'calendar';
            var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
            var blob;
            if (navigator.userAgent.indexOf('MSIE 10') === -1) { // chrome or firefox
                blob = new Blob([calendar]);
            } else { // ie
                var bb = new BlobBuilder();
                bb.append(calendar);
                blob = bb.getBlob('text/x-vCalendar;charset=' + document.characterSet);
            }
            saveAs(blob, filename + ext);
            return calendar;
        }
    };
};
