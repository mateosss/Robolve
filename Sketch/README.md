# TODO: Finish this, should explain the rules of every file and how to use them

# Icons

- Get icons from here https://materialdesignicons.com/
- Generate font in http://fontello.com/ with the icons
- Replace res/fonts/icons.ttf font
- Refresh Icon class in components.js with new names and codes

# Sketch Folder

This folder contains automated blend files and other assets that helps with the generation of sprites

## Blend Files

General Rules:

  - The lamp emission is 6.59 and has a strategic position, because it makes the color of the
    top face material be the same as the diffuse color (got by try and error)
  - Distance of multiples of 8
  - Put an asterisk in a object name if it is a meta object, like a lamp or
    an empty, that way it will be always i
mported and will appears first in the outliner
  - Also if it has an asterisk in the name, then you should not delete it because it is important
  - May or may not cause problems: When executing a script make sure that you let the blender windows focused

### Robots.blend

  - Color Swap: The color swap is a taken from the material design guidelines, electric:yellow, fire:red, water:blue,
    for darkenning or lightening the color scale two steps, (e.g. yellow 500 lighten-1 would be yellow 300). Use the
    complementaries on the color wheel in the same way for details, and the black/white/greys for more details

  - The names of the parts are [PartNameInCamelCase][PartNumber]_[SpriteName], e.g. `Head1_fireStrong`,
    where Head1 is an identifier saying it is a Head, an is the number 1 head, and fireStrong, is the name that
    will be used in game to call the sprite animations

### Defense.blend

  - *DefenseFloor is the reference to which you should adjust when making the defense bases, be sure to not surpass it
    or better yet, make sure to put a boolean modifier and apply it when you finish the model.

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
