# 3D Tiles

Not started. I implement this.

A city is not one mesh. It is a tree: each node has a bounding volume, a geometric error, and optional content. You refine what the camera needs and ignore the rest. That is LOD and culling with coordinates attached.

This sits after the vector-tile renderer. MVT is “a map is tiles of meaning.” 3D Tiles is the same sentence for buildings, terrain, and point clouds.

Study the OGC 3D Tiles community standard. Implementation and visualization will be my own — not Cesium’s renderer, and not copied spec figures.
