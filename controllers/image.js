const handleImageIdentification = (req, res) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "4aeeecb32f39430c88368bf952e36692";
  const USER_ID = "rehan-11-24";
  const APP_ID = "smart-brain";
  // Change these to whatever model and image URL you want to use
  // const MODEL_ID = "general-image-recognition";
  const MODEL_ID = "face-detection";
  const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
  // const IMAGE_URL = "https://samples.clarifai.com/metro-north.jpg";
  // const IMAGE_URL = this.state.input;
  const IMAGE_URL = req.body.image;

  ///////////////////////////////////////////////////////////////////////////////////
  // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
  ///////////////////////////////////////////////////////////////////////////////////

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  fetch(
    "https://api.clarifai.com/v2/models/" +
      MODEL_ID +
      "/versions/" +
      MODEL_VERSION_ID +
      "/outputs",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log("--- Results after CLARIFAI call ---");
      console.log(result);
      res.json(result);
    })
    .catch((error) => {
      console.log("--- Error with clarifai API call ---", error);
      res.json({ message: "Error with clarifai API call." });
    });
};

module.exports = { handleImageIdentification };
