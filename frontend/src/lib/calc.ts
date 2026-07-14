export interface CalcInputs {
  flatCount: number;
  rooftopSolarKw: number;
  dailySurplusUnits: number;
  netMeteringRate: number;       // Rs/unit
  discomImportRate: number;      // Rs/unit
  revenueSplitCustomerPct: number; // e.g., 60
  revenueSplitCompanyPct: number;  // e.g., 40
}

export interface CalcOutputs {
  baselineDailyValue: number;
  platformDailyValue: number;
  extraValueCreatedDaily: number;
  customerDailyEarning: number;
  companyDailyRevenue: number;
  
  baselineMonthlyValue: number;
  platformMonthlyValue: number;
  extraValueCreatedMonthly: number;
  customerMonthlyEarning: number;
  companyMonthlyRevenue: number;

  baselineAnnualValue: number;
  platformAnnualValue: number;
  extraValueCreatedAnnual: number;
  customerAnnualEarning: number;
  companyAnnualRevenue: number;
}

export function calculateRevenue(inputs: CalcInputs): CalcOutputs {
  const dailySurplusUnits = inputs.dailySurplusUnits || 0;
  const netMeteringRate = inputs.netMeteringRate ?? 2.0;
  const discomImportRate = inputs.discomImportRate ?? 8.5;
  const revenueSplitCustomerPct = inputs.revenueSplitCustomerPct ?? 60.0;
  const revenueSplitCompanyPct = inputs.revenueSplitCompanyPct ?? 40.0;

  const baselineDailyValue = dailySurplusUnits * netMeteringRate;
  const platformDailyValue = dailySurplusUnits * discomImportRate;
  const extraValueCreatedDaily = Math.max(0, platformDailyValue - baselineDailyValue);
  
  const customerDailyEarning = extraValueCreatedDaily * (revenueSplitCustomerPct / 100);
  const companyDailyRevenue = extraValueCreatedDaily * (revenueSplitCompanyPct / 100);

  return {
    baselineDailyValue,
    platformDailyValue,
    extraValueCreatedDaily,
    customerDailyEarning,
    companyDailyRevenue,

    baselineMonthlyValue: baselineDailyValue * 30,
    platformMonthlyValue: platformDailyValue * 30,
    extraValueCreatedMonthly: extraValueCreatedDaily * 30,
    customerMonthlyEarning: customerDailyEarning * 30,
    companyMonthlyRevenue: companyDailyRevenue * 30,

    baselineAnnualValue: baselineDailyValue * 365,
    platformAnnualValue: platformDailyValue * 365,
    extraValueCreatedAnnual: extraValueCreatedDaily * 365,
    customerAnnualEarning: customerDailyEarning * 365,
    companyAnnualRevenue: companyDailyRevenue * 365,
  };
}
