exports.get_days_between_dates = function get_days_between_dates(date1, date2){
    var days_of_months = [31,28,31,30,31,30,31,31,30,31,30,31],
        days_in_year = 365,
        total_days = 0,
        day1, day2;
    day1 = sum(days_of_months.slice(0,date1.month-1)) + date1.day;
    day2 = sum(days_of_months.slice(0,date2.month-1)) + date2.day;
    return (date2.year-date1.year)*days_in_year - (day1-day2);
}
