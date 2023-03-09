const handleSignin = (req, res, database, bcrypt) => {
  const { email, password } = req.body;
  const conditionsArr = [
    email.length >= 8 && email.length <= 100,
    password.length >= 8 && password.length <= 100,
  ];
  if (conditionsArr.indexOf(false) === -1) {
    database
      .select(
        "users.id",
        "users.name",
        "users.email",
        "users.entries",
        "users.joined",
        "login.hash"
      )
      .from("login")
      .where("login.email", "=", email)
      .innerJoin("users", "login.email", "users.email")
      .then((data) => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          return res.json({
            id: data[0].id,
            name: data[0].name,
            email: data[0].email,
            entries: data[0].entries,
            joined: data[0].joined,
            message: "Signed in.",
          });
        } else {
          new Throw("Entered credentials are wrong.");
        }
      })
      .catch((err) => res.status(404).json("Entered credentials are wrong."));
  } else {
    return res.status(400).json({
      message:
        "Email or Password did not meet the criteria. Between 8 to 100 characters are required.",
    });
  }
};

module.exports = { handleSignin: handleSignin };
