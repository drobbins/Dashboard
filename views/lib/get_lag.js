exports.get_days_between_dates = function get_days_between_dates(date1, date2){
    var days_of_months = [31,28,31,30,31,30,31,31,30,31,30,31];
    if (date1.month === date2.month){
      return date2.day - date1.day;
    }
    else {
      return days_of_months[date1.month-1]-date1.day+date2.day;
    }
    return 0;
}
