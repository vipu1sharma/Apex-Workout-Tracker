// Unit conversion and formatting utilities

export const KG_TO_LBS = 2.20462262;

export function convertWeight(val, fromUnit, toUnit) {
  if (val === null || val === undefined || isNaN(val)) return 0;
  const num = parseFloat(val);
  if (fromUnit === toUnit) return num;
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return Math.round(num * KG_TO_LBS * 10) / 10;
  }
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return Math.round((num / KG_TO_LBS) * 10) / 10;
  }
  return num;
}

export function formatWeight(valInKg, targetUnit = 'kg', showUnit = true) {
  if (valInKg === null || valInKg === undefined || isNaN(valInKg)) {
    return showUnit ? `0 ${targetUnit}` : '0';
  }
  const num = parseFloat(valInKg);
  const displayVal = targetUnit === 'lbs' ? Math.round(num * KG_TO_LBS * 10) / 10 : num;
  const formatted = displayVal % 1 === 0 ? displayVal.toString() : displayVal.toFixed(1);
  return showUnit ? `${formatted} ${targetUnit}` : formatted;
}

export function formatVolume(volumeKg, targetUnit = 'kg') {
  if (!volumeKg || isNaN(volumeKg)) return `0 ${targetUnit}`;
  const converted = targetUnit === 'lbs' ? volumeKg * KG_TO_LBS : volumeKg;
  const rounded = Math.round(converted);
  return `${rounded.toLocaleString()} ${targetUnit}`;
}
