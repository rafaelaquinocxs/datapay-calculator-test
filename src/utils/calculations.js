import { 
  CALCULATION_WEIGHTS, 
  BASE_VALUES, 
  GENDER_OPTIONS, 
  INCOME_RANGES 
} from '../types/index.js';

// Função para calcular a faixa etária
export const getAgeRange = (age) => {
  const ageNum = parseInt(age);
  if (ageNum >= 18 && ageNum <= 24) return '18-24';
  if (ageNum >= 25 && ageNum <= 34) return '25-34';
  if (ageNum >= 35 && ageNum <= 44) return '35-44';
  if (ageNum >= 45 && ageNum <= 54) return '45-54';
  return '55+';
};

// Calcular valor demográfico
export const calculateDemographicsValue = (personalInfo) => {
  let value = 0;
  
  // Valor base por idade
  if (personalInfo.age) {
    const ageRange = getAgeRange(personalInfo.age);
    const ageMultiplier = BASE_VALUES.DEMOGRAPHICS.AGE_MULTIPLIERS[ageRange] || 1.0;
    value += 40 * ageMultiplier;
  }
  
  // Valor por gênero
  if (personalInfo.gender) {
    const genderMultiplier = BASE_VALUES.DEMOGRAPHICS.GENDER_MULTIPLIERS[personalInfo.gender] || 1.0;
    value *= genderMultiplier;
  }
  
  // Valor por localização (base fixa)
  if (personalInfo.location) {
    value += BASE_VALUES.DEMOGRAPHICS.LOCATION_BASE;
  }
  
  return Math.round(value);
};

// Calcular valor de hábitos digitais
export const calculateDigitalHabitsValue = (digitalHabits) => {
  let value = 0;
  
  // Valor por redes sociais
  if (digitalHabits.socialNetworks && digitalHabits.socialNetworks.length > 0) {
    digitalHabits.socialNetworks.forEach(network => {
      const networkValue = BASE_VALUES.DIGITAL_HABITS.SOCIAL_NETWORK_VALUES[network] || 0;
      value += networkValue;
    });
  }
  
  // Multiplicador por frequência de uso
  if (digitalHabits.usageFrequency) {
    const frequencyMultiplier = digitalHabits.usageFrequency * BASE_VALUES.DIGITAL_HABITS.FREQUENCY_MULTIPLIER;
    value += frequencyMultiplier;
  }
  
  return Math.round(value);
};

// Calcular valor de consumo
export const calculateConsumptionValue = (consumption) => {
  let value = 0;
  
  // Valor por canais de compra
  if (consumption.shoppingChannels && consumption.shoppingChannels.length > 0) {
    consumption.shoppingChannels.forEach(channel => {
      const channelValue = BASE_VALUES.CONSUMPTION.CHANNEL_VALUES[channel] || 0;
      value += channelValue;
    });
  }
  
  // Valor por categorias favoritas
  if (consumption.favoriteCategories && consumption.favoriteCategories.length > 0) {
    consumption.favoriteCategories.forEach(category => {
      const categoryValue = BASE_VALUES.CONSUMPTION.CATEGORY_VALUES[category] || 0;
      value += categoryValue;
    });
  }
  
  return Math.round(value);
};

// Calcular valor de saúde
export const calculateHealthValue = (health) => {
  let value = 0;
  
  // Valor por interesses em saúde
  if (health.healthInterests && health.healthInterests.length > 0) {
    health.healthInterests.forEach(interest => {
      const interestValue = BASE_VALUES.HEALTH.INTEREST_VALUES[interest] || 0;
      value += interestValue;
    });
  }
  
  return Math.round(value);
};

// Calcular valor de dados avançados
export const calculateAdvancedValue = (advanced) => {
  let value = 30; // Valor base
  
  // Multiplicador por faixa de renda
  if (advanced.incomeRange) {
    const incomeMultiplier = BASE_VALUES.ADVANCED.INCOME_MULTIPLIERS[advanced.incomeRange] || 1.0;
    value *= incomeMultiplier;
  }
  
  // Multiplicador por área profissional
  if (advanced.professionalArea) {
    const professionalMultiplier = BASE_VALUES.ADVANCED.PROFESSIONAL_MULTIPLIERS[advanced.professionalArea] || 1.0;
    value *= professionalMultiplier;
  }
  
  return Math.round(value);
};

// Função principal para calcular o valor total
export const calculateTotalValue = (formData) => {
  // Calcular valores individuais
  const demographicsValue = calculateDemographicsValue(formData.personalInfo);
  const digitalHabitsValue = calculateDigitalHabitsValue(formData.digitalHabits);
  const consumptionValue = calculateConsumptionValue(formData.consumption);
  const healthValue = calculateHealthValue(formData.health);
  const advancedValue = calculateAdvancedValue(formData.advanced);
  
  // Aplicar pesos
  const weightedDemographics = demographicsValue * CALCULATION_WEIGHTS.DEMOGRAPHICS;
  const weightedDigitalHabits = digitalHabitsValue * CALCULATION_WEIGHTS.DIGITAL_HABITS;
  const weightedConsumption = consumptionValue * CALCULATION_WEIGHTS.CONSUMPTION;
  const weightedHealth = healthValue * CALCULATION_WEIGHTS.HEALTH;
  const weightedAdvanced = advancedValue * CALCULATION_WEIGHTS.ADVANCED;
  
  // Calcular valor total
  const totalValue = weightedDemographics + weightedDigitalHabits + weightedConsumption + weightedHealth + weightedAdvanced;
  
  return {
    total: Math.round(totalValue),
    breakdown: {
      demographics: Math.round(weightedDemographics),
      digitalHabits: Math.round(weightedDigitalHabits),
      consumption: Math.round(weightedConsumption),
      health: Math.round(weightedHealth),
      advanced: Math.round(weightedAdvanced)
    },
    rawValues: {
      demographics: demographicsValue,
      digitalHabits: digitalHabitsValue,
      consumption: consumptionValue,
      health: healthValue,
      advanced: advancedValue
    }
  };
};

// Função para gerar insights baseados nos dados
export const generateInsights = (formData, calculationResult) => {
  const insights = [];
  
  // Insights sobre redes sociais
  if (formData.digitalHabits.socialNetworks.length > 3) {
    insights.push('Sua presença em múltiplas redes sociais aumenta significativamente o valor dos seus dados');
  }
  
  // Insights sobre consumo
  if (formData.consumption.favoriteCategories.includes('eletronicos')) {
    insights.push('Seu interesse em eletrônicos é altamente valorizado por empresas de tecnologia');
  }
  
  // Insights sobre renda
  if (formData.advanced.incomeRange === INCOME_RANGES.ACIMA_8000) {
    insights.push('Sua faixa de renda coloca você em um segmento premium muito procurado');
  }
  
  // Insights sobre área profissional
  if (formData.advanced.professionalArea === 'tecnologia') {
    insights.push('Profissionais de tecnologia têm dados especialmente valiosos para o mercado B2B');
  }
  
  return insights;
};
