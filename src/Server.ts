import {join} from "path";
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/ajv";
import {config} from "./config/index";
import * as rest from "./controllers/rest/index";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";
import { HelloWorldController } from "./controllers/rest/index";

@Configuration({
  ...config,
  rootDir: __dirname,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8084,
  httpsPort: false, // CHANGE
  disableComponentsScan: true,
  mount: {
    "/": [
      HelloWorldController
    ],
    "/rest": [
      ...Object.values(rest)
    ]
  },
  middlewares: [
    "cors",
    "cookie-parser",
    "compression",
    "method-override",
    "json-parser",
    { use: "urlencoded-parser", options: { extended: true }}
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: [
    "**/*.spec.ts"
  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;

    /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
    $beforeRoutesInit(): void | Promise<any> {
      this.app
        .use(cors())
        .use(cookieParser())
        .use(methodOverride())
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({
          extended: true
        }));

    }
}
