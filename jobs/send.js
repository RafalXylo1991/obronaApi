const database = require("../src/sqlDatabase")

const dateformat = require('date-and-time');
const fcm = require("fcm-node")
const erverKey = "AAAAX7-PUXI:APA91bFCkcY-M87LhGgGEHhr7wqzRuvCfvtCLUehb6Fp4pYrw1QhqsJZ7cBJ2LRfrmvKl1j1YJQMbgI2UGqi4kuUBaD9MfIxPRerr2QQz8Z7boJsq5Sdl6Lhs_WKl0ng_2x0XXwhu2Aq"
const me = new fcm(erverKey);

function check() {

    database.getTokens().then((data) => {

        data.forEach(element => {
            database.getEvents(element.user_id).then(events => {
                events.forEach(event => {
                    let endarray = event.enddate.split("-")
                    let startarray = event.startdate.split("-")
                    let startHourArray = event.starttime.split(":");
                    let endHourArray = event.endtime.split(":");
                    const today = new Date();
                    let start = endarray[2] + "-" + endarray[1] + "-" + endarray[0];
                    let end = startarray[2] + "-" + startarray[1] + "-" + startarray[0];
                    const enddate = new Date(new Date(start).getTime() + (startHourArray[0] * 60 * 60 * 1000) + (startHourArray[1] * 60 * 1000))
                    const startdate = new Date(new Date(end).getTime() + (endHourArray[0] * 60 * 60 * 1000) + (endHourArray[1] * 60 * 1000))
                    let time;
                    let delay;
                    switch (event.timer) {
                        case "1h":
                            time = 1000 * 60 * 60;
                            delay = 24;
                            break;
                        case "4h":
                            time = 4 * 1000 * 60 * 60;
                            delay = 24;
                            break;
                        case "12h":
                            time = 12 * 1000 * 60 * 60;
                            delay = 24;
                            break;
                        case "1D":
                            time = 24 * 1000 * 60 * 60;
                            delay = 24;
                            break;
                        case "7D":
                            delay = 168;

                            break;
                        case "10D":
                            delay = 240;

                            break;
                    }
                    let godziny = dateformat.subtract(enddate, startdate).toHours(); //tyle godzin zostalo do wydarzenia
                    if (godziny < 0) {

                        const message = {
                            notification: {
                                title: "Event",
                                body: "Cześć " + element.name + ", wydarzenie " + event.title + ' już miało miejsce',
                            },
                            android: {
                                notification: {
                                    sound: 'default'
                                },
                                apns: {
                                    payload: {
                                        aps: {
                                            sound: 'default'
                                        },
                                    },
                                },
                            },
                            to: element.device
                        }

                        me.send(message, (err, resonse) => {
                            if (err) {
                                console.log(err)
                            }
                        });
                    } else if (godziny < delay) {
                        const message = {
                            notification: {
                                title: "Event",
                                body: "Cześć " + element.name + ", " + event.startdate + "   odbędzie sie wydarzenie : " + event.title + " o godzinie " + event.starttime
                            },
                            android: {
                                notification: {
                                    sound: 'default'
                                },
                                apns: {
                                    payload: {
                                        aps: {
                                            sound: 'default'
                                        },
                                    },
                                },
                            },
                            to: element.device
                        }

                        me.send(message, (err, resonse) => {
                            if (err) {
                                console.log(err)
                            }
                        });
                    }


                })


            })
            database.getLists(element.user_id).then(lists => {
                let unfinished = [];
                let titles = "";
                lists.forEach(list => {
                    if (list.isdone == false) {
                        unfinished.push(list.title)
                        titles += list.title + " "
                    }
                })

                if (unfinished.length > 0) {
                    const message = {
                        notification: {
                            title: "Hi " + element.name + ", you have " + (unfinished.length) + " unfinished ToDoLists"




                        },
                        android: {
                            notification: {
                                sound: 'default'
                            },
                            apns: {
                                payload: {
                                    aps: {
                                        sound: 'default'
                                    },
                                },
                            },
                        },
                        to: element.device
                    }
                    me.send(message, (err, resonse) => {
                        if (err) {
                            console.log(err)
                        }

                    });
                }


            })
        });
    })


}
const compareDates = (d1, d2) => {
    let date1 = new Date(d1).getTime();
    let date2 = new Date(d2).getTime();

    if ((d1.getTime() - d2.getTime()) > (1000 * 60 * 60 * 24)) {
        return true;
    }

};
module.exports = {
    check
}