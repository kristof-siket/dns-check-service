"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const regions_1 = __importDefault(require("./regions"));
const chooseRegion = (region = "") => {
    if (regions_1.default[region]) {
        return {
            region: region,
            url: regions_1.default[region],
        };
    }
    else {
        return {
            region: "usa",
            url: regions_1.default["usa"],
        };
    }
};
exports.default = chooseRegion;
