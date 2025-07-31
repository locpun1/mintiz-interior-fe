// fill data to pattern's params
export const prepareRealPath = (
  pattern: string = '',
  params: Record<string, string | number> = {},
) => {
  let path = pattern;

  Object.keys(params).forEach((key) => {
    const value = params[key]?.toString();
    path = path.replace(`:${key}`, value);
  });

  return path;
};

//Get url image
const apiBaseUrl = 'http://localhost:3002'
export function getPathImage(path: string) : string {
  if(!path){
    return "";
  }
  return `${apiBaseUrl.replace(/\/$/, '')}${path}`
}