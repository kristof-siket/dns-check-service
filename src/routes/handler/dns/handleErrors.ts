type ErrorResponse = {
  status: number;
  error: {
    message: string;
  };
};

const handleErrors = (err: any): ErrorResponse => {
  if (err.code === "ENOTFOUND") {
    return {
      status: 404,
      error: {
        message: `Domain ${err.hostname} could not be resolved!`,
      },
    };
  }
  return {
    status: 500,
    error: {
      message:
        "Something unexpected hapened while resolving DNS! Please, try again later or from another region!",
    },
  };
};
