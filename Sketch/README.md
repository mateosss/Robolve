# TODO: Finish this, should explain the rules of every file and how to use them

# Sketch Folder

This folder contains automated blend files and other assets that helps with the generation of sprites

## Blend Files

General Rules:

    - Distance of multiples of 8
    - Put an asterisk in a object name if it is a meta object, like a lamp or 
      an empty, that way it will be always imported and will appears first in the outliner
    - Also if it has an asterisk in the name, then you should not delete it because it is important
    - May or may not cause problems: When executing a script make sure that you let the blender windows focused

### Robots.blend

### Animations.blend

**Be careful:**
 - There should be only one scene called Scene
 - Don't delete the armature
 - Let all the Armature animations stashed
 - Animations must start in frame 0

**What you can do in this file**:
 - Modify the render settings
 - Improve the rigging of the Armature
 - Create new animations
 - Run the animate.py script for export everything
 - You can modify the `PARTS_LIST`, `ANIMATIONS_LIST` and `FRAMES_LIST` variables
   at the beginning of the animate.py script, read those lines for more info

### Deffense.blend

