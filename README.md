# eagle-to-yaml
A custom eagle.cool plugin for converting image metadata into YAML to be used with a custom external system.

## Setup
1. Clone the repository
2. Open the eagle.cool application
3. Import the plugin by selecting plugin > developer options > import local project and selecting the .eaglepack file
4. Run the plugin

![Screenshot 2024-05-23 at 16 40 24](https://github.com/rhysjparry/eagle-to-yaml/assets/6196105/a1648bf8-daba-4408-9d24-2712e950cd1a)

## Info
The plugin is setup to work with a specific structure and requires the following folder and image hierarchy.

- parentFolder:
  - childFolder:
    - images (minimum of 6)
   
You can also set an optional theme name by adding a description to the parent folder.
   
## Features
You can reload the data if editing the eagle.cool files in the background, copy the YAML to the clipboard or download the file to the desktop.
