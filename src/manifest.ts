import * as fs from "fs";
import * as core from "@actions/core";
import * as k8s from "@kubernetes/client-node";
import * as path from "path";
import { TraverseObject } from "./util";

const MANIFEST_EXTENSIONS = [".yaml", ".yml", ".json"];
const YAML_DOCUMENT_SEPARATOR = "---";

/**
 * Swaps image / digest tags in manifests
 * @param manifestPaths paths to manifest files
 * @param images fully qualified image (including tag /digest to be swapped to)
 * @returns paths to updated manifest files
 */
export function UpdateManifestFiles(
  manifestPaths: string[],
  images: string[],
  newManifestDirectory: string
): string[] {
  const newManifestPaths = [];

  // retrieve image names
  const imageObjs = images.map((image) => {
    return {
      name: GetImageName(image),
      fullImage: image,
    };
  });

  manifestPaths.forEach((manifestPath: string) => {
    core.debug(`Loading manifest ${manifestPath}`);
    const contents = fs.readFileSync(manifestPath).toString();
    const manifestObjs: any[] = k8s.loadAllYaml(contents);

    // swap images
    const swapImagesFn = (key: string, value: string) => {
      if (key !== "image") return value;

      const currentImageName = GetImageName(value);
      for (const { name, fullImage } of imageObjs) {
        if (name === currentImageName) {
          core.debug(
            `swapping image ${value} to ${fullImage} for ${manifestPath}`
          );
          return fullImage;
        }
      }

      return value; // image is not being swapped
    };

    manifestObjs.forEach((manifestObj) =>
      TraverseObject(manifestObj, swapImagesFn)
    );

    // write updated manifest
    core.debug(`Writing manifest ${manifestPath}`);
    const updatedManifest = manifestObjs
      .map((manifestObj) => k8s.dumpYaml(manifestObj))
      .join(`${YAML_DOCUMENT_SEPARATOR}\n`);
    const fileName = path.join(
      newManifestDirectory,
      path.basename(manifestPath)
    );

    fs.writeFileSync(fileName, updatedManifest);
    newManifestPaths.push(fileName);
    core.info(`Manifest ${manifestPath} written to ${fileName}`);
  });

  return newManifestPaths;
}

/**
 * Gets the image name from fully qualified image
 * @param fullImage fully qualified image
 * @returns image name
 */
export function GetImageName(fullImage: string): string {
  let [imageName] = fullImage.split(":");
  if (imageName.indexOf("@") > 0) {
    // digest edgecase
    imageName = imageName.split("@")[0];
  }

  return imageName;
}

/**
 * Gets manifests from paths (if a path is to a directory, recursively gathers manifests)
 * @param manifestPaths paths to manfiests
 * @returns paths to all manifests
 */
export function GetManifests(manifestPaths: string[]): string[] {
  const fullPathSet: Set<string> = new Set<string>();

  manifestPaths.forEach((manifestPath) => {
    const extension = path.extname(manifestPath);
    if (fs.lstatSync(manifestPath).isDirectory()) {
      GetManifestsFromDir(manifestPath).forEach((file) => {
        fullPathSet.add(file);
      });
    } else if (MANIFEST_EXTENSIONS.includes(extension)) {
      fullPathSet.add(manifestPath);
    } else {
      core.debug(
        `Detected non-manifest file in manifest path: ${manifestPath} `
      );
    }
  });

  return Array.from(fullPathSet);
}

/**
 * Gets manifests from directory and its subfolders
 * @param dirName path to directory
 * @returns array of manifests in directory
 */
function GetManifestsFromDir(dirName: string): string[] {
  const toRet: string[] = [];

  fs.readdirSync(dirName).forEach((fileName) => {
    const filePath: string = path.join(dirName, fileName);
    const extension = path.extname(fileName);

    if (fs.lstatSync(filePath).isDirectory()) {
      toRet.push(...GetManifestsFromDir(filePath));
    } else if (MANIFEST_EXTENSIONS.includes(extension)) {
      toRet.push(path.join(dirName, fileName));
    } else {
      core.debug(`Detected non-manifest file in manifest path: ${filePath}`);
    }
  });

  return toRet;
}
