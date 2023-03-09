const handleRegister = (req, res, database, bcrypt, saltRounds) => {
  const { name, password, email } = req.body;
  const conditionsArr = [
    name.length >= 8 && name.length <= 100,
    password.length >= 8 && password.length <= 100,
    email.length >= 8 && email.length <= 100,
  ];

  if (conditionsArr.indexOf(false) === -1) {
    // Password hashing
    const hash = bcrypt.hashSync(password, saltRounds);
    database.transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into("login")
        .returning("email")
        .then((email) => {
          return trx("users")
            .returning("*")
            .insert({ email: email[0].email, name: name, joined: new Date() })
            .then((data) => {
              res
                .status(201)
                .json({ status: "User has been registered.", response: data });
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .catch((err) => {
          res
            .status(400)
            .json({ status: "Cannot create user.", response: err.detail });
        });
    });
  } else {
    return res.status(400).json({
      message:
        "Name or Password or Email did not meet the criteria. Between 8 to 100 characters are required.",
    });
  }
};

module.exports = { handleRegister: handleRegister };
