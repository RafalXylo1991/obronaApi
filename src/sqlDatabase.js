require('dotenv').config();
const bcrypt = require("bcrypt");

const { Client } = require('pg');


const knex = require('knex')({
    client: 'pg',
    connection: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: true
    },
});

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: true
})
async function connect() {


    client.connect();


}

async function addNewUser(user) {
    return new Promise(async (resolve, reject) => {
        knex("usersshield").select("*").where("email", user.email).then(data => {
            console.log(!data.length)
            if (!data.length) {

                knex('usersshield').insert([
                    {
                        'name': user.name,
                        'password': user.password,
                        'email': user.email,
                    },
                ]).then(data => resolve("User has been added"));
                resolve("User has been added");
            } else {

                reject("Podany email jest już zajęty");
            }


        });




    })

}
async function addEvent(event) {
    console.log(event)
    return new Promise(async (resolve, reject) => {
        knex('events').insert([
            {
                'user_id': event.id,
                'title': event.title,
                'startdate': event.startDate,
                'enddate': event.endDate,
                'starttime': event.startTime,
                'endtime': event.endTime,
                'description': event.desc,
                'timer': event.remindTime
            },
        ]).then(data => resolve(data))


    })

}
async function addList(list) {
    console.log("cycki")
    return new Promise(async (resolve, reject) => {
        const create = "CREATE TABLE lists( id  SERIAL PRIMARY KEY, user_id  INT ,title TEXT,date TEXT, tasks JSON,isdone BOOLEAN) "

        const quary = "INSERT INTO  lists (user_id, title,date, tasks, isdone,progress)  VALUES ('" + list.id + "','" + list.title + "','" + list.date + "','" + list.tasks + "','" + list.isdone + "','" + list.progress + "');"
        console.log(quary)
        await client.query(quary, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }


            resolve(res.rows)



        });

    })

}
async function updateList(list) {
    return new Promise(async (resolve, reject) => {
        const create = "CREATE TABLE lists( id  SERIAL PRIMARY KEY, user_id  INT ,title TEXT,date TEXT, tasks JSON,isdone BOOLEAN) "
        return new Promise(async (resolve, reject) => {
            knex('lists').update(
                {
                    tasks: list.tasks,
                    progress: list.progress,
                    isdone: list.isdone,
                    date_done: list.date_done,
                },
            ).where('id', list.id).then(data => resolve(data))
        })


    })

}
async function addNotice(event) {
    return new Promise(async (resolve, reject) => {
        const create = "CREATE TABLE notices( id  SERIAL PRIMARY KEY, user_id  INT ,title TEXT, subject TEXT,description TEXT) "

        const quary = "INSERT INTO  notices (user_id, title, subject, description, important)  VALUES ('" + event.id + "','" + event.title + "','" + event.subject + "','" + event.description + "','" + event.isimportant + "');"
        console.log(quary)
        await client.query(quary, (err, res) => {
            if (err) {
                console.error(err);
                reject("Something went wrong take a look " + err)
                return;
            }
            resolve("Notice was added")





        });

    })

}
async function getUserById(id) {


    if (!client.connect()) { connect() };
    return new Promise(async (resolve, reject) => {
        const quary = " select * from users where id=" + id
        await client.query(quary, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Table is successfully created');
            client.end();
            resolve(res.rows)



        });

    })
}
async function getTokens() {

    console.log("tokens")
    return new Promise(async (resolve, reject) => {
        const quary = " select * from devicetokens"
        await client.query(quary, async (err, res) => {
            if (err) {
                console.error(err);
                return;
            } else {

                resolve(
                    res.rows
                )
            }








        });

    })
}


async function deleteUser(user) {


    return new Promise(async (resolve, reject) => {
        const quary = " delete from usersshield where id=" + user.id
        await client.query(quary, async (err, res) => {
            if (err) {
                console.error(err);
                return;
            } else {

                resolve("User has been deleted")
            }








        });
        await client.query("delete from transitions where user_id=" + user.id)

    })
}
async function deleteNotice(notice) {


    return new Promise(async (resolve, reject) => {
        const quary = " delete from notices where id=" + notice.id
        await client.query(quary, async (err, res) => {
            if (err) {
                console.error(err);
                return;
            } else {
                resolve("Note is deleted")

            }








        });

    })
}
async function deleteList(id) {


    return new Promise(async (resolve, reject) => {

        const quary = " delete from lists where id=" + id.id
        console.log(quary)
        await client.query(quary, async (err, res) => {
            if (err) {
                console.error(err);
                return;
            } else {
                resolve("Note is deleted")

            }








        });

    })
}
function addToken(userId, token, name) {

    return new Promise(async (resolve, reject) => {

        knex('devicetokens').insert([{ 'user_id': userId, 'device': token, 'name': name }]).then((data) =>
            console.log(data)
        );



    })

}

