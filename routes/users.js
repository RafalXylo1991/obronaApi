require('dotenv').config();
const express = require('express')
const database = require("../src/sqlDatabase.js")
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { restart } = require('nodemon');
const nodemailer = require("nodemailer");

const fcm = require("fcm-node")
const erverKey = "AAAAX7-PUXI:APA91bFCkcY-M87LhGgGEHhr7wqzRuvCfvtCLUehb6Fp4pYrw1QhqsJZ7cBJ2LRfrmvKl1j1YJQMbgI2UGqi4kuUBaD9MfIxPRerr2QQz8Z7boJsq5Sdl6Lhs_WKl0ng_2x0XXwhu2Aq"
const me = new fcm(erverKey);

let refreshTokens = []
router.post('/users/token', async (req, res) => {

  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_ACCESS_TOKEN, (err, user) => {
    if (err) console.log(err)

    const accessToken = generateRefreshToken({ name: user.name })
    return res.json({ accessToken: accessToken })

  })

})
router.delete('/users/logOut', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)

  return res.sendStatus(204)
})

router.get('/users/posts', outhoricateToken, async (req, res) => {
  console.log("dsfs");
  await database.getAllUsers2(req.user).then((data) => {


    res.json(data)
  }
  ).catch(err => {
    console.log(err)
  });

})

router.post('/users/login', async (req, res) => {
  const user = req.body
  console.log(req.body)
  await database.getAllUsers(user.name, user.password).then((data) => {
    console.log(req.body)
    database.getTokens().then(tokens => {
      console.log(data)
      let contain = false;
      for (i = 0; i < tokens.length; i++) {
        console.log(tokens[i])
        if (tokens[i].device === req.body.token) {
          contain = true;
        }
      }
      if (contain == false) {
        console.log(data.name)
        database.addToken(data.id, req.body.token, data.name);
      }
    })
    const accessToken = generateRefreshToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_ACCESS_TOKEN)
    refreshTokens.push(refreshToken)
    console.log("Logged as " + data.name)
    return res.json({ accessToken: accessToken, refreshToken: refreshToken, user: data, status: 1 })
  }
  ).catch(err => {
    console.log(err)
    return res.json({ "error": err, status: 0 })
  });

})

router.post('/users/newUser', async (req, res) => {

  const salt = await bcrypt.genSalt();
  if (req.body.password == "0000") {

    var user = req.body

    user.password = null;

    return res.send(database.addNewUser(user))
  } else {

    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    var user = req.body
    user.password = hashedPassword;

    database.addNewUser(user).then(data => {

      res.json({ data: data, status: true })
    }).catch(error => {
      res.json({ data: error, status: false })
    })


  }


})




router.post('/users/uploadFile', outhoricateToken, async (req, res) => {


  console.log(req.body + "cipeczka")


})
router.post('/users/resetPassword', async (req, res) => {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'xylohunter1991@gmail.com',
      pass: 'oked ikkq qnqz hifo'
    }
  });

  database.getUsers(req.body.email).then((data) => {

    let number = (Math.floor(Math.random() * 90000) + 100);
    var mailOptions = {
      from: 'xylohunter1991@gmail.com',
      to: data.email,
      subject: 'Reset hasła',
      text: 'To twój numer do zresetowania hasła ' + number,
    };
    console.log(mailOptions);
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
        res.json({ "resetkey": number, "message": "account founded" });


      }
    });
    database.setResetKey(number, data.id);
  }).catch(error => {
    res.send(error);
  })



})
router.post('/users/getNotify', outhoricateToken, async (req, res) => {
  console.log(req.body.token)
  const message = {
    notification: {
      title: "cipeczka",
      body: "pochwa"
    },
    to: "cwUblBGAyBQpCryB_taYlV:APA91bHVboJnST7QFEDYcOcHmrO4xlpBepacUwTsfKzxUA_vynDKACFqzH8p5kkMAIuAoCGUfV66xd3kJdz3bZsgQtaBq4mR4CH84Hahfvp89aTnE8IXo7tYrZWDcTN29l2kg2Zk-Njm"
  }
  console.log(message)
  me.send(message, (err, resonse) => {
    console.log(resonse)
    console.log(err)
  });




})
router.post('/users/getLists', outhoricateToken, async (req, res) => {
  console.log(req.body)
  database.getLists(req.body.id).then(data => {
    console.log(data)
    return res.json({ lists: data, status: 1 })
  }).catch(err => {
    console.log(err)
    return res.json({ "error": err, status: 0 })
  });



})

