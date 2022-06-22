import { GetImageName, GetManifests, UpdateManifestFiles } from "./manifest";
import * as path from "path";
import * as fs from "fs";
import * as k8s from "@kubernetes/client-node";
import { TraverseObject } from "./util";

describe("Run", () => {
  describe("GetImageName", () => {
    it("gets the image name from digest", () => {
      const fullImage =
        "imagename@cbbf2f9a99b47fc460d422812b6a5adff7dfee951d8fa2e4a98caa0382cfbdbf";
      expect(GetImageName(fullImage)).toEqual("imagename");
    });

    it("gets the image name from tag", () => {
      const fullImage = "imagename:latest";
      expect(GetImageName(fullImage)).toEqual("imagename");
    });
  });

  describe("GetManifests", () => {
    it("gets manifests", () => {
      const testPath = path.join("test", "unit", "manifests");
      const manifests = GetManifests([testPath]);

      const expectedManifests = [
        "test/unit/manifests/manifest_test_dir/another_layer/deep-ingress.yaml",
        "test/unit/manifests/manifest_test_dir/another_layer/deep-service.yaml",
        "test/unit/manifests/manifest_test_dir/nested-test-service.yaml",
        "test/unit/manifests/test-ingress.yml",
        "test/unit/manifests/test-service.yml",
      ];
      expect(manifests).toHaveLength(5);
      expectedManifests.forEach((fileName) => {
        expect(expectedManifests).toContain(fileName);
      });
    });

    it("throws when invalid manifest path given", () => {
      const badPath = path.join(
        "test",
        "unit",
        "manifests",
        "nonexistent.yaml"
      );
      const goodPath = path.join(
        "test",
        "unit",
        "manifests",
        "manifest_test_dir"
      );
      expect(() => {
        GetManifests([badPath, goodPath]);
      }).toThrowError();
    });

    it("doesn't duplicate files when nested dir included", () => {
      const outerPath = path.join("test", "unit", "manifests");
      const fileAtOuter = path.join(
        "test",
        "unit",
        "manifests",
        "test-service.yml"
      );
      const innerPath = path.join(
        "test",
        "unit",
        "manifests",
        "manifest_test_dir"
      );

      expect(GetManifests([outerPath, fileAtOuter, innerPath])).toHaveLength(5);
    });
  });
});
