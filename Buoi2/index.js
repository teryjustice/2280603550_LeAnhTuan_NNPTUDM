class Student {
  constructor(ho, tenLot, ten, ngaySinh, diem) {
    this.ho = ho;
    this.tenLot = tenLot;
    this.ten = ten;
    this.ngaySinh = new Date(ngaySinh);
    this.diem = diem;
  }

  getFullName() {
    return `${this.ho} ${this.tenLot} ${this.ten}`;
  }

  tinhTBC() {
    if (this.diem.length === 0) return 0;
    const tong = this.diem.reduce((acc, curr) => acc + curr, 0);
    return (tong / this.diem.length).toFixed(2);
  }

  formatNgaySinh() {
    const d = this.ngaySinh.getDate().toString().padStart(2, '0');
    const m = (this.ngaySinh.getMonth() + 1).toString().padStart(2, '0');
    const y = this.ngaySinh.getFullYear();
    return `${d}/${m}/${y}`;
  }

  tinhTuoi() {
    const namHienTai = new Date().getFullYear();
    return namHienTai - this.ngaySinh.getFullYear();
  }

  toJSON() {
    return {
      fullName: this.getFullName(),
      ngaySinh: this.formatNgaySinh(),
      tuoi: this.tinhTuoi(),
      diemTrungBinh: this.tinhTBC(),
      diem: this.diem
    };
  }
}

// Tạo 3 đối tượng
const students = [
  new Student("Nguyễn", "Văn", "A", "2003-05-15", [8, 7, 9]),
  new Student("Trần", "Thị", "B", "2004-10-20", [6, 8, 7.5]),
  new Student("Lê", "Hoàng", "C", "2002-01-05", [9, 9, 10])
];

// In kết quả
students.forEach((s, i) => {
  console.log(`--- Sinh viên ${i + 1} ---`);
  console.log(JSON.stringify(s.toJSON(), null, 2));
});