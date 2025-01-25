export const createContractState = {
  personalData: {
    fullName: "",
    noktp: "",
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
      { type: "deduction", amount: "", name: "Potongan BPJS Kesehatan", amountType: "percent" },
      { type: "deduction", amount: "", name: "Pootngan BPJS JHT", amountType: "percent" },
      { type: "deduction", amount: "", name: "Potongan BPJS JKK", amountType: "percent" },
      { type: "deduction", amount: "", name: "Potongan BPJS JKM", amountType: "percent" },
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
