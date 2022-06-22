import * as core from "@actions/core";
import { IMAGES, MANIFEST_PATHS } from "./inputs";
import { GetMultilineStr } from "./util";
import { UpdateManifestFiles, GetManifests } from "./manifest";
import { mkdirSync } from "fs";
import * as uuid from "uuid";
import * as os from "os";
import * as path from "path";

async function run() {
  if (MANIFEST_PATHS.length === 0) {
    throw new Error("Manifest file paths not provided");
  }

  if (IMAGES.length === 0) {
    throw new Error("Images for substitution not provided");
  }

  core.info("Getting manifests");
  const manifestPaths = GetManifests(MANIFEST_PATHS);

  core.info("Creating new manifest directory");
  const temp_directory = process.env["RUNNER_TEMP"] || os.tmpdir();
  const newManifestDirectory = path.join(
    temp_directory,
    `substituted-images-${uuid.v4()}`
  );
  mkdirSync(newManifestDirectory, {
    recursive: true,
  });

  core.startGroup("Updating manifest files with updated images");
  const newManifestPaths = UpdateManifestFiles(
    manifestPaths,
    IMAGES,
    newManifestDirectory
  );
  core.endGroup();

  core.info("Setting outputs");
  core.setOutput("directory", newManifestDirectory);
  core.setOutput("manifests", GetMultilineStr(newManifestPaths));
}

run().catch(core.setFailed);
