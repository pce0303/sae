import zxcvbn from "zxcvbn";

export const evaluatePasswordStrength = (password) => {
  return password ? zxcvbn(password) : null;
};

export const getStrengthColor = (score) => {
  switch (score) {
    case 0: return "#FF6347";
    case 1: return "#FFA500";
    case 2: return "#FFD700";
    case 3: return "#32CD32";
    case 4: return "#008000";
    default: return "#d3d3d3";
  }
};

export const getProgressColor = (progress) => {
  if (progress <= 25) {
      return '#FF6347';
  } else if (progress <= 50) {
      return '#FFA500'; 
  } else if (progress <= 75) {
      return '#FFD700'; 
  } else {
      return '#32CD32';
  }
};