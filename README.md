# K8s Artifact Substitue

This action is used to update the tag or digest for container images. New tags / digests are substituted into the non-templatized version of manifest files to ensure that the right version of the image is used by manifests.

The new manifests are placed in a new folder. All manifests supplied are placed at the root-level of this folder with their filenames being the same as their original basename.

## Inputs

<table>
  <thead>
    <tr>
      <th>Action input</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>manifests </br></br>(Required)</td>
    <td>Path to the manifest files to be used for deployment. These can also be directories containing manifest files, in which case, all manifest files in the referenced directory at every inner depth will be taken. Files not ending in .yml, .yaml, or .json will be ignored.</td>
  </tr>  
  <tr>
    <td>images </br></br>(Optional)</td>
    <td>Fully qualified resource URL of the image(s) to be used for substitutions on the manifest files. This multiline input accepts specifying multiple artifact substitutions in newline separated form. For example:<br> 
    <br>images: |<br>&nbsp&nbspcontosodemo.azurecr.io/foo:test1<br>&nbsp&nbspcontosodemo.azurecr.io/bar:test2<br><br>
    In this example, all references to contosodemo.azurecr.io/foo and contosodemo.azurecr.io/bar are searched for in the image field of the input manifest files. For the matches found, the tags test1 and test2 are substituted.</td>
  </tr>
</table>

## Outputs

<table>
  <thead>
    <tr>
      <th>Action output</th>
      <th>Description</th>
    </tr>
  </thead>
  <tr>
    <td>manifests</td>
    <td>Paths to the new manifests as a multiline string. Each manifest path is on a new line.</td>
  </tr>  
  <tr>
    <td>directory</td>
    <td>Path to the new manifests directory. All new manifests are in the root-level.</td>
  </tr>
</table>

## Usage Example

```yaml
- uses: Azure/k8s-artifact-substitute@v1
  with:
    manifests: |
      dir/manifestsDirectory
      dir/manifest.yaml
    images: |
      "contoso.azurecr.io/myapp:${{ event.run_id }}"
      "contoso.azurecr.io/myapp2:${{ event.run_id }}"
```

In this example, `k8s-artifact-substitute` will change all references to `contoso.azurecr.io/myapp` and `contoso.azurecr.io/myapp2` to use the event.run_id as the tag.

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
