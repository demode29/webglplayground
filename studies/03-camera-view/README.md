# Camera / view matrix

`lookAt(eye, target, up)` builds the view matrix as an orthonormal frame: right, camera-up, and the axis backward along the gaze. Projection then maps that camera space to clip space.

On a map this is the same sentence: where is the observer, what are they looking at, what counts as up. GIS often starts orthographic. Perspective is the same pose with a different lens.

Drag to orbit. Wheel to dolly. The HUD is the view matrix, not a screenshot of a camera icon.

Implemented while studying Chapter 2 of Eric Lengyel, *Foundations of Game Engine Development, Volume 1: Mathematics*. Implementation and visualization are my own.
