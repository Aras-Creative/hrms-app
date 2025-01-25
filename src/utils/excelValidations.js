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

export const validateEmployeeData = (data) => {
  const errors = [];

  const validatedData = data
    .slice(1)
    .filter((row) => row.length > 0 && row.some((cell) => cell !== ""))
    .map((row, rowIndex) => {
      const newRow = [...row];
      row.forEach((cell, colIndex) => {
        switch (colIndex) {
          case 0:
            if (typeof cell !== "number" || isNaN(cell)) {
              errors.push(`Row ${rowIndex + 2}, Column 1: "No" harus berupa angka`);
            }
            break;
          case 1:
          case 2:
          case 4:
          case 5:
            if (typeof cell !== "string" || cell.trim() === "") {
              errors.push(`Row ${rowIndex + 2}, Column ${colIndex + 1}: Harus berupa teks`);
            }
            break;
          default:
            break;
        }
      });
      return newRow;
    });

  return errors.length > 0 ? { errors, data: null } : { errors: null, data: validatedData };
};

export const validatePayrollData = (data) => {
  const errors = [];
  const headers = data[0];

  if (data.length > 100) {
    errors.push("Jumlah baris tidak boleh lebih dari 100.");
    return { errors, data: null };
  }

  const validatedData = data
    .slice(1)
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row, rowIndex) => {
      const rowObject = {};

      headers.forEach((header, colIndex) => {
        const cell = row[colIndex];

        if (header === "No" && (typeof cell !== "number" || isNaN(cell))) {
          errors.push(`Row ${rowIndex + 2}, Column "${header}": Harus berupa angka`);
        }

        if (header === "Nama" && (typeof cell !== "string" || cell.trim() === "")) {
          errors.push(`Row ${rowIndex + 2}, Column "${header}": Harus berupa teks yang tidak kosong`);
        }

        if (header === "Gaji Pokok" && (typeof cell !== "number" || isNaN(cell))) {
          errors.push(`Row ${rowIndex + 2}, Column "${header}": Harus berupa angka`);
        }

        if (header.includes("Tunjangan") || header.includes("Potongan")) {
          if (typeof cell === "string") {
            const parsedValue = parseFloat(cell);
            if (!isNaN(parsedValue)) {
              if (parsedValue < 1) {
                rowObject[header] = (parsedValue * 100).toFixed(1); // Simpan dalam object
              } else {
                rowObject[header] = parsedValue;
              }
            } else {
              errors.push(`Row ${rowIndex + 2}, Column "${header}": Harus berupa angka atau teks valid`);
            }
          } else if (typeof cell === "number") {
            if (cell < 1) {
              rowObject[header] = (cell * 100).toFixed(1);
            } else {
              rowObject[header] = cell;
            }
          }
        } else {
          rowObject[header] = cell; // Simpan data untuk kolom selain "Tunjangan" atau "Potongan"
        }
      });

      return rowObject; // Mengembalikan row sebagai object
    });

  return errors.length > 0 ? { errors, data: null } : { errors: null, data: validatedData };
};
