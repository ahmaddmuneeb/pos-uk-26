/* Seed data for the POS UK web app (fake, in-memory). Mirrors PRD entities. */
window.POSDATA = {
  user: { fullName: "Imran Khalid", initials: "IK", role: "System Administrator" },
  branch: "Birmingham — Central",
  branches: [
    { id: "b1", code: "BR-01", name: "Birmingham — Central", phone: "0121 496 0011", vat: "GB 432 8891 02", head: true, active: true },
    { id: "b2", code: "BR-02", name: "Manchester — Trafford", phone: "0161 882 4420", vat: "GB 432 8891 02", head: false, active: true },
    { id: "b3", code: "BR-03", name: "London — Stratford", phone: "0208 553 9001", vat: "GB 432 8891 02", head: false, active: true },
  ],
  stats: { invoicesTotal: "£48,210.00", invoicesCount: 128, receiptsTotal: "£39,540.00", receiptsCount: 96, receivables: 37, lowStock: 8 },
  customerTypes: [
    { id: "ct1", name: "Retail", customers: 41 },
    { id: "ct2", name: "Wholesale", customers: 58 },
    { id: "ct3", name: "Corporate", customers: 12 },
  ],
  customers: [
    { id: "c1", code: "CUST-0001", name: "Acme Trading Ltd", contact: "John Mason", type: "Wholesale", phone: "0121 496 0011", email: "ap@acmetrading.co.uk", vat: "GB 712 3345 01", balance: "£1,240.00", active: true },
    { id: "c2", code: "CUST-0002", name: "Brightwell & Co", contact: "Sara Hughes", type: "Wholesale", phone: "0161 882 4420", email: "accounts@brightwell.co.uk", vat: "GB 998 1120 77", balance: "£460.50", active: true },
    { id: "c3", code: "CUST-0003", name: "Corner Shop Express", contact: "Amir Patel", type: "Retail", phone: "0121 770 1188", email: "amir@cornershop.uk", vat: "—", balance: "£312.00", active: true },
    { id: "c4", code: "CUST-0004", name: "Halal Meats Wholesale", contact: "Bilal Khan", type: "Wholesale", phone: "0208 553 9001", email: "orders@halalmeats.uk", vat: "GB 451 2290 18", balance: "£0.00", active: true },
    { id: "c5", code: "CUST-0005", name: "Riverside Cafe", contact: "Ella Wood", type: "Retail", phone: "0161 224 7766", email: "hello@riversidecafe.uk", vat: "—", balance: "£88.20", active: false },
    { id: "c6", code: "CUST-0006", name: "Northgate Pharmacy", contact: "Dr. R. Singh", type: "Corporate", phone: "0113 245 8890", email: "stock@northgatepharm.uk", vat: "GB 220 7781 44", balance: "£927.40", active: true },
  ],
  customerHistory: [
    { type: "Invoice", doc: "INV-1042", date: "2026-06-10", amount: "£1,240.00", balance: "£1,240.00", status: "Unpaid", tone: "danger" },
    { type: "Receipt", doc: "RCP-0501", date: "2026-06-10", amount: "£1,240.00", balance: "£0.00", status: "Paid", tone: "success" },
    { type: "Invoice", doc: "INV-1051", date: "2026-06-12", amount: "£860.50", balance: "£860.50", status: "Partially Paid", tone: "warning" },
    { type: "Receipt", doc: "RCP-0509", date: "2026-06-13", amount: "£400.00", balance: "£460.50", status: "Partially Paid", tone: "warning" },
  ],
  salePersons: [
    { id: "sp1", name: "Daniel Carter", designation: "Senior Sales Exec", region: "Midlands", commission: "2.5%", status: "Active" },
    { id: "sp2", name: "Priya Sharma", designation: "Sales Executive", region: "North West", commission: "2.0%", status: "Active" },
    { id: "sp3", name: "Tom Fielding", designation: "Sales Executive", region: "London", commission: "2.0%", status: "Inactive" },
  ],
  receipts: [
    { id: "r1", code: "RCP-0501", customer: "Acme Trading Ltd", amount: "£1,240.00", mode: "BANK_TRANSFER", ref: "FT-22119", date: "2026-06-10" },
    { id: "r2", code: "RCP-0502", customer: "Brightwell & Co", amount: "£400.00", mode: "CASH", ref: "—", date: "2026-06-11" },
    { id: "r3", code: "RCP-0503", customer: "Halal Meats Wholesale", amount: "£4,180.75", mode: "CHEQUE", ref: "CHQ-00841", date: "2026-06-12" },
  ],
  categories: [
    { id: "cat1", code: "CAT-01", name: "Grocery", items: 142, active: true },
    { id: "cat2", code: "CAT-02", name: "Beverages", items: 64, active: true },
    { id: "cat3", code: "CAT-03", name: "Packaging", items: 28, active: true },
    { id: "cat4", code: "CAT-04", name: "Household", items: 51, active: false },
  ],
  subCategories: [
    { id: "sc1", code: "SUB-01", parent: "Grocery", name: "Rice & Grains", items: 38 },
    { id: "sc2", code: "SUB-02", parent: "Grocery", name: "Oils & Ghee", items: 22 },
    { id: "sc3", code: "SUB-03", parent: "Beverages", name: "Soft Drinks", items: 31 },
    { id: "sc4", code: "SUB-04", parent: "Packaging", name: "Bags & Wrap", items: 14 },
  ],
  uoms: [
    { id: "u1", code: "UOM-01", name: "Pieces" }, { id: "u2", code: "UOM-02", name: "Kilogram" },
    { id: "u3", code: "UOM-03", name: "Litre" }, { id: "u4", code: "UOM-04", name: "Box" }, { id: "u5", code: "UOM-05", name: "Case" },
  ],
  locations: [
    { id: "l1", code: "LOC-01", name: "Main Warehouse" }, { id: "l2", code: "LOC-02", name: "Showroom" }, { id: "l3", code: "LOC-03", name: "Shop Floor" },
  ],
  products: [
    { id: "p1", sku: "SKU-1001", name: "Basmati Rice 20kg", type: "Finished", category: "Grocery", sub: "Rice & Grains", uom: "Box", purchase: "26.00", wholesale: "29.50", retail: "32.50", location: "Main Warehouse", qty: 240, reorder: 60, barcode: "5012345678900", active: true },
    { id: "p2", sku: "SKU-1002", name: "Sunflower Oil 5L", type: "Finished", category: "Grocery", sub: "Oils & Ghee", uom: "Case", purchase: "7.40", wholesale: "8.90", retail: "9.80", location: "Main Warehouse", qty: 48, reorder: 60, barcode: "5012345678917", active: true },
    { id: "p3", sku: "SKU-1003", name: "Chopped Tomatoes 2.5kg", type: "Finished", category: "Grocery", sub: "Rice & Grains", uom: "Case", purchase: "2.60", wholesale: "3.10", retail: "3.40", location: "Showroom", qty: 12, reorder: 40, barcode: "5012345678924", active: true },
    { id: "p4", sku: "SKU-1004", name: "Chickpeas 3kg", type: "Finished", category: "Grocery", sub: "Rice & Grains", uom: "Box", purchase: "3.80", wholesale: "4.40", retail: "4.95", location: "Main Warehouse", qty: 96, reorder: 30, barcode: "5012345678931", active: true },
    { id: "p5", sku: "SKU-1005", name: "Paper Bags 500ct", type: "Finished", category: "Packaging", sub: "Bags & Wrap", uom: "Box", purchase: "9.50", wholesale: "10.80", retail: "12.00", location: "Shop Floor", qty: 8, reorder: 25, barcode: "5012345678948", active: true },
    { id: "p6", sku: "SKU-1006", name: "Cola 330ml 24pk", type: "Finished", category: "Beverages", sub: "Soft Drinks", uom: "Case", purchase: "5.20", wholesale: "6.10", retail: "6.95", location: "Showroom", qty: 180, reorder: 48, barcode: "5012345678955", active: true },
  ],
  orders: [
    { id: "o1", no: "SO-2087", date: "2026-06-09", customer: "Acme Trading Ltd", person: "Daniel Carter", total: "£1,240.00", vat: true },
    { id: "o2", no: "SO-2088", date: "2026-06-10", customer: "Halal Meats Wholesale", person: "Daniel Carter", total: "£4,180.75", vat: true },
    { id: "o3", no: "SO-2089", date: "2026-06-11", customer: "Corner Shop Express", person: "Priya Sharma", total: "£312.00", vat: false },
  ],
  invoices: [
    { id: "i1", no: "INV-1042", date: "2026-06-10", due: "2026-06-24", customer: "Acme Trading Ltd", net: "£1,240.00", paid: "£1,240.00", outstanding: "£0.00", status: "Paid", tone: "success", vat: true },
    { id: "i2", no: "INV-1043", date: "2026-06-11", due: "2026-06-25", customer: "Brightwell & Co", net: "£860.50", paid: "£400.00", outstanding: "£460.50", status: "Partial", tone: "warning", vat: true },
    { id: "i3", no: "INV-1044", date: "2026-06-11", due: "2026-06-18", customer: "Corner Shop Express", net: "£312.00", paid: "£0.00", outstanding: "£312.00", status: "Overdue", tone: "danger", vat: false },
    { id: "i4", no: "INV-1045", date: "2026-06-12", due: "2026-06-26", customer: "Halal Meats Wholesale", net: "£4,180.75", paid: "£4,180.75", outstanding: "£0.00", status: "Paid", tone: "success", vat: true },
    { id: "i5", no: "INV-1046", date: "2026-06-13", due: "2026-06-27", customer: "Northgate Pharmacy", net: "£927.40", paid: "£0.00", outstanding: "£927.40", status: "Draft", tone: "info", vat: true },
  ],
  returns: [
    { id: "sr1", no: "SR-0312", date: "2026-06-12", saleNo: "INV-1042", customer: "Acme Trading Ltd", person: "Daniel Carter", subtotal: "£120.00", vat: "£24.00", total: "£144.00" },
    { id: "sr2", no: "SR-0313", date: "2026-06-13", saleNo: "INV-1043", customer: "Brightwell & Co", person: "Priya Sharma", subtotal: "£60.00", vat: "£12.00", total: "£72.00" },
  ],
  users: [
    { id: "us1", username: "admin", fullName: "Imran Khalid", role: "System Administrator", branch: "Birmingham — Central", isAdmin: true, status: "Active", lastLogin: "2026-06-14 08:42" },
    { id: "us2", username: "dcarter", fullName: "Daniel Carter", role: "Sales Staff", branch: "Birmingham — Central", isAdmin: false, status: "Active", lastLogin: "2026-06-14 08:05" },
    { id: "us3", username: "psharma", fullName: "Priya Sharma", role: "Sales Staff", branch: "Manchester — Trafford", isAdmin: false, status: "Active", lastLogin: "2026-06-13 17:20" },
    { id: "us4", username: "afinance", fullName: "Aisha Noor", role: "Finance / Accounts", branch: "Birmingham — Central", isAdmin: false, status: "Active", lastLogin: "2026-06-14 09:11" },
    { id: "us5", username: "tfielding", fullName: "Tom Fielding", role: "Sales Staff", branch: "London — Stratford", isAdmin: false, status: "Inactive", lastLogin: "2026-05-30 14:02" },
  ],
  activity: [
    { docNo: "INV-1046", docType: "Sale Invoice", action: "Created", user: "Daniel Carter", at: "2026-06-13 16:40", tone: "success" },
    { docNo: "CUST-0006", docType: "Customer", action: "Updated", user: "Aisha Noor", at: "2026-06-13 15:02", tone: "info" },
    { docNo: "SR-0313", docType: "Sale Return", action: "Created", user: "Priya Sharma", at: "2026-06-13 11:55", tone: "success" },
    { docNo: "SO-2089", docType: "Sale Order", action: "Deleted", user: "Daniel Carter", at: "2026-06-12 18:21", tone: "danger" },
    { docNo: "RCP-0503", docType: "Receipt", action: "Created", user: "Aisha Noor", at: "2026-06-12 10:08", tone: "success" },
  ],
  // RBAC matrix scaffold
  rightsModules: [
    { module: "Company", screens: ["Customers", "Customer Types", "Receipts", "Sale Persons", "Company Reports"] },
    { module: "Product", screens: ["Categories", "Sub Categories", "Products", "Stock Locations", "UOM", "Stock Reports"] },
    { module: "Sale", screens: ["Sale Orders", "Sale Invoices", "Sale Returns", "Sales Registers"] },
    { module: "Administration", screens: ["Branches", "Users", "User Rights", "Preferences", "Bulk Import", "Admin Reports"] },
  ],
};
