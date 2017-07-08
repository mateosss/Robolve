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

  - Color Swap: The color swap is a taken from the material design guidelines, electric:yellow, fire:red, water:blue,
    for darkenning or lightening the color scale two steps, (e.g. yellow 500 lighten-1 would be yellow 300). Use the 
    complementaries on the color wheel in the same way for details, and the black/white/greys for more details

  - The names of the parts are (ignoring the pipe) PartNameInCamelCase|PartNumber\_SpriteName, e.g. `Heads1_fireStrong`,
  where Heads1 is an identifier saying it is a Head, an is the number 1 head, and fireStrong, is the name that
  will be used in game to call the sprite animations

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

### Defense.blend

