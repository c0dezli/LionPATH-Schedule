function TableExtract() {
    var table_base = "win0divDERIVED_REGFRM1_DESCR20$",
        status_base = "STATUS$",
        section_base = "MTG_SECTION$",
        comp_base = "MTG_COMP$",
        detail_base = "CLASS_MTG_VW$scroll$",
        list = [],
        count = 0,
        table = document.getElementById(table_base+count);
    if (table !== null) {
      while(table) {
        var status = document.getElementById(status_base+count).outerText;
        if(status === "Enrolled") {
          // if is combined section
          if(document.getElementById(detail_base+count).firstElementChild.childElementCount === 3) {
            var course = [], course1 = [];

            var raw_title = table.firstChild.firstElementChild.children[0].outerText,
            index = raw_title.indexOf("-"),
            detail = document.getElementById(detail_base+count).firstElementChild.children[1],
            section = detail.children[1].outerText;
            section = section.slice(0, section.length-1);
            var title = raw_title.slice(0,index+2)+section,
            raw_date = detail.children[6].outerText,
            date_index = raw_date.indexOf("-"),
            start_date = raw_date.slice(0, date_index-1),
            end_date = raw_date.slice(date_index+2, -1),
            raw_schedule = detail.children[3].outerText,
            weekly = raw_schedule.slice(0, raw_schedule.indexOf(" ")),
            start_time = start_date + " " + raw_schedule.slice(raw_schedule.indexOf(" ")+1, raw_schedule.indexOf("-")-1),
            end_time = start_date + " " + raw_schedule.slice(raw_schedule.indexOf("-")+2, -1),
            loc = detail.children[4].outerText;
            loc = loc.slice(0, loc.length-1);


            course.push(title);
            course.push(weekly);
            course.push(start_time);
            course.push(end_time);
            course.push(loc);
            course.push(start_date);
            course.push(end_date);
            list.push(course);

            detail = document.getElementById(detail_base+count).firstElementChild.children[2],
            section = detail.children[1].outerText;
            section = section.slice(0, section.length-1);
            var title = raw_title.slice(0,index+2)+section,
            raw_date = detail.children[6].outerText,
            date_index = raw_date.indexOf("-"),
            start_date = raw_date.slice(0, date_index-1),
            end_date = raw_date.slice(date_index+2, -1),
            raw_schedule = detail.children[3].outerText,
            weekly = raw_schedule.slice(0, raw_schedule.indexOf(" ")),
            start_time = start_date + " " + raw_schedule.slice(raw_schedule.indexOf(" ")+1, raw_schedule.indexOf("-")-1),
            end_time = start_date + " " + raw_schedule.slice(raw_schedule.indexOf("-")+2, -1),
            loc = detail.children[4].outerText;
            loc = loc.slice(0, loc.length-1);

            course1.push(title);
            course1.push(weekly);
            course1.push(start_time);
            course1.push(end_time);
            course1.push(loc);
            course1.push(start_date);
            course1.push(end_date);
            list.push(course1);

          } else {
            var course = [];
            var raw_title = table.firstChild.firstElementChild.children[0].outerText,
            index = raw_title.indexOf("-"),
            detail = document.getElementById(detail_base+count).firstElementChild.children[1],
            section = detail.children[1].outerText;
            section = section.slice(0, section.length-1);
            var title = raw_title.slice(0,index+2)+section,
            raw_date = detail.children[6].outerText,
            date_index = raw_date.indexOf("-"),
            start_date = raw_date.slice(0, date_index-1),
            end_date = raw_date.slice(date_index+2, -1),
            raw_schedule = detail.children[3].outerText,
            weekly = raw_schedule.slice(0, raw_schedule.indexOf(" ")),
            start_time = start_date + " " + raw_schedule.slice(raw_schedule.indexOf(" ")+1, raw_schedule.indexOf("-")-1),
            end_time = start_date + " " + raw_schedule.slice(raw_schedule.indexOf("-")+2, -1),
            loc = detail.children[4].outerText;
            loc = loc.slice(0, loc.length-1);

            course.push(title);
            course.push(weekly);
            course.push(start_time);
            course.push(end_time);
            course.push(loc);
            course.push(start_date);
            course.push(end_date);
            list.push(course);
          }
        }
        count += 1;
        table = document.getElementById(table_base+count);
      }
        return ScheduleGen(list);//at this point the list is ready
     } else {
         return "not on the right page";
     }
}

function ScheduleGen(list) {
  var cal = ics();
  for(var i=0; i<list.length; i++) {
    cal.addEvent(list[i][0], '', list[i][4], list[i][2], list[i][3], true, list[i][1], list[i][6]);
  }
  cal.download('calendar');
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: TableExtract()
});
