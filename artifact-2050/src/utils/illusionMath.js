// utils/illusionMath.js
export class IllusionCalculator {
  // Calculate the "impossibility factor" of a configuration
  static calculateImpossibility(vertices, cameraPosition) {
    // This measures how "impossible" the geometry appears
    let impossibilityScore = 0;
    
    // Check for inconsistent depth cues
    for (let i = 0; i < vertices.length; i += 3) {
      const v1 = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
      
      for (let j = i + 3; j < vertices.length; j += 3) {
        const v2 = new THREE.Vector3(vertices[j], vertices[j + 1], vertices[j + 2]);
        
        // Calculate apparent distance vs actual distance
        const actualDistance = v1.distanceTo(v2);
        const apparentDistance = this.calculateApparentDistance(v1, v2, cameraPosition);
        
        // The more these differ, the more "impossible" it is
        const discrepancy = Math.abs(actualDistance - apparentDistance);
        impossibilityScore += discrepancy;
      }
    }
    
    return impossibilityScore / (vertices.length / 3);
  }
  
  static calculateApparentDistance(v1, v2, cameraPosition) {
    // Project vertices to 2D screen space
    const screenV1 = this.projectToScreen(v1, cameraPosition);
    const screenV2 = this.projectToScreen(v2, cameraPosition);
    
    // Return 2D distance (what the eye sees)
    return Math.sqrt(
      Math.pow(screenV1.x - screenV2.x, 2) +
      Math.pow(screenV1.y - screenV2.y, 2)
    );
  }
  
  static projectToScreen(vertex, cameraPosition) {
    // Simple orthographic projection for isometric view
    return {
      x: (vertex.x - vertex.z) * Math.cos(Math.PI / 4),
      y: vertex.y + (vertex.x + vertex.z) * Math.sin(Math.PI / 4)
    };
  }
  
  // Find the optimal camera position for maximum illusion
  static findOptimalCameraPosition(vertices) {
    let bestScore = 0;
    let bestPosition = new THREE.Vector3(15, 10, 15);
    
    // Sample different camera positions
    for (let azimuth = 0; azimuth < Math.PI * 2; azimuth += Math.PI / 8) {
      for (let elevation = Math.PI / 6; elevation < Math.PI / 3; elevation += Math.PI / 12) {
        const distance = 15;
        const position = new THREE.Vector3(
          distance * Math.cos(azimuth) * Math.cos(elevation),
          distance * Math.sin(elevation),
          distance * Math.sin(azimuth) * Math.cos(elevation)
        );
        
        const score = this.calculateImpossibility(vertices, position);
        
        if (score > bestScore) {
          bestScore = score;
          bestPosition.copy(position);
        }
      }
    }
    
    return { position: bestPosition, score: bestScore };
  }
}