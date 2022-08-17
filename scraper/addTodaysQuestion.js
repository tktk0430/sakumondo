import { addTodaysQuestionToGAS } from "./scraper";
import { argv } from "process";

addTodaysQuestionToGAS(argv[2]);
