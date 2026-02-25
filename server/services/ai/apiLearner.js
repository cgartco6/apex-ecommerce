import { generateCode } from './codeGen.js';

export async function learnAPI(apiDocUrl) {
  const spec = await fetch(apiDocUrl).then(r => r.json());
  const code = generateCode(spec);
  // Write to /server/integrations/newApi.js
  await fs.writeFile(`./integrations/${spec.info.title}.js`, code);
  // Automatically create routes and frontend components
  scaffoldAPI(spec);
}
