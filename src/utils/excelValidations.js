export const validateHeaders = (headers, expectedHeaders) => {
  const errors = [];

  if (headers.length !== expectedHeaders.length) {
    errors.push({
      error: "Jumlah header tidak sesuai",
      expectedLength: expectedHeaders.length,
      receivedLength: headers.length,
    });

    return {
      error: "Header tidak sesuai",
      errors,
    };
  }

  headers.forEach((header, index) => {
    if (header.toLowerCase() !== expectedHeaders[index].toLowerCase()) {
      errors.push({
        index,
        expected: expectedHeaders[index],
        received: header,
      });
    }
  });

  return errors.length > 0
    ? {
        error: "Header tidak sesuai",
        errors,
      }
    : null;
};

export const validateData = (data) => {
  const errors = [];

  data.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      switch (colIndex) {
        case 0: // No
          if (typeof cell !== "number" || isNaN(cell)) {
            errors.push(`Row ${rowIndex + 2}, Column 1: "No" harus berupa angka`);
          }
          break;
        case 1:
        case 2:
        case 3:
        case 6:
          if (typeof cell !== "string" || cell.trim() === "") {
            errors.push(`Row ${rowIndex + 2}, Column ${colIndex + 1}: Harus berupa teks`);
          }
          break;
        case 4: // Tanggal Lahir
          const date = new Date(cell);
          if (isNaN(date.getTime())) {
            errors.push(`Row ${rowIndex + 2}, Column 5: Tanggal Lahir tidak valid`);
          }
          break;
        case 5: // No KTP
          if (typeof cell !== "number" || isNaN(cell)) {
            errors.push(`Row ${rowIndex + 2}, Column 6: No KTP harus berupa angka`);
          }
          break;
      }
    });
  });

  return errors.length > 0 ? errors : null;
};

export const processExcelData = (excelData) => {
  return excelData.slice(1).map((row) =>
    row.map((cell) => {
      if (typeof cell === "number" && !isNaN(cell)) {
        const date = new Date(Math.round((cell - 25569) * 864e5));
        if (date.getFullYear() > 1900) {
          return date.toLocaleDateString("en-CA");
        }
      }
      return cell;
    })
  );
};
