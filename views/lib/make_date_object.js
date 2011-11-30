//Utility function for converting string dates into "date objects"
// Returns an object of the form:
// {
//  year:
//  month:
//  quarter:
//  day:
// }
//
// Expects input of the form YYYY-MM-DDThh:mm:ssZ


exports.make_date_object = function make_date_object(date_string){
    var date_array,
        date_object,
        quarters = [1,1,1,2,2,2,3,3,3,4,4,4];
    date_array = date_string.split("T")[0].split("-");
    try{
        return date_object = {
            "month" : parseInt(date_array[1].replace(/^0/,"")),
            "day" : parseInt(date_array[2].replace(/^0/,"")),
            "year" : parseInt(date_array[0].replace(/^([0-9][0-9])$/,"20$1")), //Y3K Bug :)
            "quarter" : quarters[date_array[1]-1]
        };
    }
    catch(error){
        throw "Unable to parse date_string";
    }
};