router.post('/users/getEvent', outhoricateToken, async (req, res) => {

  database.getEvents(req.body.id).then(async data => {
    console.log(data)
    return res.json(data)
  }).catch(err => {
    console.log(err)
    return res.json({ "error": err, status: 0 })
  });



})
router.post('/users/updateList', outhoricateToken, async (req, res) => {
  console.log(req.body)
  database.updateList(req.body).then(async data => {

  }).catch(err => {
    console.log(err)
    return res.json({ "error": err, status: 0 })
  });



})
router.post('/users/updateEvent', outhoricateToken, async (req, res) => {
  database.updateEvent(req.body);
})

router.post('/users/setPassword', async (req, res) => {
  database.setPassword(req.body.password, req.body.email);
})

router.put('/users/updateNotice', outhoricateToken, async (req, res) => {

  database.updateNotice(req.body).then(data => {
    console.log(req.body)
  }).catch(err => {
    console.log(err)
    return res.json({ "error": err, status: 0 })
  });



})

router.post('/users/sendResetKey', async (req, res) => {

  console.log(database.getUserByEmail(req.body.resetkey).then(data => res.send({ "message": data })));
})

router.delete('/users/deleteUser', outhoricateToken, async (req, res) => {
  await database.getAllUsers2(req.body).then(async (data) => {

    console.log(data)
    database.deposit(req.body, data.id)

    database.deleteUser(data).then((data) => {
      return res.send(data)
    })


  }
  ).catch(err => {
    console.log(err)
  });
  n

})



router.post('/users/addEvent', outhoricateToken, async (req, res) => {
  console.log(req.body)
  await database.addEvent(req.body)
})
router.post('/users/delEvent', outhoricateToken, async (req, res) => {
  console.log(req.body)
  await database.delEvent(req.body.id).then(async (data) => {

    res.json(data)
  }
  ).catch(err => {
    console.log(err)
  });

})
router.post('/users/addList', outhoricateToken, async (req, res) => {


  console.log(req.body)
  await database.addList(req.body)

})

router.put('/users/updateUser', outhoricateToken, async (req, res) => {

  console.log(req.body)
  await database.updateUser(req.body).then(async (data) => {






    res.json(data)
  }
  ).catch(err => {
    console.log(err)
  });

})
router.post('/users/getNotices', outhoricateToken, async (req, res) => {
  console.log(req.body)
  await database.getNotices(req.body).then(async (data) => {




    res.json(data)
  }
  ).catch(err => {
    console.log(err)
  });

})
router.delete('/users/delNotice', outhoricateToken, async (req, res) => {
  console.log(req.body)
  await database.deleteNotice(req.body).then(async (data) => {
    res.json({ "message": data })





  }
  ).catch(err => {
    console.log(err)
  });

})
router.post('/users/addNotice', async (req, res) => {
  console.log(req.body)
  await database.addNotice(req.body).then(done => {
    res.json({ "message": done })
    console.log(req.body)
  }).catch((error) => {
    res.json({ "error": error })
  })


})

router.delete('/users/deleteList', async (req, res) => {
  console.log(req.body)
  await database.deleteList(req.body).then(done => {
    res.json({ "message": done })
    console.log(req.body)
  }).catch((error) => {
    res.json({ "error": error })
  })


})
function outhoricateToken(req, res, next) {

  const outhHeader = req.headers['authorization']

  const token = outhHeader && outhHeader.split(" ")[1]
  console.log(token)

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) { return res.sendStatus(403) }

    req.user = user.name;

    next()
  })

}

function generateRefreshToken(user) {

  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })

}



module.exports = router
