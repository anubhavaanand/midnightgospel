#!/usr/bin/env blender --background --python
"""
Export project GLB models with Draco compression.

Usage:
  blender --background --python scripts/export-models.py -- /path/to/source.blend /path/to/output.glb

Batch convert all .blend files in a directory:
  for f in /path/to/source/*.blend; do
    blender --background --python scripts/export-models.py -- "$f" "public/models/$(basename "$f" .blend).glb"
  done
"""

import bpy
import sys
import os

argv = sys.argv
argv = argv[argv.index("--") + 1:] if "--" in argv else []

if len(argv) < 2:
    print("Usage: blender --background --python export-models.py -- <input.blend> <output.glb>")
    sys.exit(1)

input_path, output_path = argv[0], argv[1]

bpy.ops.wm.open_mainfile(filepath=input_path)

os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_apply=True,
    export_image_format='JPEG',
    export_jpeg_quality=85,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_draco_position_quantization=14,
    export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=12,
    export_texcoords=True,
    export_normals=True,
    export_materials='EXPORT',
    export_colors=True,
    export_cameras=False,
    export_lights=False,
    export_animations=True,
    use_selection=False,
)

print(f"Exported: {input_path} -> {output_path} ({os.path.getsize(output_path) / 1024:.1f} KB)")
