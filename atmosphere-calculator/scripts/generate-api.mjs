import { resolve } from 'path';
import { generateApi } from 'swagger-typescript-api';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

generateApi({
    name: 'Api.ts',
    output: resolve(__dirname, '../src/api'),
    url: 'http://localhost:8080/swagger.json',
    httpClientType: 'axios',
    generateClient: true,
    generateRouteTypes: true,
    generateResponses: true,
    toJS: false,
    extractRequestParams: true,
    extractRequestBody: true,
    extractEnums: true,
    unwrapResponseData: true,
    defaultResponseAsSuccess: false,
    singleHttpClient: true,
    cleanOutput: true,
    enumNamesAsValues: false,
    moduleNameIndex: 1,
    generateUnionEnums: true,
    typePrefix: '',
    typeSuffix: '',
    enumNamesAsValues: false,
}).catch(console.error);
