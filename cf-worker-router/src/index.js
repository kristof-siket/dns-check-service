"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const chooseRegion_1 = __importDefault(require("./chooseRegion"));
const app = new hono_1.Hono();
app.get("/", (c) => {
    return c.text("Hello Hono!");
});
app.get("/check-dns/:domain", (c) => __awaiter(void 0, void 0, void 0, function* () {
    const domain = c.req.param("domain");
    const { region, url } = (0, chooseRegion_1.default)(c.req.query("region"));
    c.res.headers.set("X-Region", region);
    console.log(`Checking ${domain} from ${url} (${region}))`);
    const res = yield fetch(`${url}/check-dns/${domain}`);
    const json = yield res.json();
    return c.json(json);
}));
exports.default = app;
