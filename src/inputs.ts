import * as core from "@actions/core";
import { SplitMultilineInput } from "./util";

const MANIFEST_PATHS_INPUT_NAME = "manifests";
const IMAGES_INPUT_NAME = "images";

// get and export inputs
const MANIFEST_PATHS_INPUT = core.getInput(MANIFEST_PATHS_INPUT_NAME, {
  required: true,
});
export const MANIFEST_PATHS = SplitMultilineInput(MANIFEST_PATHS_INPUT);

const IMAGES_INPUT = core.getInput(IMAGES_INPUT_NAME, { required: true });
export const IMAGES = SplitMultilineInput(IMAGES_INPUT);
