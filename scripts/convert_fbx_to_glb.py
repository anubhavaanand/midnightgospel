import bpy
import os
import sys

# Clear scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# FBX path
fbx_path = '/home/anubhavanand/Documents/midnight/public/models/fallen-angel-demon-knight-with-dual-wings/source/Sensenmonster.fbx'

# Enable FBX addon if not already
if "io_scene_fbx" not in bpy.context.preferences.addons:
    bpy.ops.preferences.addon_enable(module="io_scene_fbx")

# Import using the low-level io_scene_fbx module
from io_scene_fbx import import_fbx
import_fbx.load(
    context=bpy.context,
    filepath=fbx_path
)

print(f"Imported: {len(bpy.data.objects)} objects")
for obj in bpy.data.objects[:5]:
    print(f"  - {obj.name} ({obj.type})")

# Export as GLB with Draco compression
output_path = '/home/anubhavanand/Documents/midnight/public/models/fallen-angel-demon-knight-with-dual-wings/fallen_angel.glb'
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6
)

# Check file size
size_mb = os.path.getsize(output_path) / (1024 * 1024)
print(f"Exported to {output_path} ({size_mb:.2f} MB)")