async function getAllUsers(name, password) {
    console.log(name);
    console.log(password);




    try {
        return new Promise(async (resolve, reject) => {

            const quary = " SELECT * FROM usersshield"
            await client.query(quary, async (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }


                users = JSON.parse(JSON.stringify(res.rows))
                console.log(users);
                console.log("users printed")
                for (i = 0; i < users.length; i++) {

                    if (users[i].name == name) {
                        if (password == undefined) {
                            resolve(users[i])

                        } else {


                            if (await bcrypt.compare(password, users[i].password)) {


                                resolve(users[i])

                            } else {
                                reject("Hasło jest nie poprawne")

                            }
                        }



                    }
                }
                reject("Nie znaleziono użytkownika")




            });

        })

    } catch (error) {
        console.log("found error")
    }

}

async function getUsers(email) {






    return new Promise(async (resolve, reject) => {
        const quary = " SELECT * FROM usersshield"
        await client.query(quary, async (err, res) => {
            if (err) {
                console.error(err);
                return;
            }


            users = JSON.parse(JSON.stringify(res.rows))

            for (i = 0; i < users.length; i++) {
                if (users[i].email === email) {
                    resolve(users[i])
                }
            }
            reject("Nie znaleziono użytkownika")






        });

    })
}
async function delEvent(id) {
    return new Promise(async (resolve, reject) => {
        knex('events').where('id', id).del().then(data => resolve(data));
    })
}


async function getEvents(id) {
    return new Promise(async (resolve, reject) => {
        knex("events").select("*").where("user_id", id).then(data => resolve(data))
    })
}

async function getLists(id) {
    return new Promise(async (resolve, reject) => {
        knex("lists").select("*").then(data => resolve(data))
    })


}

async function setResetKey(key, id) {
    return new Promise(async (resolve, reject) => {
        knex('usersshield').update(
            {
                resetKey: key,
            },
        ).where('id', id).then(data => resolve(data))

    })


}
async function getNotices(user) {
    return new Promise(async (resolve, reject) => {
        knex('notices').select('*').where('user_id', user.id).then(data => resolve(data));
    })
}
async function updateUser(user) {



    return new Promise(async (resolve, reject) => {
        let quary = "";
        const salt = await bcrypt.genSalt();
        if (user.password != "") {
            const hashedPassword = await bcrypt.hash(user.password, salt)
            quary = " update usersshield set name='" + user.name + "',email='" + user.email + "',pin=" + user.pin + ", password='" + hashedPassword + "' where id =" + user.id;
        } else {
            quary = " update usersshield set name='" + user.name + "',email='" + user.email + "',pin=" + user.pin + " where id =" + user.id;
        }



        console.log(quary)
        await client.query(quary, async (err, res) => {
            if (err) {
                console.error(err);
                return;

            }
        });



    })


}
async function updateEvent(event) {
    console.log(event)
    return new Promise(async (resolve, reject) => {
        knex('events').update(
            {
                title: event.title,
                startdate: event.startDate,
                enddate: event.endDate,
                starttime: event.startTime,
                endtime: event.endTime,
                timer: event.remindTime
            },
        ).where('id', event.id).then(data => resolve(data))
    })
}
async function updateNotice(notice) {

    return new Promise(async (resolve, reject) => {
        const quary = " update notices  set description='" + notice.text + "' where id =" + notice.id
        console.log(quary)
        await client.query(quary, async (err, res) => {
            if (err) {
                console.error(err);
                return;

            }
        });



    })







}
module.exports = {
    connect,
    addNewUser,
    getAllUsers,
    getUserById,
    deleteUser,
    addEvent,
    delEvent,
    getEvents,
    updateUser, updateEvent,
    addNotice,
    getNotices,
    deleteNotice,
    updateNotice,
    addList,
    getLists,
    updateList,
    deleteList,
    addToken,
    getTokens,
    getUsers,
    setResetKey

}

