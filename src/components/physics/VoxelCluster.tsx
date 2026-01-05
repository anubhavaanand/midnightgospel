import { useState } from 'react';
import Voxel from './Voxel';

/**
 * Destructible voxel object made of individual cubes.
 * Simulates "ego death" or reality fragmentation when clicked.
 */
interface VoxelClusterProps {
  position: [number, number, number];
  size: [number, number, number]; // Width, height, depth in voxels
  colorPalette: string[];
  isPhysical: boolean;
}

export default function VoxelCluster({ position, size, colorPalette, isPhysical }: VoxelClusterProps) {
  const [voxels, setVoxels] = useState<Array<{ id: string; pos: [number, number, number]; color: string }>>([]);

  // Generate voxel grid
  const generateVoxels = () => {
    const [w, h, d] = size;
    const newVoxels = [];
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        for (let z = 0; z < d; z++) {
          newVoxels.push({
            id: `${x}-${y}-${z}`,
            pos: [
              position[0] + x - w / 2,
              position[1] + y - h / 2,
              position[2] + z - d / 2,
            ] as [number, number, number],
            color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
          });
        }
      }
    }
    setVoxels(newVoxels);
  };

  // Initialize voxels on mount
  useState(() => {
    generateVoxels();
  });

  const handleVoxelDestroy = (id: string) => {
    setVoxels((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <group position={position}>
      {voxels.map((voxel) => (
        <Voxel
          key={voxel.id}
          position={voxel.pos}
          color={voxel.color}
          isPhysical={isPhysical}
          onDestroy={() => handleVoxelDestroy(voxel.id)}
        />
      ))}
    </group>
  );
}
