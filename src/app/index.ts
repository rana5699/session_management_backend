import app from "./app";
import config from "./config";

const port = config.port || 3000;

const mainServer = () => {
  try {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

mainServer();
