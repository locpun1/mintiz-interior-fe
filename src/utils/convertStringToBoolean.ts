
export const convertStringToBoolean = (value: string) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value; 
}