export const createContractState = {
  personalData: {
    fullName: "",
    NoKTP: "",
    gender: "",
    religion: "",
    placeOfBirth: "",
    dateOfBirth: "",
    address: "",
  },
  contractData: {
    employementStatus: "Contract",
    salaryType: "Monthly",
    startDate: "",
    jobRole: "",
    endDate: "",
    scopeOfWork: [],
  },
  benefits: {
    adjustment: [
      { type: "deduction", amount: "", name: "BPJS Kesehatan", amountType: "percent" },
      { type: "deduction", amount: "", name: "BPJS Jaminan Hari Tua", amountType: "percent" },
      { type: "deduction", amount: "", name: "BPJS Jaminan Pensiun", amountType: "percent" },
    ],
    bpjsKesehatanNumber: "",
    bpjsKetenagakerjaanNumber: "",
    assets: [],
  },
  salary: {
    bankName: "",
    bankAccountNumber: "",
    basicSalary: "",
  },
};
