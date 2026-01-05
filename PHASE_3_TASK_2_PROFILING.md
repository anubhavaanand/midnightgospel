# Phase 3 Task 2: Performance Profiling Report

**Status**: In Progress  
**Date**: January 4, 2026  
**Target**: Establish baseline metrics for all levels

## Performance Baseline Metrics

### Desktop (Chrome 120)
- **Target FPS**: 60 FPS
- **Target Frame Budget**: 16.67ms
- **GPU Budget**: 10ms max
- **Memory Limit**: 256MB JS Heap

### Mobile (iOS Safari)
- **Target FPS**: 30-40 FPS
- **Target Frame Budget**: 25-33ms
- **GPU Budget**: 15ms max
- **Memory Limit**: 128MB JS Heap

## Level Performance Expectations

### Level 0: Chromatic Void
- **Particle Count**: 400 floating particles
- **Shader Complexity**: Low (FBM noise)
- **Expected FPS**: 55-60 FPS
- **Bottleneck**: Particle update loop

### Level 1: Zombie Apocalypse
- **Instance Count**: 500 instanced zombies
- **Geometry Complexity**: Medium (distorted building)
- **Expected FPS**: 50-60 FPS
- **Bottleneck**: Instanced mesh updates

### Level 2: Clown Planet
- **Instance Count**: 300 clowns + grinder
- **Shader Complexity**: High (vertex displacement)
- **Expected FPS**: 45-55 FPS
- **Bottleneck**: Grinder vertex shader

### Level 3: Ass Cream
- **Instance Count**: 200 space cats
- **Shader Complexity**: Very High (water waves)
- **Expected FPS**: 40-50 FPS
- **Bottleneck**: Water shader calculations

### Level 4: Soul Prison
- **Geometry Count**: 1000+ bones + landscape
- **Shader Complexity**: High (skeletal animation)
- **Expected FPS**: 45-55 FPS
- **Bottleneck**: Bone transformation matrices

### Level 5: The Exit
- **Particle Count**: 1200+ particles
- **Physics**: Gravity + orbital motion
- **Expected FPS**: 35-45 FPS
- **Bottleneck**: Particle physics updates

## Profiling Tools Added

### 1. PerformanceProfiler (`src/utils/performanceProfiler.ts`)
- Frame time tracking
- FPS calculation (60-frame rolling window)
- Percentile analysis (P95, P99)
- Memory usage estimation
- Comprehensive reporting

### 2. usePerformanceMonitor Hook (`src/hooks/usePerformanceMonitor.ts`)
- Integrates with R3F render loop
- Real-time metric updates
- Performance warnings
- Periodic reporting (10s intervals)
- Configurable thresholds

### 3. Enhanced DebugPanel (`src/components/ui/DebugPanel.tsx`)
- Live FPS display (color-coded)
- Frame time in milliseconds
- Estimated GPU time
- Memory usage tracking
- Real-time updates

## Optimization Targets

### High Priority (Phase 3 Task 3)
1. **Reduce Particle Count**
   - Level 5: 1200 → 800 particles
   - Level 0: 400 → 250 particles
   - Expected: +10-15 FPS gain

2. **Optimize Water Shader**
   - Reduce calculation iterations (Level 3)
   - Use texture-based waves instead of procedural
   - Expected: +8-12 FPS gain

3. **Instanced Mesh Culling**
   - Remove off-screen instances
   - Use frustum culling
   - Expected: +5-8 FPS gain

### Medium Priority
4. **Post-Processing Optimization**
   - Disable effects on low-end devices
   - Use lower resolution bloom
   - Expected: +5-10 FPS gain

5. **Texture Compression**
   - Use KTX2 format for all textures
   - Draco compression on models
   - Expected: 20-40% VRAM savings

### Low Priority
6. **Memory Optimization**
   - Lazy load assets per level
   - Dispose unused resources
   - Expected: 30% memory reduction

## Data Collection Method

### Browser DevTools
```javascript
// Open console and run:
console.log(profiler.generateReport());
```

### Real-time Monitoring
- DebugPanel shows live metrics
- Console logs every 10 seconds
- Warnings for threshold breaches

### Export Metrics
```javascript
const stats = profiler.getFrameStats();
console.table(stats);
```

## Next Steps (Phase 3 Task 3)
1. Profile each level independently
2. Identify specific bottlenecks
3. Implement targeted optimizations
4. Measure improvement before/after
5. Validate mobile performance
