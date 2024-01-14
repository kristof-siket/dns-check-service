import regions from "./regions";

const chooseRegion = (region: string = "") => {
  if (regions[region]) {
    return {
      region: region,
      url: regions[region],
    };
  } else {
    return {
      region: "usa",
      url: regions["usa"],
    };
  }
};

export default chooseRegion;
