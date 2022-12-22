const Utils = {
    print: (data) => {
        process.stdout.write(data + '\r');
    },
    createTimeStamp: () => {
        var d = new Date();
        var month = d.getMonth() + 1;
        if (month < 10) { month = "0" + month; }
        var day = d.getDate();
        if (day < 10) { day = "0" + day; }
        var hours = d.getHours();
        if (hours < 10) { hours = "0" + hours; }
        var minutes = d.getMinutes();
        if (minutes < 10) { minutes = "0" + minutes; }
        var dateCreated = d.getFullYear() + "" + (month) + "" + day + "" + hours + "" + minutes;
        return dateCreated;
    }
}

export default Utils;