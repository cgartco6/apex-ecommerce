import { loadVehicleModel } from './vehicleModels.js';
import { projectImageOnMesh } from './textureMapper.js';

export async function generateWrap(clientRequest) {
  const { vehicleType, style, brandColors } = clientRequest;
  const model = await loadVehicleModel(vehicleType);
  const generatedImage = await generateDesign(clientRequest.prompt, style);
  const wrapped = await projectImageOnMesh(generatedImage, model);
  return wrapped; // URL of 3D rendered image
}
